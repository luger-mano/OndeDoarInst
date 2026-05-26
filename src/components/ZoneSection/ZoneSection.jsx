import React, { useState } from "react";

const PLACEHOLDER = "https://via.placeholder.com/400x225?text=Bairro";
const VISIBLE = 5; // Quantidade de cards visíveis por vez

export default function ZoneSection({ title, bairros, onOpenNeighborhood }) {
  const [offset, setOffset] = useState(0);

  const canPrev = offset > 0;
  const canNext = offset + VISIBLE < bairros.length;

  // Seguindo o modelo: filtramos apenas os itens que devem aparecer na tela agora
  const visibleBairros = bairros.slice(offset, offset + VISIBLE);

  return (
    <div className="TitleList" data-loaded="true">
      <div className="Title">
        {/* HEADER */}
        <div className="row-header">
          <span className="row-title">ZONA {title}</span>
        </div>

        {/* SLIDER */}
        <div className="slider-wrap">
          {/* BOTÃO ESQUERDA */}
          <button
            className={`slider-btn prev ${!canPrev ? "hidden" : ""}`}
            onClick={() => setOffset((o) => Math.max(0, o - VISIBLE))}
            aria-label="Previous"
          >
            ‹
          </button>

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

                {/* NOVA CAMADA: Nome do bairro sobre a imagem */}
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

          {/* BOTÃO DIREITA */}
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