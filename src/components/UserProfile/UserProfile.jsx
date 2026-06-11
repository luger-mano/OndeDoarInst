import React, { useState, useEffect, useRef } from "react";
import {
  loginRequest,
  registerRequest,
  updateUserRequest,
  getUserById,
  forgotPasswordRequest,
  resetPasswordRequest,
  verifyEmailRequest,
  deleteAccountRequest
} from "../../services/authService";
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

  // Controle de telas do menu dropdown: "menu", "login", "cadastro", "edicao", "esqueceuSenha" ou "redefinirSenha"
  const [menuView, setMenuView] = useState("menu");

  // ESTADOS GERAIS DE FEEDBACK
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ESTADOS PARA O MODAL DE EXCLUSÃO (ESTILO GITHUB/AWS)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  // ESTADO PARA O FEEDBACK DE SUCESSO NA EXCLUSÃO (VERSÃO 5.3)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

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

  // 4. FORMULÁRIO DE ESQUECEU SENHA
  const [emailForgot, setEmailForgot] = useState("");

  // 5. FORMULÁRIO DE REDEFINIR SENHA
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ESTADOS DE VISIBILIDADE DE SENHA (VERSÃO 5.5)
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showEditCurrentPassword, setShowEditCurrentPassword] = useState(false);
  const [showEditNewPassword, setShowEditNewPassword] = useState(false);
  const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false);
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  const bloodType =
    loggedUser?.bloodType && loggedUser.bloodType !== "IDK"
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
    setShowDeleteSuccess(false);
    setOpen(false);
    setMenuView("menu");
    window.location.reload();
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const action = params.get("action");

    if (token) {
      let isResetToken = action === "reset";

      if (!isResetToken) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );

          const payload = JSON.parse(jsonPayload);
          if (payload.type === "PASSWORD_RESET") {
            isResetToken = true;
          }
        } catch (e) {
          console.error("Erro ao decodificar token da URL:", e);
        }
      }

      if (isResetToken) {
        setResetToken(token);
        setMenuView("redefinirSenha");
        setOpen(true);

        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        handleEmailVerificationAndLogin(token);
      }
    }
  }, []);

  async function handleEmailVerificationAndLogin(tokenFromEmail) {
    try {
      setLoading(true);
      setError("");

      // 1. Envia o token para o Back-end ativar a conta e gerar as credenciais
      const loginData = await verifyEmailRequest(tokenFromEmail);

      // 2. Salva o token de acesso que o back-end gerou na hora
      localStorage.setItem("token", loginData.accessToken);

      // 3. Busca os dados detalhados do usuário para montar a sessão
      const userData = await getUserById(loginData.userId, loginData.accessToken);

      const userSessionData = {
        id: loginData.userId,
        mail: userData.mail,
        userName: userData.userName,
        middleName: userData.middleName,
        bloodType: userData.bloodType === "IDK"
          ? "IDK"
          : userData.bloodType?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || "?",
      };

      // 4. Salva o usuário no LocalStorage e atualiza o estado global do componente
      localStorage.setItem("user", JSON.stringify(userSessionData));
      setLoggedUser(userSessionData);

      // 5. Exibe a mensagem de sucesso na tela
      setSuccess("Sua conta foi ativada com sucesso e você já está conectado!");

      // Limpa o token da URL do navegador para a estética ficar perfeita
      window.history.replaceState({}, document.title, window.location.pathname);

    } catch (err) {
      console.error("Erro na ativação de conta:", err);
      setError("Não foi possível verificar seu e-mail. O link pode ter expirado.");
      setOpen(true); // Abre o menu para exibir o erro se falhar
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoLoginAfterVerify(userId, token) {
    try {
      setLoading(true);
      localStorage.setItem("token", token);
      const userData = await getUserById(userId, token);
      const userSessionData = {
        id: userId,
        mail: userData.mail,
        userName: userData.userName,
        middleName: userData.middleName,
        bloodType: userData.bloodType?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || "?",
      };
      localStorage.setItem("user", JSON.stringify(userSessionData));
      setLoggedUser(userSessionData);
      setSuccess("E-mail verificado com sucesso! Você já está logado.");
    } catch (err) {
      console.error("Erro no auto-login:", err);
      setError("Erro ao autenticar após verificação.");
    } finally {
      setLoading(false);
    }
  }

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
          tipoSanguineo:
            userData.bloodType === "IDK"
              ? "IDK"
              : userData.bloodType
                ? userData.bloodType
                  .replace("_POSITIVE", "+")
                  .replace("_NEGATIVE", "-")
                : "",
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
      if (ref.current && (!ref.current.contains(e.target) || e.target === ref.current)) {
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
    setEmailForgot("");
    setNewPassword("");
    setConfirmNewPassword("");
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
      console.log("Resposta do Login no Front:", response);

      if (!response || !response.accessToken) {
        throw new Error("Token não recebido.");
      }

      localStorage.setItem("token", response.accessToken);

      const userData = await getUserById(response.userId, response.accessToken);
      console.log("Dados do usuário buscando por ID:", userData);

      const userSessionData = {
        id: response.userId,
        mail: userData?.mail || emailLogin,
        userName: userData?.userName || "",
        middleName: userData?.middleName || "",
        bloodType: userData?.bloodType === "IDK"
          ? "IDK"
          : userData?.bloodType
            ?.replace("_POSITIVE", "+")
            ?.replace("_NEGATIVE", "-") || "?",
      };

      localStorage.setItem("user", JSON.stringify(userSessionData));
      setLoggedUser(userSessionData);

      setSuccess("Login realizado com sucesso!");

    } catch (err) {
      console.error("Erro detalhado no handleLogin do Front:", err);
      setError("Email ou senha inválidos ou erro ao carregar perfil.");
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
        bloodType:
          registerForm.tipoSanguineo === "IDK"
            ? "IDK"
            : registerForm.tipoSanguineo
              ? registerForm.tipoSanguineo
                .replace("+", "_POSITIVE")
                .replace("-", "_NEGATIVE")
              : null
      };

      await registerRequest(payload);

      setSuccess(`Quase pronto! Enviamos um link de confirmação para ${registerForm.email}`);
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError("Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  // REQUISIÇÃO: ESQUECEU SENHA
  async function handleForgot(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await forgotPasswordRequest(emailForgot);
      setSuccess(`Um e-mail foi enviado para ${emailForgot} para alteração de senha.`);
    } catch (err) {
      setError("Erro ao solicitar redefinição de senha. Verifique o e-mail digitado.");
    } finally {
      setLoading(false);
    }
  }

  // REQUISIÇÃO: REDEFINIR SENHA
  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) return setError("As senhas não coincidem.");
    if (newPassword.length < 8) return setError("A senha deve ter no mínimo 8 caracteres.");

    try {
      setLoading(true);
      setError("");
      await resetPasswordRequest(resetToken, newPassword);
      setSuccess("Senha redefinida com sucesso! Agora você pode entrar com sua nova senha.");
    } catch (err) {
      setError("Erro ao redefinir senha ou token expirado.");
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

        password:
          editForm.novaSenha ||
          editForm.senhaAtual,

        state: editForm.estado,

        bloodType:
          editForm.tipoSanguineo === "IDK"
            ? "IDK"
            : editForm.tipoSanguineo
              .replace("+", "_POSITIVE")
              .replace("-", "_NEGATIVE")
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

      console.error("ERRO COMPLETO:", err);

      alert(
        err.message ||
        "Erro ao atualizar perfil"
      );

    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm(e) {
    e.preventDefault();
    if (deleteConfirmationInput !== loggedUser?.mail) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      await deleteAccountRequest(loggedUser.id, token);

      // Fecha o modal de confirmação e abre o de sucesso (Versão 5.3)
      setShowDeleteModal(false);
      setShowDeleteSuccess(true);

      // Fecha automaticamente e desloga após 3 segundos (seguindo padrão de outras modais)
      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      setError("Erro ao excluir conta ou sua sessão expirou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`UserProfile ${open ? "open" : ""}`} ref={ref}>

      {/* USER TRIGGER */}
      <div className="User" onClick={() => setOpen((v) => !v)}>
        <div className="image blood-avatar">
          {loggedUser ? (
            bloodType === "?" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
              </svg>
            ) : (
              <span>{bloodType}</span>
            )
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          )}
        </div>
        <span className="caret">▾</span>
      </div>

      {/* MENU DROPDOWN DINÂMICO */}
      <div className={`UserProfile-menu ${menuView === "cadastro" || menuView === "edicao" || menuView === "login" || menuView === "esqueceuSenha" || menuView === "redefinirSenha" ? "menu-expand-cadastro" : ""}`}>

        <div className="UserNavigation">

          {/* SEM SESSÃO */}
          {!loggedUser && (
            <>
              {menuView === "menu" && (
                <>
                  <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setMenuView("login")}>Entrar</button></div>
                  <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setMenuView("cadastro")}>Cadastrar-se</button></div>
                  <span className="contact-link-btn-contact">Contato</span>
                  <a
                    href="mailto:contato@hugosevero.com?cc=kaiquidejesus%40gmail.com%2Cgermanoluc890%40gmail.com%2Criokirobson%40gmail.com&subject=Parceria%20%2F%20Imprensa%20%2F%20Bug"
                    className="contact-link-btn"
                  >
                    Parceria • Imprensa • Bug
                  </a>
                  <span
                    className="contact-link-btn-mail"
                  >
                    contato@ondedoar.org
                  </span>
                </>
              )}

              {menuView === "login" && (
                <form className="inline-dropdown-form" onSubmit={handleLogin}>
                  <h3>Entrar</h3>
                  <input type="email" placeholder="Email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} required />
                  <div className="password-input-wrapper">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Senha"
                      value={senhaLogin}
                      onChange={(e) => setSenhaLogin(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      tabIndex={-1}
                      aria-label={showLoginPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showLoginPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <button type="button" className="forgot-password-link" onClick={() => setMenuView("esqueceuSenha")}>Esqueceu a senha?</button>
                  {error && <p className="inline-form-error">{error}</p>}
                  <button type="submit" className="inline-form-btn" disabled={loading}>Entrar</button>
                  <button type="button" className="inline-back-link" onClick={resetAllViews}>Voltar</button>
                </form>
              )}

              {menuView === "esqueceuSenha" && (
                <form className="inline-dropdown-form" onSubmit={handleForgot}>
                  <h3>Esqueceu a senha?</h3>
                  <p className="form-helper-text">Digite seu e-mail para receber as instruções de redefinição.</p>
                  <input type="email" placeholder="Email" value={emailForgot} onChange={(e) => setEmailForgot(e.target.value)} required />
                  {error && <p className="inline-form-error">{error}</p>}
                  <button type="submit" className="inline-form-btn" disabled={loading}>Enviar</button>
                  <button type="button" className="inline-back-link" onClick={() => setMenuView("login")}>Voltar</button>
                </form>
              )}

              {menuView === "redefinirSenha" && (
                <form className="inline-dropdown-form" onSubmit={handleResetPassword}>
                  <h3>Nova Senha</h3>
                  <div className="password-input-wrapper">
                    <input
                      type={showResetNewPassword ? "text" : "password"}
                      placeholder="Nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                      tabIndex={-1}
                      aria-label={showResetNewPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showResetNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      type={showResetConfirmPassword ? "text" : "password"}
                      placeholder="Confirmar senha"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showResetConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showResetConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  {error && <p className="inline-form-error">{error}</p>}
                  <button type="submit" className="inline-form-btn" disabled={loading}>Pronto</button>
                  <button type="button" className="inline-back-link" onClick={resetAllViews}>Cancelar</button>
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
                    <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option><option value="IDK">Não sei</option>
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
                  <div className="password-input-wrapper">
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      name="senha"
                      placeholder="Senha"
                      value={registerForm.senha}
                      onChange={handleRegisterChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      tabIndex={-1}
                      aria-label={showRegisterPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showRegisterPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      type={showRegisterConfirmPassword ? "text" : "password"}
                      name="confirmarSenha"
                      placeholder="Confirmar"
                      value={registerForm.confirmarSenha}
                      onChange={handleRegisterChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showRegisterConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showRegisterConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
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
                  <div className="UserProfile-menu-item user-email-display">
                    <strong>
                      {loggedUser.userName} {loggedUser.middleName}
                    </strong>
                    <br />
                    {loggedUser.mail}
                  </div>
                  <div className="UserProfile-menu-item">
                    <button className="botaoLog" onClick={() => setMenuView("edicao")}>Editar Perfil</button>
                  </div>
                  <div className="UserProfile-menu-item">
                    <button className="botaoLog" onClick={() => { setShowDeleteModal(true); setDeleteConfirmationInput(""); }}>Excluir Conta</button>
                  </div>
                  <a
                    href="mailto:contato@hugosevero.com?cc=kaiquidejesus%40gmail.com%2Cgermanoluc890%40gmail.com%2Criokirobson%40gmail.com&subject=Parceria%20%2F%20Imprensa%20%2F%20Bug"
                    className="contact-link-btn"
                  >
                    Parceria • Imprensa • Bug
                  </a>
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
                    <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option><option value="IDK">Não sei</option>
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
                  <div className="password-input-wrapper">
                    <input
                      type={showEditCurrentPassword ? "text" : "password"}
                      name="senhaAtual"
                      placeholder="Senha atual (se for alterar)"
                      value={editForm.senhaAtual}
                      onChange={handleEditChange}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowEditCurrentPassword(!showEditCurrentPassword)}
                      tabIndex={-1}
                      aria-label={showEditCurrentPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showEditCurrentPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      type={showEditNewPassword ? "text" : "password"}
                      name="novaSenha"
                      placeholder="Nova senha"
                      value={editForm.novaSenha}
                      onChange={handleEditChange}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowEditNewPassword(!showEditNewPassword)}
                      tabIndex={-1}
                      aria-label={showEditNewPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showEditNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      type={showEditConfirmPassword ? "text" : "password"}
                      name="confirmarNovaSenha"
                      placeholder="Confirmar nova"
                      value={editForm.confirmarNovaSenha}
                      onChange={handleEditChange}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showEditConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showEditConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>

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
            <button
              className="success-ok-btn"
              onClick={() => {
                if (menuView === "redefinirSenha") {
                  resetAllViews();
                  setMenuView("login");
                  setOpen(true);
                } else {
                  resetAllViews();
                  setOpen(false);
                }
              }}
            >
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

      {/* FEEDBACK DE SUCESSO NA EXCLUSÃO (VERSÃO 5.3) */}
      {showDeleteSuccess && (
        <div className="global-success-overlay">
          <div className="global-success-popup">
            <h3 className="success-message-title">Conta excluída</h3>
            <p className="success-message-text">Sua conta foi excluída com sucesso.</p>
            <button
              className="success-ok-btn"
              onClick={handleLogout}
            >
              Ok
            </button>
          </div>
        </div>
      )}

    </div>
  );
}