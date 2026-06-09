import React, { useState, useEffect, useRef } from "react";
import HeroButton from "./HeroButton";
import Search from "./Search";

// 1. LISTA DE VÍDEOS DO CARROSSEL
const HERO_ITEMS = [
  {
    id: 1,
    videoSrc: "/doacao_um.jpg",
    title: "Doe Sangue, Salve Vidas",
    description: "Cada doação pode salvar até 4 vidas.",
  },
  {
    id: 2,
    videoSrc: "/doacao_dois.jpg",
    title: "Unidades Abertas Agora",
    description: "Verifique as unidades operando neste exato momento.",
  },
  {
    id: 3,
    videoSrc: "/doacao_tres.jpg",
    title: "Unidades Abertas Agora",
    description: "Verifique as unidades operando neste exato momento.",
  }
];

const FILTER_OPTIONS = [
  { id: "zona", name: "Zona" },
  { id: "abertos", name: "Abertos" },
  { id: "proximos", name: "Mais próximos" }
];

export default function Hero({ onMoreInfo, onSearch, onFilterChange, onOpenMap }) {
  // ESTADOS - Agora o estado inicial padrão é "zona" em vez de vazio
  const [idx, setIdx] = useState(0); 
  const [open, setOpen] = useState(false); 
  const [selectedFilter, setSelectedFilter] = useState("zona"); 

  // REFS
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const menuRef = useRef(null);

  // LÓGICA DO SLIDER (CARROSSEL)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % HERO_ITEMS.length);
    }, 8000);

    return () => clearInterval(timerRef.current);
  }, []);

  // LÓGICA DE CLIQUE NA BOLINHA
  function goTo(i) {
    setIdx(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIdx((prevIdx) => (prevIdx + 1) % HERO_ITEMS.length);
    }, 8000);
  }

  // VELOCIDADE DO VÍDEO
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, [idx]);

  // CLIQUE FORA DO MENU DE FILTROS v1.9
  useEffect(() => {
    const handleOutside = (e) => {
      // Se o menu estiver aberto e o clique for fora do container, fecha o menu
      if (open && menuRef.current && (!menuRef.current.contains(e.target) || e.target === menuRef.current)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // LÓGICA DE SELEÇÃO EXCLUSIVA COM PADRÃO "ZONA"
  const handleCheckboxChange = (filterId) => {
    let newFilter;
    
    if (selectedFilter === filterId) {
      newFilter = "zona";
    } else {
      newFilter = filterId;
    }

    setSelectedFilter(newFilter);
    setOpen(false); 

    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const item = HERO_ITEMS[idx];

  const currentFilterText = FILTER_OPTIONS.find(f => f.id === selectedFilter)?.name || "Zona";

  return (
    <div className="Hero">
      {/* VÍDEO / IMAGEM DE FUNDO */}
      <img
        key={item.videoSrc}
        ref={videoRef}
        className="bg hero-video-bg"
        src={item.videoSrc}
        alt=""
      />

      <div className="vignette" />

      <div className="content">
        <h1 className="hero-title">
          {item.title === "Doe Sangue, Salve Vidas" ? (
            <>
              <span className="text-red">Doe Sangue</span>
              <span className="text-white">, <span className="salve-vidas">Salve Vidas</span></span>
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
            filter={currentFilterText}
            icon="▾"
            onClick={() => setOpen(!open)}
          />

          {/* MENU DE FILTROS COM CHECKBOX */}
          <div className="UserProfile-menu hero-menu-adjust">
            
            <div className="UserProfileSwitch">
              {FILTER_OPTIONS.map((opt) => {
                const isChecked = selectedFilter === opt.id;
                return (
                  <label 
                    key={opt.id} 
                    className={`UserProfile-menu-item hero-checkbox-label ${isChecked ? "active-filter" : ""}`}
                  >
                    {/* Checkbox Oculto nativo controlado via onChange */}
                    <input 
                      type="checkbox"
                      className="hero-native-checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(opt.id)} 
                    />

                    {/* Custom UI da caixa do Checkbox */}
                    <div className="hero-custom-checkbox">
                      {isChecked && <span className="hero-checkbox-checkmark">✓</span>}
                    </div>

                    {/* Texto da Opção */}
                    <span>{opt.name}</span>
                  </label>
                );
              })}
            </div>
            <hr className="UserProfile-menu-divider" />
          </div>
        </div>

        {/* ÍCONE DO MAPA v2.8 */}
        <button className="map-icon-button" onClick={onOpenMap} aria-label="Abrir mapa">
          <img src="/icon_map.svg" alt="Mapa" />
        </button>
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