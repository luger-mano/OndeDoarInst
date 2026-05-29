import React, { useState, useEffect, useRef } from "react";
import { loginRequest, registerRequest, updateUserRequest, getUserById } from "../../services/authService";
import "./UserProfile.css";

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [loggedUser, setLoggedUser] = useState(null);

  // Controle de telas do menu dropdown: "menu", "login", "cadastro" ou "edicao"
  const [menuView, setMenuView] = useState("menu");

  // ESTADOS GERAIS DE FEEDBACK
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. FORMULÁRIO DE LOGIN
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  // 2. FORMULÁRIO DE CADASTRO
  const initialRegisterForm = {
    nome: "", sobrenome: "", email: "", tipoSanguineo: "",
    whatsapp: "", estado: "", senha: "", confirmarSenha: ""
  };
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);

  // 3. FORMULÁRIO DE EDIÇÃO
  const [editForm, setEditForm] = useState({
    nome: "", sobrenome: "", email: "", tipoSanguineo: "",
    whatsapp: "", estado: "", senhaAtual: "", novaSenha: "", confirmarNovaSenha: ""
  });

  const bloodType =
    loggedUser?.bloodType && loggedUser.bloodType !== "Não sei"
      ? loggedUser.bloodType
      : "?";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    }
  }, []);

  // CARREGA DADOS DE EDIÇÃO QUANDO ENTRA NA TELA
  // CARREGA DADOS DE EDIÇÃO QUANDO ENTRA NA TELA
  useEffect(() => {
    async function loadUserDataForEdit() {
      if (menuView !== "edicao" || !loggedUser?.id) return;
      try {
        setLoading(true);
        setError("");

        // 1. Pega o token bruto do localStorage
        let token = localStorage.getItem("token");

        if (!token) {
          return setError("Sessão expirada. Faça login novamente.");
        }

        // 2. Opcional/Garantia: Se o seu authService NÃO colocar o "Bearer " automaticamente,
        // descomente a linha abaixo para garantir que ele vá no cabeçalho:
        // if (!token.startsWith("Bearer ")) token = `Bearer ${token}`;

        const userData = await getUserById(loggedUser.id, token);

        setEditForm({
          nome: userData.userName || "",
          sobrenome: userData.middleName || "",
          email: userData.mail || "",
          tipoSanguineo: userData.bloodType
            ? userData.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")
            : "Não sei",
          whatsapp: userData.phone || "",
          estado: userData.state || "",
          senhaAtual: "",
          novaSenha: "",
          confirmarNovaSenha: ""
        });
      } catch (err) {
        console.error("Erro detalhado na busca:", err);
        setError("Sua sessão expirou ou você não tem permissão.");
      } finally {
        setLoading(false);
      }
    }
    loadUserDataForEdit();
  }, [menuView, loggedUser]);

  // FECHAR MENU AO CLICAR FORA
  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        resetAllViews();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const resetAllViews = () => {
    setMenuView("menu");
    setError("");
    setSuccess("");
    setEmailLogin("");
    setSenhaLogin("");
    setRegisterForm(initialRegisterForm);
  };

  // 📱 FORMATAR TELEFONE
  const formatPhone = (value) => {
    value = value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const handleRegisterChange = (e) => {
    let { name, value } = e.target;
    if (name === "whatsapp") value = formatPhone(value);
    setRegisterForm({ ...registerForm, [name]: value });
  };

  const handleEditChange = (e) => {
    let { name, value } = e.target;
    if (name === "whatsapp") value = formatPhone(value);
    setEditForm({ ...editForm, [name]: value });
  };

  // REQUISIÇÃO: LOGIN
  async function handleLogin(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await loginRequest({ mail: emailLogin, password: senhaLogin });
      localStorage.setItem("token", response.accessToken);
      const userData = await getUserById(response.userId, response.accessToken);

      localStorage.setItem("user", JSON.stringify({
        id: response.userId,
        mail: userData.mail,
        userName: userData.userName,
        middleName: userData.middleName,
        bloodType: userData.bloodType?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || "?",
      }));
      setSuccess("Login realizado com sucesso!");
    } catch (err) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  // REQUISIÇÃO: CADASTRO
  async function handleRegister(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!registerForm.nome || !registerForm.sobrenome || !registerForm.email || !registerForm.whatsapp || !registerForm.estado || !registerForm.senha) {
        return setError("Preencha todos os campos obrigatórios.");
      }
      if (!emailRegex.test(registerForm.email)) return setError("Digite um email válido.");
      if (registerForm.senha.length < 8) return setError("A senha deve ter no mínimo 8 caracteres.");
      if (registerForm.senha !== registerForm.confirmarSenha) return setError("As senhas não coincidem.");

      const payload = {
        userName: registerForm.nome,
        middleName: registerForm.sobrenome,
        phone: registerForm.whatsapp.replace(/\D/g, ""),
        mail: registerForm.email,
        password: registerForm.senha,
        state: registerForm.estado,
        bloodType: registerForm.tipoSanguineo && registerForm.tipoSanguineo !== "Não sei"
          ? registerForm.tipoSanguineo.replace("+", "_POSITIVE").replace("-", "_NEGATIVE") : ""
      };

      const response = await registerRequest(payload);
      localStorage.setItem("user", JSON.stringify({
        id: response.userId, email: registerForm.email, userName: registerForm.nome,
        bloodType: registerForm.tipoSanguineo === "Não sei" || !registerForm.tipoSanguineo ? "?" : registerForm.tipoSanguineo
      }));

      setSuccess("Cadastro realizado com sucesso!");
    } catch (err) {
      setError("Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  // REQUISIÇÃO: ATUALIZAR PERFIL (EDIÇÃO)
  async function handleUpdateProfile(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!editForm.nome.trim() || !editForm.email.trim()) return setError("Preencha os campos obrigatórios.");
      if (!emailRegex.test(editForm.email)) return setError("Digite um email válido.");
      if (editForm.whatsapp && editForm.whatsapp.length < 15) return setError("Digite um WhatsApp válido.");

      if (editForm.senhaAtual || editForm.novaSenha || editForm.confirmarNovaSenha) {
        if (!editForm.senhaAtual || !editForm.novaSenha || !editForm.confirmarNovaSenha) return setError("Preencha todos os campos de senha.");
        if (editForm.novaSenha.length < 8) return setError("A nova senha deve ter no mínimo 8 caracteres.");
        if (editForm.novaSenha !== editForm.confirmarNovaSenha) return setError("As novas senhas não coincidem.");
      }

      const token = localStorage.getItem("token");
      const payload = {
        userName: editForm.nome,
        middleName: editForm.sobrenome,
        phone: editForm.whatsapp.replace(/\D/g, ""),
        mail: editForm.email,
        state: editForm.estado,
        password: editForm.novaSenha || editForm.senhaAtual,
        bloodType: editForm.tipoSanguineo && editForm.tipoSanguineo !== "Não sei"
          ? editForm.tipoSanguineo.replace("+", "_POSITIVE").replace("-", "_NEGATIVE") : "A_POSITIVE"
      };

      await updateUserRequest(loggedUser.id, payload, token);

      localStorage.setItem("user", JSON.stringify({
        ...loggedUser,
        email: editForm.email,
        userName: editForm.nome,
        bloodType: editForm.tipoSanguineo || loggedUser.bloodType
      }));

      setSuccess("Informações atualizadas com sucesso!");
    } catch (err) {
      setError("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  }

  // LOGOUT E EXCLUSÃO
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedUser(null);
    setOpen(false);
    window.location.reload();
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Deseja realmente excluir sua conta?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/user/${loggedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      alert("Conta excluída com sucesso!");
      handleLogout();
    } catch (err) {
      alert("Erro ao excluir conta.");
    }
  }

  return (
    <div className={`UserProfile ${open ? "open" : ""}`} ref={ref}>

      {/* USER TRIGGER */}
      <div className="User" onClick={() => setOpen((v) => !v)}>
        {loggedUser && (
          <span className="user-name">
            {loggedUser.userName || loggedUser.email.split("@")[0]}
          </span>
        )}
        <div className="image blood-avatar">
          <span>{bloodType}</span>
        </div>
        <span className="caret">▾</span>
      </div>

      {/* MENU DROPDOWN DINÂMICO */}
      <div className={`UserProfile-menu ${menuView === "cadastro" || menuView === "edicao" ? "menu-expand-cadastro" : ""}`}>
        <div className="UserNavigation">

          {/* SEM SESSÃO */}
          {!loggedUser && (
            <>
              {menuView === "menu" && (
                <>
                  <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setMenuView("login")}>Login</button></div>
                  <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setMenuView("cadastro")}>Cadastro</button></div>
                </>
              )}

              {menuView === "login" && (
                <form className="inline-dropdown-form" onSubmit={handleLogin}>
                  <h3>Entrar</h3>
                  <input type="email" placeholder="Email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} required />
                  <input type="password" placeholder="Senha" value={senhaLogin} onChange={(e) => setSenhaLogin(e.target.value)} required />
                  {error && <p className="inline-form-error">{error}</p>}
                  <button type="submit" className="inline-form-btn" disabled={loading}>Entrar</button>
                  <button type="button" className="inline-back-link" onClick={resetAllViews}>Voltar</button>
                </form>
              )}

              {menuView === "cadastro" && (
                <form className="inline-dropdown-form" onSubmit={handleRegister}>
                  <h3>Criar conta</h3>
                  <div className="inline-form-grid">
                    <input name="nome" placeholder="Nome" value={registerForm.nome} onChange={handleRegisterChange} required />
                    <input name="sobrenome" placeholder="Sobrenome" value={registerForm.sobrenome} onChange={handleRegisterChange} required />
                  </div>
                  <input name="email" type="email" placeholder="Email" value={registerForm.email} onChange={handleRegisterChange} required />
                  <select name="tipoSanguineo" value={registerForm.tipoSanguineo} onChange={handleRegisterChange}>
                    <option value="">Tipo sanguíneo (opcional)</option>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option><option>Não sei</option>
                  </select>
                  <input name="whatsapp" placeholder="WhatsApp" value={registerForm.whatsapp} onChange={handleRegisterChange} maxLength={15} required />
                  <select name="estado" value={registerForm.estado} onChange={handleRegisterChange} required>
                    <option value="">Selecione seu estado</option>
                    <option value="SP">São Paulo</option><option value="RJ">Rio de Janeiro</option><option value="MG">Minas Gerais</option>
                  </select>
                  <input type="password" name="senha" placeholder="Senha" value={registerForm.senha} onChange={handleRegisterChange} required />
                  <input type="password" name="confirmarSenha" placeholder="Confirmar" value={registerForm.confirmarSenha} onChange={handleRegisterChange} required />
                  {error && <p className="inline-form-error">{error}</p>}
                  <button type="submit" className="inline-form-btn" disabled={loading}>Cadastrar</button>
                  <button type="button" className="inline-back-link" onClick={resetAllViews}>Voltar</button>
                </form>
              )}
            </>
          )}

          {/* COM SESSÃO */}
          {loggedUser && (
            <>
              {menuView === "menu" && (
                <>
                    <div className="UserProfile-menu-item user-email-display">{loggedUser.mail}</div>
                  <div className="UserProfile-menu-item">
                    <button className="botaoLog" onClick={() => setMenuView("edicao")}>Editar Perfil</button>
                  </div>
                  <div className="UserProfile-menu-item"><button className="botaoLog" onClick={handleDelete}>Excluir Conta</button></div>
                  <hr className="UserProfile-menu-divider" />
                  <div className="UserProfile-menu-item"><button className="botaoLog" onClick={handleLogout}>Sair</button></div>
                </>
              )}

              {menuView === "edicao" && (
                <form className="inline-dropdown-form" onSubmit={handleUpdateProfile}>
                  <h3>Editar Perfil</h3>
                  <div className="inline-form-grid">
                    <input name="nome" placeholder="Nome" value={editForm.nome} onChange={handleEditChange} required />
                    <input name="sobrenome" placeholder="Sobrenome" value={editForm.sobrenome} onChange={handleEditChange} />
                  </div>
                  <input name="email" type="email" placeholder="Email" value={editForm.email} onChange={handleEditChange} required />
                  <select name="tipoSanguineo" value={editForm.tipoSanguineo} onChange={handleEditChange}>
                    <option value="">Tipo sanguíneo</option>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option><option>Não sei</option>
                  </select>
                  <input name="whatsapp" placeholder="WhatsApp" value={editForm.whatsapp} onChange={handleEditChange} maxLength={15} />
                  <select name="estado" value={editForm.estado} onChange={handleEditChange}>
                    <option value="">Selecione seu estado</option>
                    <option value="SP">São Paulo</option><option value="RJ">Rio de Janeiro</option><option value="MG">Minas Gerais</option>
                  </select>

                  <hr className="inline-form-divider-pills" />
                  <input type="password" name="senhaAtual" placeholder="Senha atual (se for alterar)" value={editForm.senhaAtual} onChange={handleEditChange} />
                  <input type="password" name="novaSenha" placeholder="Nova senha" value={editForm.novaSenha} onChange={handleEditChange} />
                  <input type="password" name="confirmarNovaSenha" placeholder="Confirmar nova" value={editForm.confirmarNovaSenha} onChange={handleEditChange} />

                  {error && <p className="inline-form-error">{error}</p>}
                  <button type="submit" className="inline-form-btn" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                  </button>
                  <button type="button" className="inline-back-link" onClick={resetAllViews}>Voltar</button>
                </form>
              )}
            </>
          )}

        </div>
      </div>

      {/* FEEDBACK POPUP GLOBAL */}
      {success && (
        <div className="global-success-overlay">
          <div className="global-success-popup">
            <p>{success}</p>
            <button onClick={() => { resetAllViews(); setOpen(false); window.location.reload(); }}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}