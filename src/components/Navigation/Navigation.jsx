import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

export default function Navigation() {
  const items = [
    {
      label: "Quem Somos",
      path: "",
      menu: "menu1",
    },
    {
      label: "Por que doar?",
      path: "",
      menu: "menu2",
    },
    {
      label: "Requisitos de Doação",
      path: "",
      menu: "menu3",
    },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="navigation-wrapper"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* NAVIGATION */}
      <div className="Navigation">
        <nav aria-label="Main navigation">
          <ul>
            {items.map((item) => (
              <li
                key={item.label}
                onMouseEnter={() => setActiveMenu(item.menu)}
              >
                <Link to={item.path} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* MENU 1 */}
      <div
        className={`menuOp1 
        ${activeMenu === "menu1" ? "menuVisible" : ""}
        ${scrolled ? "menuScrolled" : ""}`}
      >
        <div className="menu-about-left">
          <span className="menu-tag">HEMODOAÇÃO</span>

          <h2>Quem Somos</h2>

          <p>
            Somos uma plataforma criada para aproximar pessoas da doação de
            sangue, facilitando o acesso aos hemocentros de forma rápida,
            simples e segura.
          </p>

          <p>
            Nosso objetivo é incentivar mais doações e ajudar bancos de sangue
            a manterem seus estoques abastecidos para salvar vidas diariamente.
          </p>
        </div>

        <div className="menu-about-right">
          <div className="contact-card">
            <h3>Informações de contato</h3>

            <div className="contact-item">
              <span>📞</span>
              <p>11 96926-6214</p>
            </div>

            <div className="contact-item">
              <span>✉️</span>
              <p>contato@hugosevero.com</p>
            </div>

            <div className="contact-item">
              <span>💼</span>

              <Link
                to="https://www.linkedin.com/in/hugosevero/"
                target="_blank"
                className="linkedin-link"
              >
                Linkedin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MENU 2 */}
      <div
        className={`menuOp2
        ${activeMenu === "menu2" ? "menuVisible" : ""}
        ${scrolled ? "menuScrolled" : ""}`}
      >
        <span className="menu-tag">IMPORTÂNCIA DA DOAÇÃO</span>

        <h2>Por que doar?</h2>

        <div className="info-boxs">
          <div className="cards">
            <div className="card">
              <h3>❤️ Salva vidas</h3>

              <p className="card-p">
                Uma única doação pode beneficiar até 4 pessoas que dependem de
                transfusões em situações de emergência.
              </p>
            </div>

            <div className="card">
              <h3>🏥 Sempre necessário</h3>

              <p className="card-p">
                Os estoques de sangue precisam ser constantemente repostos.
              </p>
            </div>

            <div className="card">
              <h3>🔄 Ciclo de ajuda</h3>

              <p className="card-p">
                Hoje você doa, amanhã alguém pode doar por você.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MENU 3 */}
      <div
        className={`menuOp3
        ${activeMenu === "menu3" ? "menuVisible" : ""}
        ${scrolled ? "menuScrolled" : ""}`}
      >
        <span className="menu-tag">REQUISITOS PARA DOAÇÃO</span>

        <h2>Requisitos</h2>

        <div className="info-boxs">
          <div className="cards">
            <div className="card">
              <span className="card-icon">🎂</span>
              <strong>Faixa etária</strong>
              <p>Entre 16 e 69 anos</p>
            </div>

            <div className="card">
              <span className="card-icon">⚖️</span>
              <strong>Peso mínimo</strong>
              <p>Acima de 50kg</p>
            </div>

            <div className="card">
              <span className="card-icon">💚</span>
              <strong>Saúde</strong>
              <p>Estar em boas condições no dia da doação</p>
            </div>

            <div className="card">
              <span className="card-icon">🍽️</span>
              <strong>Alimentação</strong>
              <p>Estar alimentado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}