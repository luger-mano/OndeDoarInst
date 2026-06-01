import React, { useState, useEffect, useRef } from "react";
import "./Navigation.css";
import TeamCard from "../TeamCard/TeamCard";
import "../TeamCard/TeamSection.css";

import hug from "../../assets/fotosDevs/hug.png";
import hug2 from "../../assets/fotosDevs/hug2.png";

import kai from "../../assets/fotosDevs/kai.png";
import kai2 from "../../assets/fotosDevs/kai2.png";

import luc from "../../assets/fotosDevs/luc.png";
import luc2 from "../../assets/fotosDevs/luc2.png";

import rob from "../../assets/fotosDevs/rob.png";
import rob2 from "../../assets/fotosDevs/rob2.png";

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
    team-menu
                  ${scrolled ? "menuScrolled" : ""}
                  ${openMenu === "quem" ? "menuVisible" : ""}
                `}
                 onMouseLeave={handleMouseLeave}
              >
                <span className="menu-tag">
  EQUIPE ONDEDOAR
</span>

<h2>
  Conheça nossa equipe
</h2>

<p className="team-description">
  Somos uma equipe de doadores apaixonada por tecnologia e impacto social,
  unindo nossas habilidades para facilitar a doação de sangue
  e conectar pessoas que podem salvar vidas.
</p>

<div className="team-grid">

  <TeamCard
    name="Hugo Severo"
    role="CEO"
    email="contato@hugosevero.com"
    linkedin="https://www.linkedin.com/in/hugosevero/"
    photo={hug}
    photoDonation={hug2}
  />

  <TeamCard
    name="Kaiqui Petty"
    role="DevOps"
    email="kaiquidejesus@gmail.com"
    linkedin="https://www.linkedin.com/in/kaiqui-petty-6b9299217/"
    photo={kai}
    photoDonation={kai2}
  />

  <TeamCard
    name="Lucas Germano"
    role="CTO e desenvolvedor Full-Stack"
    email="germanoluc890@gmail.com"
    linkedin="https://www.linkedin.com/in/lucas-germano-dev/"
    photo={luc}
    photoDonation={luc2}
  />

  <TeamCard
    name="Robson Rioki"
    role="Desenvolvedor Front-End"
    email="riokirobson@gmail.com"
    linkedin="https://www.linkedin.com/in/riokirobson/"
    photo={rob}
    photoDonation={rob2}
  />

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
     Saúde Geral e Alimentação
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