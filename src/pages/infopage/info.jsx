import Header from "../../components/Header";
import "./info.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoginModal from "../../components/ModalLogin/ModalLogin.jsx";
import RegisterModal from "../../components/ModalCadastro/ModalCadastro.jsx";
import doacaoimg from "../../assets/doacaoimg.jpg"


export default function Info() {
  const location = useLocation();

    const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

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

        <Header />


      {/* HERO */}
      <section className="info-hero">
        
         <button onClick={() => setLoginOpen(true)}>Login</button>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />

        <div className="info-hero-box">
        <div className="info-hero-left">
        <h1>Doe sangue, <br/><span className="span-hero"> salve vidas</span></h1>
        <p>
          Um gesto simples pode fazer toda a diferença. Encontre hemocentros próximos.
        </p>
         <a href="/" className="btn-primary">
          Quero ajudar agora
          <span>→</span>
        </a>
        </div>
        <div className="info-hero-right">
            <img className="imgdoacao" src={doacaoimg} alt="imagem de um doador de sangue" />
        </div>
        </div>
       
      </section>

      {/* QUEM SOMOS */}
      <section id="quem-somos" className="info-section">
        <h2>Quem Somos</h2>
        <p>
         Somos uma plataforma criada para facilitar o acesso à doação de sangue no Brasil.
         Conectamos doadores a hemocentros próximos de forma simples, rápida e confiável.
        </p>

        <p>
        Nosso objetivo é aumentar o número de doadores e reduzir a falta de sangue nos bancos,
        tornando o processo mais acessível para qualquer pessoa que queira ajudar.
        </p>
      </section>

      {/* POR QUE DOAR */}
      <section id="porque-doar" className="info-section">
        <h2>Por que doar?</h2>

        <div className="cards">
          <div className="card">
            <h3>❤️ Salva vidas</h3>
            <p className="card-p">Uma única doação pode beneficiar até 4 pessoas que dependem de transfusões
  em situações de emergência, cirurgias ou tratamentos.</p>
          </div>

          <div className="card">
            <h3>🏥 Sempre necessário</h3>
          <p className="card-p">
            Os estoques de sangue precisam ser constantemente repostos.
            Sua doação faz diferença todos os dias, não só em emergências.
          </p>
          </div>

          <div className="card">
            <h3>🔄 Ciclo de ajuda</h3>
            <p className="card-p">
              Hoje você doa, amanhã alguém pode doar por você. A doação mantém esse ciclo funcionando.
            </p>
          </div>
        </div>
      </section>

      {/* REQUISITOS */}
      <section id="requisitos" className="info-section">
        <h2>Requisitos</h2>

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
      </section>

      {/* CTA */}
      <section className="info-cta">
        <div className="cta-content">
        <h2>Pronto para ajudar?</h2>
        <p className="cta-p">Encontre o hemocentro mais próximo e faça a diferença hoje.</p>
        <a href="/" className="btn-primary-b">Encontrar locais</a>
        </div>
      </section>

    </div>
  );
}