import React, { useState, useEffect } from "react";
import Item from "../Item/Item";
import "./SearchResults.css";

const VISIBLE = 5;

function SearchResults({ results, onOpen }) {
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset offset when results change
  useEffect(() => {
    setOffset(0);
  }, [results]);

  if (!results || results.length === 0) {
    return (
      <div className="SearchResults">
        <h2>Nenhum hemocentro encontrado</h2>
      </div>
    );
  }

  const handleNext = () => {
    setOffset((o) => Math.min(results.length - VISIBLE, o + VISIBLE));
  };

  const handlePrev = () => {
    setOffset((o) => Math.max(0, o - VISIBLE));
  };

  const canPrev = offset > 0;
  const canNext = offset + VISIBLE < results.length;
  const visibleResults = isMobile ? results : results.slice(offset, offset + VISIBLE + 1);

  return (
    <div className="SearchResults TitleList" data-loaded="true">
      <div className="Title">
        <h2>Resultados da Busca</h2>

        <div className="slider-wrap">
          {/* BOTÃO ESQUERDA */}
          <button
            className={`slider-btn prev ${!canPrev ? "hidden" : ""}`}
            onClick={handlePrev}
            aria-label="Previous"
          >
            ‹
          </button>

          {/* TRACK */}
          <div className="titles-wrapper">
            {visibleResults.map((center) => (
              <Item
                key={center.bloodCenterId}
                title={center.name}
                score={center.score}
                address={center.address}
                phones={center.phones}
                operation={center.operation}
                facadeImageUrl={center.facadeImageUrl}
                municipalityImageUrl={center.municipalityImageUrl}
                neighborhoodImageUrl={center.neighborhoodImageUrl}
                onOpen={() => onOpen(center)}
              />
            ))}
          </div>

          {/* BOTÃO DIREITA */}
          <button
            className={`slider-btn next ${!canNext ? "hidden" : ""}`}
            onClick={handleNext}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
