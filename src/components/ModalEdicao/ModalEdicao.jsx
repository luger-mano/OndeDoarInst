import { useState, useEffect } from "react";

import "./ModalEdicao.css";

export default function ModalEdicao({
  isOpen,
  onClose
}) {

  const [form, setForm] =
    useState({

      nome: "",

      sobrenome: "",

      email: "",

      tipoSanguineo: "",

      whatsapp: "",

      estado: "",

      senhaAtual: "",

      novaSenha: "",

      confirmarNovaSenha: ""
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // CARREGA USER
  useEffect(() => {

    if (!isOpen) return;

    const user =
      JSON.parse(

        localStorage.getItem(
          "user"
        )
      );

    if (user) {

      // MOCK TEMPORÁRIO
      const email =
        user.email || "";

      const nome =
        email.split("@")[0];

      setForm({

        nome: nome,

        sobrenome: "",

        email: email,

        tipoSanguineo: "A+",

        whatsapp: "",

        estado: "SP",

        senhaAtual: "",

        novaSenha: "",

        confirmarNovaSenha: ""
      });
    }

  }, [isOpen]);

  if (!isOpen) return null;

  // FORMATAR TELEFONE
  const formatPhone = (
    value
  ) => {

    value =
      value.replace(
        /\D/g,
        ""
      );

    if (value.length <= 11) {

      value =
        value.replace(
          /^(\d{2})(\d)/g,
          "($1) $2"
        );

      value =
        value.replace(
          /(\d{5})(\d)/,
          "$1-$2"
        );
    }

    return value;
  };

  // HANDLE INPUTS
  const handleChange = (
    e
  ) => {

    let {
      name,
      value
    } = e.target;

    if (
      name === "whatsapp"
    ) {

      value =
        formatPhone(
          value
        );
    }

    setForm({

      ...form,

      [name]: value
    });
  };

  // VALIDAR
  const handleSubmit = () => {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // CAMPOS OBRIGATÓRIOS
    if (

      !form.nome.trim() ||

      !form.email.trim()
    ) {

      return setError(
        "Preencha os campos obrigatórios."
      );
    }

    // EMAIL
    if (
      !emailRegex.test(
        form.email
      )
    ) {

      return setError(
        "Digite um email válido."
      );
    }

    // TELEFONE
    if (

      form.whatsapp &&

      form.whatsapp.length < 15
    ) {

      return setError(
        "Digite um número de WhatsApp válido."
      );
    }

    // ALTERAÇÃO DE SENHA
    if (

      form.senhaAtual ||

      form.novaSenha ||

      form.confirmarNovaSenha
    ) {

      if (

        !form.senhaAtual ||

        !form.novaSenha ||

        !form.confirmarNovaSenha
      ) {

        return setError(
          "Preencha todos os campos de senha."
        );
      }

      if (
        form.novaSenha.length < 8
      ) {

        return setError(
          "A nova senha deve ter no mínimo 8 caracteres."
        );
      }

      if (

        form.novaSenha !==

        form.confirmarNovaSenha
      ) {

        return setError(
          "As novas senhas não coincidem."
        );
      }
    }

    // FUTURO PAYLOAD
    const payload = {

      nome:
        form.nome,

      sobrenome:
        form.sobrenome,

      email:
        form.email,

      tipoSanguineo:
        form.tipoSanguineo,

      whatsapp:
        form.whatsapp,

      estado:
        form.estado
    };

    console.log(
      "PAYLOAD UPDATE:",
      payload
    );

    setError("");

    setSuccess(
      "Informações atualizadas com sucesso!"
    );
  };

  return (

    <>

      {/* MODAL */}
      <div className="edit-overlay">

        <div className="edit-modal">

          <button
            className="edit-close"
            onClick={onClose}
          >
            ×
          </button>

          <h2>
            Editar Perfil
          </h2>

          <div className="edit-grid">

            <input
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleChange}
            />

            <input
              name="sobrenome"
              placeholder="Sobrenome"
              value={form.sobrenome}
              onChange={handleChange}
            />

          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <select
            name="tipoSanguineo"
            value={form.tipoSanguineo}
            onChange={handleChange}
          >

            <option value="">
              Tipo sanguíneo
            </option>

            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>

            <option>
              Não sei
            </option>

          </select>

          <input
            name="whatsapp"
            placeholder="WhatsApp"
            value={form.whatsapp}
            onChange={handleChange}
            maxLength={15}
          />

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
          >

            <option value="">
              Selecione seu estado
            </option>

            <option value="SP">
              São Paulo
            </option>

            <option value="RJ">
              Rio de Janeiro
            </option>

            <option value="MG">
              Minas Gerais
            </option>

            <option value="RS">
              Rio Grande do Sul
            </option>

            <option value="PR">
              Paraná
            </option>

            <option value="SC">
              Santa Catarina
            </option>

          </select>

          {/* SENHAS */}
          <input
            type="password"
            name="senhaAtual"
            placeholder="Senha atual"
            value={form.senhaAtual}
            onChange={handleChange}
          />

          <input
            type="password"
            name="novaSenha"
            placeholder="Nova senha"
            value={form.novaSenha}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmarNovaSenha"
            placeholder="Confirmar nova senha"
            value={form.confirmarNovaSenha}
            onChange={handleChange}
          />

          <button
            className="edit-btn"
            onClick={handleSubmit}
          >
            Salvar Alterações
          </button>

        </div>

      </div>

      {/* POPUP ERRO */}
      {error && (

        <div className="error-overlay">

          <div className="error-popup">

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                setError("")
              }
            >
              OK
            </button>

          </div>

        </div>

      )}

      {/* POPUP SUCESSO */}
      {success && (

        <div className="success-overlay">

          <div className="success-popup">

            <p>
              {success}
            </p>

            <button
              onClick={() => {

                setSuccess("");

                onClose();
              }}
            >
              OK
            </button>

          </div>

        </div>

      )}

    </>
  );
}