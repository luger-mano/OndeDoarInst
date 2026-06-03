import { useState, useEffect } from "react";

import "./ModalEdicao.css";

import {
  updateUserRequest,
getUserById
} from "../../services/authService";

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

  async function loadUser() {

    try {

      if (!isOpen) return;

      const token =
        localStorage.getItem(
          "token"
        );

      const localUser =
        JSON.parse(

          localStorage.getItem(
            "user"
          )
        );

      if (!localUser?.id) return;

      const userData =
        await getUserById(

          localUser.id,

          token
        );

      console.log(
        "USER DATA:",
        userData
      );

      setForm({

        nome:
          userData.userName || "",

        sobrenome:
          userData.middleName || "",

        email:
          userData.mail || "",

        tipoSanguineo:

  userData.bloodType

    ? userData.bloodType
        .replace(
          "_POSITIVE",
          "+"
        )
        .replace(
          "_NEGATIVE",
          "-"
        )

    : "Não sei",

        whatsapp:
          userData.phone || "",

        estado:
          userData.state || "",

        senhaAtual: "",

        novaSenha: "",

        confirmarNovaSenha: ""
      });

    } catch (err) {

      console.error(err);
    }
  }

  loadUser();

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

  // SUBMIT
  const handleSubmit =
    async () => {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // CAMPOS
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

      // SENHAS
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

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const user =
          JSON.parse(

            localStorage.getItem(
              "user"
            )
          );

        const updatePayload = {

          userName:
            form.nome,

          middleName:
            form.sobrenome,

          phone:
            form.whatsapp.replace(
              /\D/g,
              ""
            ),

          mail:
            form.email,

          bloodType:

  form.tipoSanguineo === "A+"

    ? "A_POSITIVE"

    : form.tipoSanguineo === "A-"

    ? "A_NEGATIVE"

    : form.tipoSanguineo === "B+"

    ? "B_POSITIVE"

    : form.tipoSanguineo === "B-"

    ? "B_NEGATIVE"

    : form.tipoSanguineo === "AB+"

    ? "AB_POSITIVE"

    : form.tipoSanguineo === "AB-"

    ? "AB_NEGATIVE"

    : form.tipoSanguineo === "O+"

    ? "O_POSITIVE"

    : form.tipoSanguineo === "O-"

    ? "O_NEGATIVE"

    : "A_POSITIVE",

          state:
            form.estado,

            password:

  form.novaSenha ||

  form.senhaAtual,
        };

        console.log(
  "UPDATE PAYLOAD:",
  updatePayload
);

        await updateUserRequest(

          user.id,

          updatePayload,

          token
        );

        // ATUALIZA STORAGE
       localStorage.setItem(

  "user",

  JSON.stringify({

    ...user,

    email:
      form.email,

    userName:
      form.nome,

    bloodType:

  form.tipoSanguineo ||

  user.bloodType
  })
);

        setError("");

        setSuccess(
          "Informações atualizadas com sucesso!"
        );

      } catch (err) {

        console.error(err);

        setError(
          "Erro ao atualizar perfil."
        );
      }
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

         {/* ESTADO */}
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
          >

            <option value="">Selecione seu estado</option>

            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="PR">Paraná</option>
            <option value="SC">Santa Catarina</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="PE">Pernambuco</option>
            <option value="GO">Goiás</option>
            <option value="DF">Distrito Federal</option>
            <option value="AM">Amazonas</option>
            <option value="PA">Pará</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="ES">Espírito Santo</option>
            <option value="PB">Paraíba</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="AL">Alagoas</option>
            <option value="SE">Sergipe</option>
            <option value="PI">Piauí</option>
            <option value="MA">Maranhão</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="AP">Amapá</option>
            <option value="AC">Acre</option>
            <option value="TO">Tocantins</option>

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

                window.location.reload();
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