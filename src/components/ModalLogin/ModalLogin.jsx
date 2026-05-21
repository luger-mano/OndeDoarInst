import { useState } from "react";

import "./ModalLogin.css";

import RegisterModal
from "../ModalCadastro/ModalCadastro.jsx";

import "../../pages/infopage/info.css";

import {
  loginRequest
} from "../../services/authService";

export default function ModalLogin({
  isOpen,
  onClose
}) {

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [registerOpen, setRegisterOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (!isOpen) return null;

  async function handleLogin() {

    try {

      setLoading(true);

      setError("");

      const response =
        await loginRequest({

          mail: email,

          password: senha
        });

      localStorage.setItem(
        "token",
        response.accessToken
      );

      console.log(
        "TOKEN:",
        response.accessToken
      );

      onClose();

    } catch (err) {

      setError(
        "Email ou senha inválidos"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="login-overlay">

      <div className="login-modal">

        <button
          className="login-close"
          onClick={onClose}
        >
          ×
        </button>

        <h2>
          Entrar
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }
        />

        {error && (

          <p
            style={{
              color: "red",
              fontSize: "14px"
            }}
          >
            {error}
          </p>

        )}

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >

          {loading
            ? "Entrando..."
            : "Entrar"}

        </button>

        <RegisterModal
          isOpen={registerOpen}
          onClose={() =>
            setRegisterOpen(false)
          }
        />

        <p className="modal-link">

          Não tem conta?{" "}

          <a
            className="link-register"
            onClick={() =>
              setRegisterOpen(true)
            }
          >
            Cadastre-se
          </a>

        </p>

      </div>

    </div>
  );
}