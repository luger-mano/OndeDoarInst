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

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-overlay">
      <div className="register-modal">
        <button className="register-close" onClick={onClose}>×</button>

        <h2>Criar conta</h2>

        <div className="register-grid">
          <input name="nome" placeholder="Nome" onChange={handleChange} />
          <input name="sobrenome" placeholder="Sobrenome" onChange={handleChange} />
        </div>

        <input name="email" type="email" placeholder="Email" onChange={handleChange} />

        <select name="tipoSanguineo" onChange={handleChange}>
          <option value="">Tipo sanguíneo (opcional)</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
          <option>Não sei meu tipo sanguíneo</option>
        </select>

        <input name="whatsapp"  placeholder="WhatsApp" onChange={handleChange} />
        <input name="estado"  placeholder="Estado" onChange={handleChange} />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirmar Senha"
          onChange={handleChange}
        />

        <button className="register-btn">Cadastrar</button>
      </div>
    </div>
  );
}