import React, { useEffect, useRef, useState } from "react";

export default function NeighborhoodModal({
  item,
  onClose,
  onOpenCenter
}) {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── LÓGICA DE CLICAR E ARRASTAR (MOUSE DRAG) ──
  const handleMouseDown = (e) => {
    if (item.bloodCenters?.length <= 1) return;
    setIsDragging(true);

    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;

    e.preventDefault();
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleCardClick = (e, center) => {
    if (isDragging) {
      e.stopPropagation();
      return;
    }
    onOpenCenter(center);
  };

  if (!item) return null;

  const isCarousel = item.bloodCenters?.length > 1;

  return (
    <div className="Modal-overlay" onClick={onClose}>
      <div className="Modal" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose} aria-label="Fechar modal">
          ✕
        </button>

        <div className="modal-hero">
          <img src={item.neighborhoodImageUrl} alt={item.bairro} className="hero-image" />
          <div className="modal-hero-overlay" />
          <div className="modal-hero-content">
            <h2 className="modal-title">{item.bairro}</h2>
          </div>
        </div>

        <div className="modal-units">
          <h3>Hemocentros disponíveis neste bairro</h3>

          {/* EVENTOS DE ARRASTO ADICIONADOS AQUI */}
          <div
            ref={carouselRef}
            className={`units-grid ${isCarousel ? 'has-carousel' : ''} ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
          >
            {item.bloodCenters.map((center) => {
              const isFechado = center.operation?.toLowerCase().includes("fechada") || center.operation?.toLowerCase().includes("fechado");
              const isAberto = center.operation?.toLowerCase().includes("aberto") || center.operation?.toLowerCase().includes("aberta");
              const statusType = isAberto ? "aberto" : isFechado ? "fechado" : "atencao";

              return (
                <div key={center.bloodCenterId} className="unit-card">

                  {/* cliques alterados para usar a validação de segurança de arrasto */}
                  <div className="unit-thumb-wrapper" onClick={(e) => handleCardClick(e, center)}>
                    <img src={center.facadeImageUrl} alt={center.name} className="unit-thumb" draggable="false" />
                  </div>

                  <div className="unit-card-body">
                    <div className="unit-card-header">
                      <strong onClick={(e) => handleCardClick(e, center)}>
                        {center.name}
                      </strong>
                    </div>

                    <div className="address-wrapper">
                      📍
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          center.address?.fullAddress || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="address-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {center.address?.fullAddress}
                      </a>
                    </div>

                    <div className="status-badge" data-status={statusType}>
                      <span className="status-dot"></span>
                      <span className="status-text">{center.operation}</span>
                    </div>
                  </div>

                  <div className="unit-actions">
                    <button onClick={(e) => handleCardClick(e, center)}>
                      <span>Saiba mais</span>
                      <span className="arrow-icon">→</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}