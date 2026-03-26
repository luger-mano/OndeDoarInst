import React, { useEffect } from "react";
import HeroButton from "./HeroButton";
import ListToggle from "./ListToggle";

const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

const mockUnits = [
  {
    name: "Hemocentro São Lucas - Unidade Liberdade",
    address: "Rua Barão de Iguape, 212",
    hours: "Seg a Sex (08h30 - 14h30)",
    image: "https://jornal.fmrp.usp.br/wp-content/uploads/sites/542/2012/12/frente-do-Hemocentro-300x224.jpg"
  },
  {
    name: "Banco de Sangue São Paulo - Unidade Liberdade",
    address: "Rua Tomás Carvalhal, 711",
    hours: "Todos os dias (07h - 18h)",
    image: "https://jornal.fmrp.usp.br/wp-content/uploads/sites/542/2012/12/frente-do-Hemocentro-300x224.jpg"
  }
];

export default function Modal({ item, onClose }) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!item) return null;

  const title = item.name || item.title || "Untitled";
  const backdrop = item.backdrop_path
    ? `${IMG_ORIGINAL}${item.backdrop_path}`
    : null;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const score = item.vote_average
    ? Math.round(item.vote_average * 10)
    : null;

  return (
    <div
      className="Modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="Modal" onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Hero section */}
        <div className="modal-hero">
          {backdrop ? (
            <video
              className="modal-video"
              src="/liberdade.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#222" }} />
          )}
          <div className="modal-hero-overlay" />
          <div className="modal-hero-content">
            <h2 className="modal-title">BAIRRO LIBERDADE</h2>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Left: details */}
          <div className="modal-left">

            <div className="modal-meta-row">
              <img className="modal-hd" width="25" height="25" src="public/drop.svg" alt="logo" />
              {score && (
                <span className="modal-match">{score}% Estoque alto</span>
              )}
              {year && <span className="modal-year">Bancos: </span>}
            </div>
            <p className="modal-overview">
              {item.overview || "No description available."}
            </p>
          </div>

          {/* Right: meta */}
          <div className="modal-right">
            {item.vote_average && (
              <div>
                <strong style={{ color: "#000000" }}>Município: </strong>
                {item.vote_average.toFixed(1)} / 10
              </div>
            )}
            {item.original_language && (
              <div>
                <strong style={{ color: "#000000" }}>Fundação: </strong>
                {item.original_language.toUpperCase()}
              </div>
            )}
            {item.popularity && (
              <div>
                <strong style={{ color: "#000000" }}>População: </strong>
                {Math.round(item.popularity)}
              </div>
            )}
            {item.media_type && (
              <div>
                <strong style={{ color: "#000000" }}>Bairro: </strong>
                {item.media_type === "tv" ? "TV Show" : "Movie"}
              </div>
            )}
          </div>
        </div>

        <div className="modal-units">
          <h3>Unidades</h3>

          <div className="units-list">
            {mockUnits.map((unit, index) => (
              <div key={index} className="unit-card">
                <img src={unit.image} alt={unit.name} />

                <div className="unit-info">
                  <strong>{unit.name}</strong>
                  <p>{unit.address}</p>
                  <span>{unit.hours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}