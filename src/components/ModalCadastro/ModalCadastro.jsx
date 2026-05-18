import { useState } from "react";
import "./ModalCadastro.css";

export default function ModalCadastro({ isOpen, onClose }) {

  // FORM INICIAL
  const initialForm = {
    nome: "",
    sobrenome: "",
    email: "",
    tipoSanguineo: "",
    whatsapp: "",
    estado: "",
    senha: "",
    confirmarSenha: ""
  };

  const [form, setForm] = useState(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  // RESETAR FORM
  const resetForm = () => {
    setForm(initialForm);
  };

  // 📱 formatar telefone
  const formatPhone = (value) => {
    value = value.replace(/\D/g, "");

    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return value;
  };

  // 🧠 handle geral
  const handleChange = (e) => {
    let { name, value } = e.target;

    // TELEFONE
    if (name === "whatsapp") {
      value = formatPhone(value);
    }

    setForm({ ...form, [name]: value });
  };

  // ✅ VALIDAÇÃO
  const handleSubmit = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;

    // CAMPOS OBRIGATÓRIOS
    if (
      !form.nome ||
      !form.sobrenome ||
      !form.email ||
      !form.whatsapp ||
      !form.estado ||
      !form.senha ||
      !form.confirmarSenha
    ) {
      return setError("Preencha todos os campos obrigatórios.");
    }

    // NOME
    if (!nomeRegex.test(form.nome)) {
      return setError("O nome deve conter apenas letras.");
    }

    // SOBRENOME
    if (!nomeRegex.test(form.sobrenome)) {
      return setError("O sobrenome deve conter apenas letras.");
    }

    // EMAIL
    if (!emailRegex.test(form.email)) {
      return setError("Digite um email válido.");
    }

    // SENHA
    if (form.senha.length < 8) {
      return setError("A senha deve ter no mínimo 8 caracteres.");
    }

    // CONFIRMAR SENHA
    if (form.senha !== form.confirmarSenha) {
      return setError("As senhas não coincidem.");
    }

    // TELEFONE
    if (form.whatsapp.length < 14) {
      return setError("Digite um telefone válido.");
    }

    // SUCESSO
    setError("");
    setSuccess("Cadastro realizado com sucesso!");
  };

  return (
    <>

      {/* MODAL */}
      <div className="register-overlay">

        <div className="register-modal">

          {/* FECHAR */}
          <button
            className="register-close"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            ×
          </button>

          <h2>Criar conta</h2>

          {/* NOME */}
          <div className="register-grid">

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

          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          {/* TIPO SANGUÍNEO */}
          <select
            name="tipoSanguineo"
            value={form.tipoSanguineo}
            onChange={handleChange}
          >
            <option value="">Tipo sanguíneo (opcional)</option>

            <option>A+</option>
            <option>A-</option>

            <option>B+</option>
            <option>B-</option>

            <option>AB+</option>
            <option>AB-</option>

            <option>O+</option>
            <option>O-</option>

            <option>Não sei</option>
          </select>

          {/* WHATSAPP */}
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

          {/* SENHA */}
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
          />

          {/* CONFIRMAR SENHA */}
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar senha"
            value={form.confirmarSenha}
            onChange={handleChange}
          />

          {/* BOTÃO */}
          <button
            className="register-btn"
            onClick={handleSubmit}
          >
            Cadastrar
          </button>

        </div>

      </div>

      {/* 🔴 POPUP ERRO */}
      {error && (

        <div className="error-overlay">

          <div className="error-popup">

            <p>{error}</p>

            <button onClick={() => setError("")}>
              OK
            </button>

          </div>

        </div>

      )}

      {/* ✅ POPUP SUCESSO */}
      {success && (

        <div className="success-overlay">

          <div className="success-popup">

            <p>{success}</p>

            <button
              onClick={() => {
                setSuccess("");
                resetForm();
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