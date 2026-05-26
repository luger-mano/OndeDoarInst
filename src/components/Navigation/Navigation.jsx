import React, { useState, useEffect, useRef } from "react";
import "./Navigation.css";

export default function Navigation() {

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const wrapperRef = useRef(null);

  // SCROLL
  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);

  // CLICK FORA
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  // TOGGLE
  const toggleMenu = (menu) => {

    setOpenMenu(
      openMenu === menu
        ? null
        : menu
    );

  };

  return (

    <div
      className="navigation-wrapper"
      ref={wrapperRef}
    >

      <div className="Navigation">

        <nav aria-label="Main navigation">

          <ul>

            {/* ───────── QUEM SOMOS ───────── */}
            <li>

              <button
                className="nav-link nav-button"
                onClick={() => toggleMenu("quem")}
              >
                Quem Somos
              </button>

              <div
                className={`
                  menuOp1
                  ${scrolled ? "menuScrolled" : ""}
                  ${openMenu === "quem" ? "menuVisible" : ""}
                `}
              >

                <div className="menu-about-left">

                  <span className="menu-tag">
                    HEMODOAÇÃO
                  </span>

                  <h2>
                    Conectando pessoas à doação de sangue
                  </h2>

                  <p>
                    Somos uma plataforma criada para facilitar o acesso
                    à doação de sangue no Brasil.
                  </p>

                  <p>
                    Conectamos doadores a hemocentros próximos
                    de forma simples, rápida e moderna.
                  </p>

                  <p>
                    Nosso objetivo é aumentar o número de doadores
                    e reduzir a falta de sangue nos bancos.
                  </p>

                  <p>
                    Acreditamos que tecnologia e solidariedade
                    podem salvar vidas diariamente.
                  </p>

                </div>

                {/* CONTATO */}
                <div className="menu-about-right">

                  <div className="contact-card">

                    <h3>
                      Informações de contato
                    </h3>

                    <div className="contact-item">
                      <span>📞</span>

                      <p>
                        11 96926-6214
                      </p>
                    </div>

                    <div className="contact-item">
                      <span>✉️</span>

                      <p>
                        contato@hugosevero.com
                      </p>
                    </div>

                    <div className="contact-item">
                      <span>💼</span>

                      <a
                        href="https://www.linkedin.com/in/hugosevero/"
                        target="_blank"
                        rel="noreferrer"
                        className="linkedin-link"
                      >
                        Linkedin
                      </a>
                    </div>

                  </div>

                </div>

              </div>

            </li>

            {/* ───────── POR QUE DOAR ───────── */}
            <li>

              <button
                className="nav-link nav-button"
                onClick={() => toggleMenu("doar")}
              >
                Por que doar?
              </button>

              <div
                className={`
                  menuOp2
                  ${scrolled ? "menuScrolled" : ""}
                  ${openMenu === "doar" ? "menuVisible" : ""}
                `}
              >

                <span className="menu-tag">
                  IMPACTO
                </span>

                <h2>
                  Sua doação pode salvar até 4 vidas
                </h2>

                <div className="info-boxs">

                  <div className="cards">

                    <div className="card">

                      <h3>
                        ❤️ Salva vidas
                      </h3>

                      <p>
                        Uma única doação pode beneficiar até
                        4 pessoas que dependem de transfusões
                        em situações de emergência,
                        cirurgias ou tratamentos.
                      </p>

                    </div>

                    <div className="card">

                      <h3>
                        🏥 Sempre necessário
                      </h3>

                      <p>
                        Os estoques de sangue precisam ser
                        constantemente repostos.
                        Sua doação faz diferença todos os dias.
                      </p>

                    </div>

                    <div className="card">

                      <h3>
                        🔄 Ciclo de ajuda
                      </h3>

                      <p>
                        Hoje você doa, amanhã alguém pode doar
                        por você. A doação mantém esse ciclo funcionando.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </li>

            {/* ───────── REQUISITOS ───────── */}
            <li>

              <button
                className="nav-link nav-button"
                onClick={() => toggleMenu("requisitos")}
              >
                Requisitos de Doação
              </button>

              <div
                className={`
                  menuOp3
                  ${scrolled ? "menuScrolled" : ""}
                  ${openMenu === "requisitos" ? "menuVisible" : ""}
                `}
              >

                <span className="menu-tag">
                  REQUISITOS
                </span>

                <h2>
                  Quem pode doar sangue?
                </h2>

                <div className="info-boxs">

                  <div className="cards">

                    <div className="card">

                      <span className="card-icon">
                        🎂
                      </span>

                      <strong>
                        Faixa etária
                      </strong>

                      <p>
                        Entre 16 e 69 anos
                      </p>

                    </div>

                    <div className="card">

                      <span className="card-icon">
                        ⚖️
                      </span>

                      <strong>
                        Peso mínimo
                      </strong>

                      <p>
                        Acima de 50kg
                      </p>

                    </div>

                    <div className="card">

                      <span className="card-icon">
                        💚
                      </span>

                      <strong>
                        Saúde
                      </strong>

                      <p>
                        Estar em boas condições
                        no dia da doação
                      </p>

                    </div>

                    <div className="card">

                      <span className="card-icon">
                        🍽️
                      </span>

                      <strong>
                        Alimentação
                      </strong>

                      <p>
                        Estar alimentado
                        e evitar alimentos gordurosos
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </li>

          </ul>

        </nav>

      </div>

    </div>

  );
}