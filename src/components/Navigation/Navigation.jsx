import React, { useState, useEffect, useRef } from "react";
import "./Navigation.css";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  
  const handleMouseEnter = (menu) => {
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    setOpenMenu(null);
  };



  return (
    <div className="navigation-wrapper" ref={wrapperRef}>
      <div className="Navigation">
        <nav aria-label="Main navigation">
          <ul>
            {/* ───────── QUEM SOMOS ───────── */}
            <li
              onMouseEnter={() => handleMouseEnter("quem")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="nav-link nav-button">
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
                  <span className="menu-tag">HEMODOAÇÃO</span>
                  <h2>Conectando pessoas à doação de sangue</h2>
                  <p>
                    Somos uma plataforma digital criada exclusivamente para modernizar,
                    centralizar e facilitar o acesso à doação de sangue em todo o território nacional.
                  </p>
                  <p>
                    Conectamos doadores voluntários a hemocentros e hospitais parceiros próximos
                    de forma 100% simples, rápida e transparente.
                  </p>
                  <p>
                    Nosso principal objetivo é manter os estoques abastecidos continuamente, reduzindo a falta
                    crítica de bolsas de sangue nos períodos de baixa captação.
                  </p>
                  <p>
                    Acreditamos fielmente que a união entre tecnologia assertiva e a solidariedade humana
                    detém o poder de salvar milhares de vidas diariamente.
                  </p>
                </div>

                {/* CONTATO */}
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
            <li
              onMouseEnter={() => handleMouseEnter("doar")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="nav-link nav-button">
                Por que doar?
              </button>

              <div
                className={`
                  menuOp2
                  ${scrolled ? "menuScrolled" : ""}
                  ${openMenu === "doar" ? "menuVisible" : ""}
                `}
              >
                <span className="menu-tag">IMPACTO</span>
                <h2>Sua doação pode salvar até 4 vidas</h2>

                <div className="info-boxs">
                  <div className="cards horizontal-cards">
                    <div className="card">
                      <h3>❤️ Salva vidas</h3>
                      <p>
                       Uma única doação pode beneficiar até
                        4 pessoas que dependem de transfusões
                        em situações de emergência,
                        cirurgias ou tratamentos.
                      </p>
                    </div>

                    <div className="card">
                      <h3>🏥 Sempre necessário</h3>
                      <p>
                        Os estoques de sangue precisam ser
                        constantemente repostos.
                        Sua doação faz diferença todos os dias.
                      </p>
                    </div>

                    <div className="card">
                      <h3>🔄 Ciclo de ajuda</h3>
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
            <li
              onMouseEnter={() => handleMouseEnter("requisitos")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="nav-link nav-button">
                Requisitos de Doação
              </button>

              <div
                className={`
                  menuOp3
                  ${scrolled ? "menuScrolled" : ""}
                  ${openMenu === "requisitos" ? "menuVisible" : ""}
                `}
              >
                <span className="menu-tag">REQUISITOS</span>
                <h2>Quem pode doar sangue?</h2>

                <div className="info-boxs">
                  <div className="requirements-container">

  <div className="requirements-top">

    <div className="card requirement-small">

      <span className="card-icon">
        🎂
      </span>

      <strong>
        Faixa Etária
      </strong>

      <p>
        Entre 16 e 69 anos.
      </p>

    </div>

    <div className="card requirement-small">

      <span className="card-icon">
        ⚖️
      </span>

      <strong>
        Peso Mínimo
      </strong>

      <p>
        50kg ou mais.
      </p>

    </div>

  </div>
<hr className="requirements-divider" />

<div className="requirements-info">

  <h3>
    💚 Saúde Geral e Alimentação
  </h3>

  <p>
    Estar em boas condições de saúde e
    não apresentar sintomas gripais.
  </p>

  <p>
    Estar alimentado e não comparecer
    em jejum.
  </p>

  <p>
    Dormir ao menos 6 horas antes da
    doação.
  </p>

</div>

</div>
                </div>
              </div>
            </li>
            {/* ───────── PRECISA DE SANGUE ───────── */}
<li
  onMouseEnter={() => handleMouseEnter("sangue")}
  onMouseLeave={handleMouseLeave}
>
 <button className="nav-link nav-button need-blood-btn">🚨 Precisa de Sangue?</button>




  <div
  className={`
    menuOp4
    ${scrolled ? "menuScrolled" : ""}
    ${openMenu === "sangue" ? "menuVisible" : ""}
  `}
>

  <span className="menu-tag urgent-tag">
    URGENTE
  </span>

  <h2>
    🚨 Precisa de Sangue?
  </h2>

  <p>
    Está procurando doadores para um familiar,
    amigo ou paciente?
  </p>

  <p>
    Preencha nosso formulário e envie as
    informações da solicitação.
  </p>

  <p>
    Nossa equipe analisará os dados enviados
    e entrará em contato quando necessário.
  </p>

  <a
    href="https://docs.google.com/forms/d/1ef0D_3q29SHkY5J3gLzrxaW2X44yvQiHThqAnOUI8vU/viewform?edit_requested=true"
    target="_blank"
    rel="noreferrer"
    className="need-blood-action"
  >
    SOLICITAR DOADORES
  </a>

</div>
</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}