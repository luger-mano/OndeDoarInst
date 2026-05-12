import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

export default function Navigation() {
  const items = [
    {
      label: "Quem Somos",
      path: "/info#quem-somos",
      menu: "menu1"
    },
    {
      label: "Por que doar?",
      path: "/info#porque-doar",
      menu: "menu2"
    },
    {
      label: "Requisitos de Doação",
      path: "/info#requisitos",
      menu: "menu3"
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
      {/* NAV */}
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
        ${scrolled ? "menuOp1Scrolled" : ""}`}
      >
        <h2>Quem Somos</h2>

        <p>
          Somos uma plataforma criada para facilitar o acesso à doação de sangue
          no Brasil. Conectamos doadores a hemocentros próximos de forma simples,
          rápida e confiável.
        </p>

        <p>
          Nosso objetivo é aumentar o número de doadores e reduzir a falta de
          sangue nos bancos, tornando o processo mais acessível para qualquer
          pessoa que queira ajudar.
        </p>
      </div>

      {/* MENU 2 */}
      <div
        className={`menuOp2
        ${activeMenu === "menu2" ? "menuVisible" : ""}
        ${scrolled ? "menuOp2Scrolled" : ""}`}
      >
        <h2>Por que doar?</h2>

        <div className="info-boxs">
          <div className="cards">
            <div className="card">
              <h3>❤️ Salva vidas</h3>

              <p className="card-p">
                Uma única doação pode beneficiar até 4 pessoas que dependem
                de transfusões em situações de emergência.
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
        ${scrolled ? "menuOp3Scrolled" : ""}`}
      >
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
            <p>Estar alimentado (evitar alimentos gordurosos)</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}