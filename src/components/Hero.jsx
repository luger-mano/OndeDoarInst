import React, { useState, useEffect, useRef } from "react";
import HeroButton from "./HeroButton";
import Search from "./Search";

// 1. LISTA DE VÍDEOS DO CARROSSEL
// Adicione os caminhos dos vídeos que estão na sua pasta public/
const HERO_ITEMS = [
  {
    id: 1,
    videoSrc: "/doacao_um.jpg", // Seu vídeo atual
    title: "Doe Sangue, Salve Vidas",
    description: "Cada doação pode salvar até 4 vidas.",
  },
  {
    id: 2,
    videoSrc: "/doacao_dois.jpg", // Substitua por outro vídeo
    title: "Unidades Abertas Agora",
    description: "Verifique as unidades operando neste exato momento.",
  },
  {
    id: 3,
    videoSrc: "/doacao_tres.jpg", // Substitua por outro vídeo
    title: "Unidades Abertas Agora",
    description: "Verifique as unidades operando neste exato momento.",
  }
];

const FILTER_OPTIONS = [
  { id: "zona", name: "Filtrar por Zona", img: "https://cdn-icons-png.flaticon.com/512/854/854878.png" },
  { id: "abertos", name: "Filtrar por Abertos", img: "https://cdn-icons-png.flaticon.com/512/4149/4149673.png" },
  { id: "proximos", name: "Mais próximos", img: "https://cdn-icons-png.flaticon.com/512/1865/1865269.png" }
];

export default function Hero({ onMoreInfo, onSearch, onFilterChange }) {
  // ESTADOS
  const [idx, setIdx] = useState(0); // Controla qual vídeo está passando
  const [open, setOpen] = useState(false); // Menu de filtros
  const [selectedFilter, setSelectedFilter] = useState("zona");

  // REFS
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const menuRef = useRef(null);

  // LÓGICA DO SLIDER (CARROSSEL)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % HERO_ITEMS.length);
    }, 8000); // Troca a cada 8 segundos

    return () => clearInterval(timerRef.current);
  }, []);

  // LÓGICA DE CLIQUE NA BOLINHA
  function goTo(i) {
    setIdx(i);
    clearInterval(timerRef.current);
    // Reinicia o tempo para não pular logo em seguida
    timerRef.current = setInterval(() => {
      setIdx((prevIdx) => (prevIdx + 1) % HERO_ITEMS.length);
    }, 8000);
  }

  // VELOCIDADE DO VÍDEO
  // Atualiza sempre que o `idx` muda (ou seja, quando troca de vídeo)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, [idx]);

  // CLIQUE FORA DO MENU DE FILTROS
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const item = HERO_ITEMS[idx];

  return (
    <div className="Hero">
      {/* VÍDEO DE FUNDO */}
      {/* A prop 'key' recarrega a tag quando o src muda, garantindo o autoplay */}
      <img
        key={item.videoSrc}
        ref={videoRef}
        className="bg hero-video-bg"
        src={item.videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="vignette" />

      <div className="content">
        {/* Título e descrição opcionais do vídeo atual */}
        <h1 className="hero-title">
          {item.title === "Doe Sangue, Salve Vidas" ? (
            <>
              <span className="text-red">Doe Sangue</span>


              <span className="text-white">, <p className="salve-vidas">Salve Vidas</p></span>
            </>
          ) : (
            <span className="text-white">{item.title}</span>
          )}
        </h1>

        <p style={{ marginBottom: "50px", fontSize: "1.2rem", maxWidth: "600px" }}>{item.description}</p>


      </div>
      <div className="button-wrapper">
        {/* SEARCH */}
        <Search onSearch={onSearch} />

        {/* FILTRO */}
        <div className={`UserProfile ${open ? "open" : ""}`} ref={menuRef}>
          <HeroButton
            primary={false}
            text="Filtrar por: "
            filter={selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
            icon="▾"
            onClick={() => setOpen(!open)}
          />

          {/* MENU DE FILTROS */}
          <div className="UserProfile-menu hero-menu-adjust">
            <div className="UserProfileSwitch">
              {FILTER_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className="UserProfile-menu-item"
                  onClick={() => {
                    setSelectedFilter(opt.id);
                    setOpen(false);
                    if (onFilterChange) {
                      onFilterChange(opt.id);
                    }
                  }}
                >
                  <img
                    src={opt.img}
                    alt={opt.name}
                    style={{
                      width: "24px",                 /* Força a largura */
                      height: "24px",                /* Força a altura */
                      filter: "brightness(0) invert(0.2)",
                      opacity: 0.8,
                      objectFit: "contain"           /* Garante que a imagem não mude de proporção */
                    }}
                  />
                  <span>{opt.name}</span>
                </div>
              ))}
            </div>
            <hr className="UserProfile-menu-divider" />
          </div>
        </div>
      </div>
      {/* BOLINHAS DE NAVEGAÇÃO (DOTS) */}
      {HERO_ITEMS.length > 1 && (
        <div className="dots">
          {HERO_ITEMS.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === idx ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Ir para o vídeo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}