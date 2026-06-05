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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);

  const wrapperRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar drawer ao clicar fora (no overlay)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileDrawerRef.current && !mobileDrawerRef.current.contains(e.target)) {
        setMobileDrawerOpen(false);
        setMobileSection(null);
      }
    };
    if (mobileDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileDrawerOpen]);

  const handleMouseEnter = (menu) => setOpenMenu(menu);
  const handleMouseLeave = () => setOpenMenu(null);

  const closeDrawer = () => {
    setMobileDrawerOpen(false);
    setMobileSection(null);
  };

  const openSection = (section) => setMobileSection(section);

  return (
    <div className="navigation-wrapper" ref={wrapperRef}>

      {/* ───────── HAMBÚRGUER — só aparece em mobile via CSS ───────── */}
      {!mobileDrawerOpen && (
        <button
          className="mobile-hamburger"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* ───────── OVERLAY — clicar fora fecha o drawer ───────── */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={closeDrawer}
        />
      )}

      {/* ───────── DRAWER LATERAL ───────── */}
      <div
        className={`mobile-drawer ${mobileDrawerOpen ? "open" : ""}`}
        ref={mobileDrawerRef}
      >
        {/* Lista principal de opções */}
        {!mobileSection && (
          <nav aria-label="Mobile navigation">
            <ul>
              <li>
                <button className="mobile-menu-link" onClick={() => openSection("doar")}>
                  Por que doar?
                </button>
              </li>
              <li>
                <button className="mobile-menu-link" onClick={() => openSection("requisitos")}>
                  Requisitos de Doação
                </button>
              </li>
              <li>
                <button className="mobile-menu-link" onClick={() => openSection("sangue")}>
                  Precisa de Sangue?
                </button>
              </li>
            </ul>
          </nav>
        )}

        {/* ── Seção: Por que doar ── */}
        {mobileSection === "doar" && (
          <div className="mobile-section-content">
            <button className="mobile-back-btn" onClick={() => setMobileSection(null)}>
              ← Voltar
            </button>
            <span className="menu-tag">IMPACTO</span>
            <h2>Sua doação pode salvar até 4 vidas</h2>
            {/* Cards com swipe horizontal via CSS */}
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
        )}

        {/* ── Seção: Requisitos ── */}
        {mobileSection === "requisitos" && (
          <div className="mobile-section-content">
            <button className="mobile-back-btn" onClick={() => setMobileSection(null)}>
              ← Voltar
            </button>
            <span className="menu-tag">REQUISITOS</span>
            <h2>Quem pode doar sangue?</h2>
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
        )}

        {/* ── Seção: Precisa de Sangue ── */}
        {mobileSection === "sangue" && (
          <div className="mobile-section-content">
            <button className="mobile-back-btn" onClick={() => setMobileSection(null)}>
              ← Voltar
            </button>
            <span className="menu-tag urgent-tag">URGENTE</span>
            <h2>Precisa de Sangue?</h2>
            <p>Está procurando doadores para um familiar, amigo ou paciente?</p>
            <p>Preencha nosso formulário e envie as informações da solicitação.</p>
            <p>Nossa equipe analisará os dados enviados e entrará em contato quando necessário.</p>
            <a
              href="https://docs.google.com/forms/d/1ef0D_3q29SHkY5J3gLzrxaW2X44yvQiHThqAnOUI8vU/viewform?edit_requested=true"
              target="_blank"
              rel="noreferrer"
              className="need-blood-action"
              onClick={closeDrawer}
            >
              SOLICITAR DOADORES
            </a>
          </div>
        )}
      </div>

      {/* ───────── MENU DESKTOP — intacto ───────── */}
      <div className="Navigation">
        <nav aria-label="Main navigation">
          <ul>
            {/* ── POR QUE DOAR ── */}
            <li onMouseEnter={() => handleMouseEnter("doar")} onMouseLeave={handleMouseLeave}>
              <button className="nav-link nav-button">Por que doar?</button>
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
            <li onMouseEnter={() => handleMouseEnter("requisitos")} onMouseLeave={handleMouseLeave}>
              <button className="nav-link nav-button">Requisitos de Doação</button>
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
            <li onMouseEnter={() => handleMouseEnter("sangue")} onMouseLeave={handleMouseLeave}>
              <button className="nav-link nav-button need-blood-btn">Precisa de Sangue?</button>
              <div className={`menuOp4 ${scrolled ? "menuScrolled" : ""} ${openMenu === "sangue" ? "menuVisible" : ""}`}>
                <span className="menu-tag urgent-tag">URGENTE</span>
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