import React, { useState, useRef, useEffect } from "react";

const PLACEHOLDER = "https://via.placeholder.com/400x225?text=Bairro";
const VISIBLE = 5; 

function ZoneSection({ title, bairros, onOpenNeighborhood }) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canPrev = offset > 0;
  const canNext = offset + VISIBLE < bairros.length;

  // Em mobile rendera todos para permitir o swipe nativo via CSS
  // Em desktop mantem a logica de slice original
  // v2.5: Restaurado + 1 para mostrar o próximo hemocentro (peek)
  const visibleBairros = isMobile ? bairros : bairros.slice(offset, offset + VISIBLE + 1);

  const deveExibirZona = title && !["INTERIOR", "METROPOLIS", "METROPOLE"].includes(title.toUpperCase());

  // v2.1: Renomear titulos especificos
  let displayTitle = title;
  if (title?.toUpperCase() === "METROPOLIS" || title?.toUpperCase() === "METROPOLE") {
    displayTitle = "GRANDE SÃO PAULO";
  } else if (title?.toUpperCase() === "INTERIOR") {
    displayTitle = "INTERIOR DE SÃO PAULO";
  }

  return (
    <div className="TitleList" data-loaded="true">
      <div className="Title">
        {/* HEADER */}
        <div className="row-header">
          <span className="row-title">
            {deveExibirZona ? `ZONA ${displayTitle}` : displayTitle}
          </span>
        </div>

        {/* SLIDER */}
        <div
          className="slider-wrap"
          ref={containerRef}
        >
          {/* BOTÃO ESQUERDA - Oculto via CSS no mobile */}
          <button
            className={`slider-btn prev ${!canPrev ? "hidden" : ""}`}
            onClick={() => setOffset((o) => Math.max(0, o - VISIBLE))}
            aria-label="Previous"
          >
            ‹
          </button>

          {/* NOVA CAMADA: Viewport para esconder o excesso sem cortar o botão */}
          <div className="slider-viewport">
            {/* TRACK */}
            <div className="titles-wrapper">
              {visibleBairros.map((bairro) => (
                <div
                  key={bairro.bairro}
                  className="Item"
                  onClick={() => onOpenNeighborhood(bairro)}
                >
                  <img
                    className="thumb"
                    src={bairro.neighborhoodImageUrl || PLACEHOLDER}
                    alt={bairro.bairro}
                  />

                  <div className="bairro-cover">
                    <span className="bairro-cover-title">{bairro.bairro}</span>
                  </div>

                  <div className="overlay">
                    <div className="rating">
                      <img
                        src="/mynaui_hospital-solid.svg"
                        alt="Ícone de Hospital"
                        className="plot-icon"
                      />
                      <span className="match">
                        {bairro.bloodCenters?.length || 0} {bairro.bloodCenters?.length === 1 ? "hemocentro" : "hemocentros"}
                      </span>
                    </div>

                    <div className="plot">
                      <span>Clique para visualizar os hemocentros deste bairro.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTÃO DIREITA - Oculto via CSS no mobile */}
          <button
            className={`slider-btn next ${!canNext ? "hidden" : ""}`}
            onClick={() =>
              setOffset((o) => Math.min(bairros.length - VISIBLE, o + VISIBLE))
            }
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default ZoneSection;
