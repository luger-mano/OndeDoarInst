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
                        Uma única bolsa de sangue coletada é fracionada em até quatro componentes essenciais: 
                        hemácias, plasma, plaquetas e crioprecipitado. Isso significa que um único ato seu beneficia 
                        diretamente múltiplas pessoas que passam por cirurgias complexas ou transplantes urgentes.
                      </p>
                    </div>

                    <div className="card">
                      <h3>🏥 Sempre necessário</h3>
                      <p>
                        O sangue humano é insubstituível e possui data de validade rigorosa (plaquetas duram apenas 5 dias). 
                        Hospitais tratam diariamente pacientes com câncer, anemia falciforme crônica e vítimas de acidentes graves, 
                        tornando o fluxo constante de novos doadores algo vital para a saúde pública.
                      </p>
                    </div>

                    <div className="card">
                      <h3>🔄 Ciclo de ajuda</h3>
                      <p>
                        Criar o hábito de doar fortalece uma rede invisível de proteção comunitária. Ao estender o braço hoje, 
                        você garante que amanhã a cultura de doação continue viva e ativa na sociedade, protegendo seus próprios 
                        familiares, amigos ou até mesmo você em uma eventual necessidade futura.
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
                  <div className="cards requirements-grid">
                    <div className="card">
                      <span className="card-icon">🎂</span>
                      <strong>Faixa etária</strong>
                      <p>
                        Estar na faixa entre 16 e 69 anos de idade. Jovens de 16 e 17 anos necessitam de uma autorização formal por 
                        escrito e presença de um responsável legal. A primeira doação do voluntário deve obrigatoriamente ter sido 
                        realizada antes de ele completar os 60 anos de idade.
                      </p>
                    </div>

                    <div className="card">
                      <span className="card-icon">⚖️</span>
                      <strong>Peso mínimo</strong>
                      <p>
                        Pesar no mínimo 50kg. O volume de sangue total extraído na coleta é calculado proporcionalmente baseado na 
                        massa corporal do doador. Mulheres e homens abaixo desse peso não possuem a margem de segurança necessária 
                        para a retirada padrão sem riscos de mal-estar.
                      </p>
                    </div>

                    <div className="card">
                      <span className="card-icon">💚</span>
                      <strong>Saúde Geral</strong>
                      <p>
                        Estar em plenas condições de saúde no dia. Não apresentar sintomas gripais, febre ou infecções nos últimos 14 dias. 
                        Caso tenha feito tatuagem, maquiagem definitiva ou piercings recentes, deve-se aguardar o prazo preventivo padrão 
                        de 12 meses antes de doar.
                      </p>
                    </div>

                    <div className="card">
                      <span className="card-icon">🍽️</span>
                      <strong>Alimentação</strong>
                      <p>
                        Estar devidamente alimentado e descansado (dormido pelo menos 6 horas na noite anterior). Evite o consumo de 
                        alimentos excessivamente gordurosos nas 3 horas que antecedem a coleta e nunca compareça ao posto de atendimento 
                        completamente em jejum.
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