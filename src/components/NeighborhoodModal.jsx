import React, { useEffect } from "react";

export default function NeighborhoodModal({
  item,
  onClose,
  onOpenCenter
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!item) return null;

  // Calcula a quantidade total com base no array de hemocentros recebido
  const totalCentrosNoBairro = item.bloodCenters ? item.bloodCenters.length : 0;

  return (
    <div className="Modal-overlay" onClick={onClose}>
      <div className="Modal" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose} aria-label="Fechar modal">
          ✕
        </button>

        <div className="modal-hero">
          {item.bairro === "Liberdade" ? (
            <video
              src="/liberdade.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="hero-image"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <img src={item.neighborhoodImageUrl} alt={item.bairro} className="hero-image" />
          )}
          <div className="modal-hero-overlay" />
          <div className="modal-hero-content">
            <h2 className="modal-title">{item.bairro}</h2>
          </div>
        </div>

        <div className="modal-units">
          <h3>Hemocentros disponíveis neste bairro</h3>

          {item.bairro === "Liberdade" && (
            <div className="neighborhood-header-row">
              <p className="neighborhood-description">
                O Bairro da Liberdade é um bairro situado na zona central do
                município de São Paulo. É conhecido como o maior reduto da
                comunidad japonesa no município, a qual, por sua vez, congrega
                a maior colônia japonesa do mundo, fora do Japão.
              </p>

              <div className="neighborhood-info-panel">
                <span>Município: São Paulo</span>
                <span>Fundação: Dezembro 1985</span>
                <span>População (aprox.): 70 mil hab</span>
              </div>
            </div>
          )}

          <div className="neighborhood-container">
            <button className="neighborhood-units-btn">
              Unidades
            </button>
            <span className="neighborhood-units-text">
              Bancos: {totalCentrosNoBairro === 1 ? "1 unidade" : `${totalCentrosNoBairro} unidades`}
            </span>
          </div>

          {/* v2.0: Lista vertical de hemocentros */}
          <div className="units-grid">
            {item.bloodCenters && item.bloodCenters.map((center) => {
              const isFechado = center.operation?.toLowerCase().includes("fechada") || center.operation?.toLowerCase().includes("fechado");
              const isAberto = center.operation?.toLowerCase().includes("aberto") || center.operation?.toLowerCase().includes("aberta");
              const statusType = isAberto ? "aberto" : isFechado ? "fechado" : "atencao";

              return (
                <div key={center.bloodCenterId} className="unit-card">

                  <div className="unit-thumb-wrapper" onClick={() => onOpenCenter(center)}>
                    <img src={center.facadeImageUrl} alt={center.name} className="unit-thumb" />
                  </div>

                  <div className="unit-card-body">
                    <div className="unit-card-header">
                      <strong onClick={() => onOpenCenter(center)}>
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

                    <div className="unit-info-footer">
                      <div className="status-badge" data-status={statusType}>
                        <span className="status-dot"></span>
                        <span className="status-text">{center.operation}</span>
                      </div>

                      <div className="unit-actions">
                        <button onClick={() => onOpenCenter(center)}>
                          <span>Saiba mais</span>
                          <span className="arrow-icon">→</span>
                        </button>
                      </div>
                    </div>
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