import React, { useEffect } from "react";

export default function MapModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="Modal-overlay map-modal-overlay" onClick={onClose}>
      <div className="MapModal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close map-modal-close" onClick={onClose} aria-label="Fechar mapa">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="map-wrapper">
          <iframe
            title="Onde Doar Map"
            src="https://snazzymaps.com/embed/433899?key=3a18ad8a-9783-4fb0-a3cc-4b0f2979ca83"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
