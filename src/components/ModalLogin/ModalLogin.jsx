import { useState } from "react";
import "./ModalLogin.css";
import RegisterModal from "../ModalCadastro/ModalCadastro.jsx";

export default function ModalLogin({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);

  if (!isOpen) return null;

  return (

    <div className="login-overlay">
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>×</button>

        <h2>Entrar</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button className="login-btn">Entrar</button>


      <RegisterModal
              isOpen={registerOpen}
              onClose={() => setRegisterOpen(false)}
            />

        <p className="modal-link">
          Não tem conta? <a className="link-register" onClick={() => setRegisterOpen(true)}>Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}