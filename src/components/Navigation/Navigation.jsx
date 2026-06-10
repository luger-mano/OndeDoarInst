import React, { useState, useEffect, useRef } from "react";
import "./Navigation.css";
import TeamCard from "../TeamCard/TeamCard";
import "../TeamCard/TeamSection.css";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  // openMenu controla as "páginas internas" do menu no mobile ou os dropdowns no desktop
  const [openMenu, setOpenMenu] = useState(null);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menu) => {
    if (window.innerWidth > 768) setOpenMenu(menu);
  };
  
  const handleMouseLeave = () => {
    if (window.innerWidth > 768) setOpenMenu(null);
  };
  const openMobileModal = (menu) => {
  if (window.innerWidth <= 768) {
    setIsHamburgerOpen(true);
    setOpenMenu(menu);
  }
};

  // Fechar menu ao clicar fora (Apenas Desktop v4.3)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth > 768 && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenMenu(null);
        setIsHamburgerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="navigation-wrapper" ref={wrapperRef}>
      {/* Botão Hambúrguer de 4 linhas */}
      {/* <button 
        className={`hamburger-button ${isHamburgerOpen ? "open" : ""}`}
        onClick={() => {
          setIsHamburgerOpen(!isHamburgerOpen);
          if (isHamburgerOpen) setOpenMenu(null); // Reseta a navegação ao fechar
        }}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button> */}

      {/* Overlay de fundo para Mobile (Apenas quando o hambúrguer está aberto) */}
      {isHamburgerOpen && (
  <div
    className="nav-mobile-overlay"
    onClick={() => {
      setIsHamburgerOpen(false);
      setOpenMenu(null);
    }}
  />
)}
      
      {/* ───────── MENU DE NAVEGAÇÃO ───────── */}
      <div className={`Navigation ${isHamburgerOpen ? "hamburger-visible" : ""}`}>
        
        {/* BOTÃO FECHAR (Padrão Modal.jsx) - Apenas Mobile v4.2 */}
        {isHamburgerOpen && (
          <button 
            className="modal-close navigation-close-mobile" 
            onClick={() => {
              setIsHamburgerOpen(false);
              setOpenMenu(null);
            }} 
            aria-label="Fechar modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        <nav aria-label="Main navigation">
          {/* A lista principal de links é ocultada se uma subpágina estiver aberta no mobile */}
          <ul>
            {/* ── POR QUE DOAR ── */}
            <li 
              className={openMenu === "doar" ? "active-subpage" : ""}
              onMouseEnter={() => handleMouseEnter("doar")} 
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="nav-link nav-button"
                onClick={() => openMobileModal("doar")}
              >
                <span className="nav-icon-mobile"></span> Por quê?
              </button>
              <div className={`menuOp2 ${scrolled ? "menuScrolled" : ""} ${openMenu === "doar" ? "menuVisible" : ""}`}>
                <span className="menu-tag">IMPACTO</span>
                <h2>Sua doação pode salvar até 4 vidas</h2>
                <div className="info-boxs">
                  <div className="cards horizontal-cards">
                    <div className="card">
                      <h3>❤️ Salva vidas</h3>
                      <p>Uma única doação pode beneficiar até 4 pessoas que dependem de transfusões em situações de emergência, cirurgias ou tratamentos.</p>
                    </div>
                    <div className="card">
                      <h3>🏥 Sempre necessário</h3>
                      <p>Os estoques de sangue precisam ser constantemente repostos. Sua doação faz diferença todos os dias.</p>
                    </div>
                    <div className="card">
                      <h3>🔄 Ciclo de ajuda</h3>
                      <p>Hoje você doa, amanhã alguém pode doar por você. A doação mantém esse ciclo funcionando.</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* ── REQUISITOS ── */}
            <li 
              className={openMenu === "requisitos" ? "active-subpage" : ""}
              onMouseEnter={() => handleMouseEnter("requisitos")} 
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="nav-link nav-button"
               onClick={() => openMobileModal("requisitos")}
              >
                <span className="nav-icon-mobile"></span> Requisitos
              </button>
              <div className={`menuOp3 ${scrolled ? "menuScrolled" : ""} ${openMenu === "requisitos" ? "menuVisible" : ""}`}>
                <span className="menu-tag">REQUISITOS</span>
                <h2>Quem pode doar sangue?</h2>
                <div className="info-boxs">
                  <div className="requirements-container">
                    <div className="requirements-top">
                      <div className="card requirement-small">
                        <strong>Faixa Etária</strong>
                        <p>Entre 16 e 69 anos.</p>
                      </div>
                      <div className="card requirement-small">
                        <strong>Peso Mínimo</strong>
                        <p>50kg ou mais.</p>
                      </div>
                    </div>
                    <hr className="requirements-divider" />
                    <div className="requirements-info">
                      <h3>Saúde Geral e Alimentação</h3>
                      <p>Estar em boas condições de saúde e não apresentar sintomas gripais.</p>
                      <p>Estar alimentado e não comparecer em jejum.</p>
                      <p>Dormir ao menos 6 horas antes da doação.</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* ── PRECISA DE SANGUE ── */}
            <li 
              className={openMenu === "sangue" ? "active-subpage" : ""}
              onMouseEnter={() => handleMouseEnter("sangue")} 
              onMouseLeave={handleMouseLeave}
            >
             <button
                className="nav-link nav-button need-blood-btn"
                onClick={() => openMobileModal("sangue")}
              >
                <span className="nav-icon-mobile"></span> Precisa de Sangue?
              </button>
              <div className={`menuOp4 ${scrolled ? "menuScrolled" : ""} ${openMenu === "sangue" ? "menuVisible" : ""}`}>
                {/* Header exclusivo mobile v4.1 com botão de voltar */}
                <span className="menu-tag urgent-tag desktop-only">URGENTE</span>
                <h2>Precisa de Sangue?</h2>
                <p>Está procurando doadores para um familiar, amigo ou paciente?</p>
                <p>Preencha nosso formulário e envie as informações da solicitação.</p>
                <p>Nossa equipe analisará os dados enviados e entrará em contato quando necessário.</p>
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
