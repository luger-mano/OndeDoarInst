import React, { useState, useEffect, useRef } from "react";
import { loginRequest, registerRequest, updateUserRequest, getUserById } from "../../services/authService";
import "./UserProfile.css";

const ESTADOS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" }
];

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

  // ESTADOS PARA O MODAL DE EXCLUSÃO (ESTILO GITHUB/AWS)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

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
  const initialEditForm = {
    nome: "", sobrenome: "", email: "", tipoSanguineo: "",
    whatsapp: "", estado: "", senhaAtual: "", novaSenha: "", confirmarNovaSenha: ""
  };
  const [editForm, setEditForm] = useState(initialEditForm);

  const bloodType =
    loggedUser?.bloodType && loggedUser.bloodType !== "Não sei"
      ? loggedUser.bloodType
      : "?";

  // LOGOUT E LIMPEZA DE SEGURANÇA IMEDIATA
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedUser(null);
    setEditForm(initialEditForm);
    setRegisterForm(initialRegisterForm);
    setDeleteConfirmationInput("");
    setOpen(false);
    setMenuView("menu");
    window.location.reload();
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    }
  }, []);

  // CARREGA DADOS DE EDIÇÃO QUANDO ENTRA NA TELA (BLINDADO CONTRA EXPIRAÇÃO)
  useEffect(() => {
    async function loadUserDataForEdit() {
      if (menuView !== "edicao" || !loggedUser?.id) return;
      try {
        setLoading(true);
        setError("");

        let token = localStorage.getItem("token");

        if (!token) {
          setError("Sessão expirada. Faça login novamente.");
          handleLogout();
          return;
        }

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
        setError("Não foi possível carregar seus dados. Tente novamente.");
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
        if (!showDeleteModal) {
          setOpen(false);
          resetAllViews();
        }
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showDeleteModal]);

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

      const loginResponse = await loginRequest({
        mail: registerForm.email,
        password: registerForm.senha
      });
      localStorage.setItem("token", loginResponse.accessToken);

      const userData = await getUserById(loginResponse.userId, loginResponse.accessToken);

      const userSessionData = {
        id: loginResponse.userId,
        mail: userData.mail,
        userName: userData.userName,
        middleName: userData.middleName,
        bloodType: userData.bloodType?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || "?",
      };

      localStorage.setItem("user", JSON.stringify(userSessionData));
      setLoggedUser(userSessionData);

      setSuccess(`Olá, ${registerForm.nome}! Seja bem-vindo(a) à nossa plataforma. É um prazer ter você conosco.`);
    } catch (err) {
      console.error("Erro no cadastro:", err);
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

      const updatedUserSession = {
        ...loggedUser,
        mail: editForm.email,
        userName: editForm.nome,
        middleName: editForm.sobrenome,
        bloodType: editForm.tipoSanguineo || loggedUser.bloodType
      };

      localStorage.setItem("user", JSON.stringify(updatedUserSession));
      setLoggedUser(updatedUserSession);

      setSuccess("Informações atualizadas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Sua sessão expirou ou ocorreu um erro. Faça login novamente para salvar alterações.");
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm(e) {
    e.preventDefault();
    if (deleteConfirmationInput !== loggedUser?.mail) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/${loggedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();

      alert("Conta excluída com sucesso!");
      setShowDeleteModal(false);
      handleLogout();
    } catch (err) {
      alert("Erro ao excluir conta ou sessão expirada.");
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`UserProfile ${open ? "open" : ""}`} ref={ref}>

      {/* USER TRIGGER */}
      <div className="User" onClick={() => setOpen((v) => !v)}>
        {loggedUser && (
          <span className="user-name">
            {loggedUser.userName || loggedUser.mail.split("@")[0]}
          </span>
        )}
        <div className="image blood-avatar">
          <span>{bloodType}</span>
        </div>
        <span className="caret">▾</span>
      </div>

      {/* MENU DROPDOWN DINÂMICO */}
      <div className={`UserProfile-menu ${menuView === "cadastro" || menuView === "edicao" || menuView === "login" ? "menu-expand-cadastro" : ""}`}>
        <div className="UserNavigation">

          {/* SEM SESSÃO */}
          {!loggedUser && (
            <>
              {menuView === "menu" && (
                <>
                  <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setMenuView("login")}>Entrar</button></div>
                  <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setMenuView("cadastro")}>Cadastrar-se</button></div>
                </>
              )}

              {menuView === "login" && (
                <form className="inline-dropdown-form" onSubmit={handleLogin}>
                  <h3>Entrar</h3>
                  <div className="social-auth-grid">
                    <button type="button" className="social-btn google" aria-label="Logar com Google">
                      <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                    </button>
                    <button type="button" className="social-btn facebook" aria-label="Logar com Facebook">
                      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </button>
                    <button type="button" className="social-btn apple" aria-label="Logar com Apple">
                      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#000000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" /></svg>
                    </button>
                  </div>

                  <div className="auth-inline-divider">ou use seu e-mail</div>

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
                  <div className="input-wrapper-whatsapp">
                    <img src="https://flagcdn.com/w20/br.png" alt="BR" className="whatsapp-flag" />
                    <input name="whatsapp" placeholder="WhatsApp" value={registerForm.whatsapp} onChange={handleRegisterChange} maxLength={15} required />
                  </div>
                  <select
                    name="estado"
                    value={registerForm.estado}
                    onChange={handleRegisterChange}
                    required
                  >
                    <option value="">
                      Selecione seu estado
                    </option>

                    {ESTADOS.map((estado) => (

                      <option
                        key={estado.sigla}
                        value={estado.sigla}
                      >
                        {estado.nome}
                      </option>

                    ))}
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
                  <div className="UserProfile-menu-item">
                    <button className="botaoLog" onClick={() => { setShowDeleteModal(true); setDeleteConfirmationInput(""); }}>Excluir Conta</button>
                  </div>
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
                  <div className="input-wrapper-whatsapp">
                    <img src="https://flagcdn.com/w20/br.png" alt="BR" className="whatsapp-flag" />
                    <input name="whatsapp" placeholder="WhatsApp" value={editForm.whatsapp} onChange={handleEditChange} maxLength={15} />
                  </div>
                  <select
                    name="estado"
                    value={editForm.estado}
                    onChange={handleEditChange}
                  >
                    <option value="">
                      Selecione seu estado
                    </option>

                    {ESTADOS.map((estado) => (

                      <option
                        key={estado.sigla}
                        value={estado.sigla}
                      >
                        {estado.nome}
                      </option>

                    ))}
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
            <p className="success-message-text">{success}</p>
            <button className="success-ok-btn" onClick={() => { resetAllViews(); setOpen(false); window.location.reload(); }}>
              Ok
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO ESTILO GITHUB / AWS */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-container">
            <div className="delete-modal-header">
              <h3>Excluir conta permanentemente?</h3>
              <button className="delete-modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>

            <div className="delete-modal-body">
              <div className="delete-warning-box">
                <p><strong>Atenção:</strong> Esta ação é irreversível. Você perderá o acesso aos seus dados cadastrados na nossa plataforma.</p>
              </div>

              <p className="delete-instructions">
                Para confirmar a exclusão, digite o seu e-mail cadastrado abaixo: <br />
                <strong className="user-email-to-copy">{loggedUser?.mail}</strong>
              </p>

              <form onSubmit={handleDeleteConfirm}>
                <input
                  type="text"
                  className="delete-confirmation-input"
                  placeholder="Digite seu e-mail para confirmar"
                  value={deleteConfirmationInput}
                  onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                  autoFocus
                />

                <div className="delete-modal-actions">
                  <button
                    type="button"
                    className="delete-btn-cancel"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="delete-btn-confirm"
                    disabled={deleteConfirmationInput !== loggedUser?.mail || loading}
                  >
                    {loading ? "Excluindo..." : "Eu entendo as consequências, excluir minha conta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}