import React, { useState, useEffect, useRef, useCallback } from "react";
import HeroButton from "./HeroButton";
import Search from "./Search";

// 1. LISTA DE VÍDEOS DO CARROSSEL
const HERO_ITEMS = [
  {
    id: 1,
    type: "video",
    src: "/Info.mp4"
  }
];

const FILTER_OPTIONS = [
  { id: "zona", name: "Regiões de São Paulo" },
  { id: "abertos", name: "Unidades Abertas" },
  { id: "proximos", name: "Unidades Mais próximas" }
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

  const handleNext = useCallback(() => {
    setIdx((i) => (i + 1) % HERO_ITEMS.length);
  }, []);

  // LÓGICA DO SLIDER (CARROSSEL)
  useEffect(() => {
    const item = HERO_ITEMS[idx];

    // Se for vídeo, o avanço é pelo onEnded, senão por timer
    if (item.type !== "video") {
      timerRef.current = setInterval(handleNext, 8000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx, handleNext]);

  // LÓGICA DE CLIQUE NA BOLINHA
  function goTo(i) {
    setIdx(i);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  // VELOCIDADE DO VÍDEO
  useEffect(() => {
    if (videoRef.current && HERO_ITEMS[idx].type === "video") {
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
      {item.type === "video" ? (
        <video
          key={item.src}
          ref={videoRef}
          className="bg hero-video-bg"
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          onEnded={HERO_ITEMS.length > 1 ? handleNext : undefined}
        />
      ) : (
        <img
          key={item.src}
          className="bg hero-img-bg"
          src={item.src}
          alt=""
        />
      )}

      <div className="vignette" />

      {item.type !== "video" && (
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
      )}

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