import { useState } from "react";
import "./ModalCadastro.css";

export default function ModalCadastro({ isOpen, onClose }) {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    tipoSanguineo: "",
    whatsapp: "",
    estado: "",
    senha: "",
    confirmarSenha: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

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

    if (name === "whatsapp") {
      value = formatPhone(value);
    }

    setForm({ ...form, [name]: value });
  };

  // ✅ VALIDAÇÃO COMPLETA
  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // campos obrigatórios
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

    // email
    if (!emailRegex.test(form.email)) {
      return setError("Digite um email válido.");
    }

    // senha
    if (form.senha.length < 8) {
      return setError("A senha deve ter no mínimo 8 caracteres.");
    }

    // confirmar senha
    if (form.senha !== form.confirmarSenha) {
      return setError("As senhas não coincidem.");
    }

    // telefone
    if (form.whatsapp.length < 14) {
      return setError("Digite um telefone válido.");
    }

    // ✅ SUCESSO
    setError("");
    setSuccess("Cadastro realizado com sucesso!");
  };

  return (
    <>
      {/* MODAL */}
      <div className="register-overlay">
        <div className="register-modal">
          <button className="register-close" onClick={onClose}>×</button>

          <h2>Criar conta</h2>

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

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <select
            name="tipoSanguineo"
            value={form.tipoSanguineo}
            onChange={handleChange}
          >
            <option value="">Tipo sanguíneo (opcional)</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
            <option>Não sei</option>
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

          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar senha"
            value={form.confirmarSenha}
            onChange={handleChange}
          />

          <button className="register-btn" onClick={handleSubmit}>
            Cadastrar
          </button>
        </div>
      </div>

      {/* 🔴 POPUP ERRO */}
      {error && (
        <div className="error-overlay">
          <div className="error-popup">
            <p>{error}</p>
            <button onClick={() => setError("")}>OK</button>
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