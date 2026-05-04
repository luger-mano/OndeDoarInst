import "./info.css";
import Header from "../../components/Header";

export default function Info() {
  return (
    <div className="Info">
      <Header />


      {/* HERO */}
      <section className="info-hero">
        <h1>Doe sangue, salve vidas</h1>
        <p>
          Um gesto simples pode fazer toda a diferença. Encontre hemocentros próximos e ajude quem precisa.
        </p>
        <a href="/" className="btn-primary">Encontrar hemocentros</a>
      </section>

      {/* QUEM SOMOS */}
      <section id="quem-somos" className="info-section" id="quem-somos">
        <h2>Quem Somos</h2>
        <p>
          Somos uma plataforma que conecta pessoas a hemocentros próximos,
          facilitando o acesso à doação de sangue e incentivando a solidariedade.
        </p>
      </section>

      {/* POR QUE DOAR */}
      <section id="porque-doar" className="info-section" id="porque-doar">
        <h2>Por que doar?</h2>

        <div className="cards">
          <div className="card">
            <h3>❤️ Salva vidas</h3>
            <p>Uma única doação pode ajudar até 4 pessoas.</p>
          </div>

          <div className="card">
            <h3>⚡ Rápido</h3>
            <p>O processo é simples e leva poucos minutos.</p>
          </div>

          <div className="card">
            <h3>🤝 Solidário</h3>
            <p>Você contribui diretamente com a sociedade.</p>
          </div>
        </div>
      </section>

      {/* REQUISITOS */}
      <section id="requisitos" className="info-section" id="requisitos">
        <h2>Requisitos de Doação</h2>

        <div className="cards">
          <div className="card">16 a 69 anos</div>
          <div className="card">Mais de 50kg</div>
          <div className="card">Boa saúde</div>
          <div className="card">Alimentado</div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="info-cta">
        <div className="cta-content">
        <h2>Pronto para ajudar?</h2>
        <a href="/" className="btn-primary-b">Encontrar locais para doação</a>
        </div>
      </section>

    </div>
  );
}