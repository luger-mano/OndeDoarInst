import Header from "../../components/Header";
import "./Info.css";

export default function Info() {
  return (
    <div className="Info">
      <Header/>
      <section id="quem-somos" className="info-section">
        <h1>Quem Somos</h1>
        <p>
          Somos uma plataforma que conecta pessoas a hemocentros próximos,
          facilitando o acesso à doação de sangue e incentivando a solidariedade.
        </p>
      </section>

      <section id="porque-doar" className="info-section">
        <h1>Por que doar?</h1>
        <p>
          A doação de sangue salva vidas diariamente. Uma única doação pode
          ajudar até 4 pessoas. É um ato simples que faz toda a diferença.
        </p>
      </section>

      <section id="requisitos" className="info-section">
        <h1>Requisitos de Doação</h1>
        <ul>
          <li>Ter entre 16 e 69 anos</li>
          <li>Pesar mais de 50kg</li>
          <li>Estar em boas condições de saúde</li>
          <li>Estar alimentado (evitar alimentos gordurosos antes)</li>
        </ul>
      </section>

    </div>
  );
}