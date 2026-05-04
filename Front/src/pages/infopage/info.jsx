import "../../App.css"
import "./info.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";


export default function Info() {
  const location = useLocation();

  // Scroll automático ao acessar /info#secao
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="Info">

        <Header onSearch={() => {}} />

      {/* HERO */}
      <section className="info-hero">
        <h1>Doe sangue, salve vidas</h1>
        <p>
          Um gesto simples pode fazer toda a diferença. Encontre hemocentros próximos.
        </p>
        <a href="/" className="btn-primary">Encontrar hemocentros</a>
      </section>

      {/* QUEM SOMOS */}
      <section id="quem-somos" className="info-section">
        <h2>Quem Somos</h2>
        <p>
          Somos uma plataforma que conecta pessoas a hemocentros próximos,
          facilitando o acesso à doação de sangue.
        </p>
      </section>

      {/* POR QUE DOAR */}
      <section id="porque-doar" className="info-section">
        <h2>Por que doar?</h2>

        <div className="cards">
          <div className="card">
            <h3>❤️ Salva vidas</h3>
            <p>Uma única doação pode ajudar até 4 pessoas.</p>
          </div>

          <div className="card">
            <h3>⚡ Rápido</h3>
            <p>Processo simples e rápido.</p>
          </div>

          <div className="card">
            <h3>🤝 Solidário</h3>
            <p>Ajude quem precisa.</p>
          </div>
        </div>
      </section>

      {/* REQUISITOS */}
      <section id="requisitos" className="info-section">
        <h2>Requisitos</h2>

        <div className="cards">
          <div className="card">16 a 69 anos</div>
          <div className="card">Mais de 50kg</div>
          <div className="card">Boa saúde</div>
          <div className="card">Alimentado</div>
        </div>
      </section>

      {/* CTA */}
      <section className="info-cta">
        <div className="cta-content">
        <h2>Pronto para ajudar?</h2>
        <a href="/" className="btn-primary-b">Encontrar locais</a>
        </div>
      </section>

    </div>
  );
}