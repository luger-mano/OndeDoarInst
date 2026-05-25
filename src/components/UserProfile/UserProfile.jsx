import React, {
  useState,
  useEffect,
  useRef
} from "react";

import ModalLogin
from "../ModalLogin/ModalLogin";

import ModalEdicao
from "../ModalEdicao/ModalEdicao";

import ModalCadastro
from "../ModalCadastro/ModalCadastro";

import logo_without_account
from "../../assets/logo_without_account.svg";

import "./UserProfile.css";

export default function UserProfile() {

  const [open, setOpen] =
    useState(false);

  const ref = useRef(null);

  const [loginOpen, setLoginOpen] =
    useState(false);

  const [registerOpen, setRegisterOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [loggedUser, setLoggedUser] =
    useState(null);

  // VERIFICA LOGIN
  useEffect(() => {

    const user =
      localStorage.getItem(
        "user"
      );

    if (user) {

      setLoggedUser(
        JSON.parse(user)
      );
    }

  }, []);

  // FECHAR MENU
  useEffect(() => {

    const handleOutside = (e) => {

      if (
        ref.current &&
        !ref.current.contains(
          e.target
        )
      ) {

        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );

  }, []);

  // LOGOUT
  function handleLogout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setLoggedUser(null);

    setOpen(false);

    window.location.reload();
  }

  // DELETAR CONTA
  async function handleDelete() {

    const confirmDelete =
      confirm(
        "Deseja realmente excluir sua conta?"
      );

    if (!confirmDelete) return;

    try {

      alert(
        "Quando backend passar endpoint completo com token/id, conectamos aqui 😄"
      );

    } catch (err) {

      console.error(err);
    }
  }

  return (

    <div
      className={`UserProfile ${
        open ? "open" : ""
      }`}
      ref={ref}
    >

      <ModalLogin
        isOpen={loginOpen}
        onClose={() => {

          setLoginOpen(false);

          const user =
            localStorage.getItem(
              "user"
            );

          if (user) {

            setLoggedUser(
              JSON.parse(user)
            );
          }
        }}
      />

      <ModalEdicao
        isOpen={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
      />

      <ModalCadastro
        isOpen={registerOpen}
        onClose={() =>
          setRegisterOpen(false)
        }
      />

      {/* BOTÃO USER */}
      <div
        className="User"
        onClick={() =>
          setOpen((v) => !v)
        }
      >

        <div className="image">

          <img
            src={
              logo_without_account
            }
            alt="Profile"
          />

        </div>

        <span className="caret">
          ▾
        </span>

      </div>

      {/* MENU */}
      <div className="UserProfile-menu">

        <div className="UserNavigation">

          {/* NÃO LOGADO */}
          {!loggedUser && (

            <>

              <div className="UserProfile-menu-item">

                <button
                  className="botaoLog"
                  onClick={() => {

                    setLoginOpen(true);

                    setOpen(false);
                  }}
                >
                  Login
                </button>

              </div>

              <div className="UserProfile-menu-item">

                <button
                  className="botaoLog"
                  onClick={() => {

                    setRegisterOpen(true);

                    setOpen(false);
                  }}
                >
                  Cadastro
                </button>

              </div>

            </>

          )}

          {/* LOGADO */}
          {loggedUser && (

            <>

              <div
                className="UserProfile-menu-item"
              >

                {loggedUser.email}

              </div>

              <div className="UserProfile-menu-item">

                <button
                  className="botaoLog"
                  onClick={() => {

                    setEditOpen(true);

                    setOpen(false);
                  }}
                >
                  Editar Perfil
                </button>

              </div>

              <div className="UserProfile-menu-item">

                <button
                  className="botaoLog"
                  onClick={
                    handleDelete
                  }
                >
                  Excluir Conta
                </button>

              </div>

              <hr className="UserProfile-menu-divider" />

              <div className="UserProfile-menu-item">

                <button
                  className="botaoLog"
                  onClick={
                    handleLogout
                  }
                >
                  Sair
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}