import React, { useEffect } from "react";

export default function Modal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!item) return null;

  // 1. Adicionado o facadeImageUrl na desestruturação
  const { name, bloodStock, address, phone, operation, facadeImageUrl } = item;
  const { fullAddress, bairro, municipio, zone } = address || {};

  // Validação de strings vazias/nulas do backend
  const validBairro = (bairro && bairro.toLowerCase() !== "s/b") ? bairro : null;
  const validMunicipio = (municipio && municipio.toLowerCase() !== "s/m") ? municipio : null;

  const getStockStatus = (stock) => {
    if (stock == null) return "Sem dados";
    if (stock < 30) return "🔴 Estoque Baixo";
    if (stock < 70) return "🟡 Estoque Médio";
    return "🟢 Estoque Alto";
  };

  return (
    <div className="Modal-overlay" onClick={onClose} role="dialog">
      <div className="Modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-hero">
          {/* Vídeo substituindo a imagem e o fallback */}
          <video
            src="/generic_blood_gif.mp4"
            className="modal-video"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // Mantém o filtro de brilho para escurecer o vídeo
              filter: "brightness(0.8)",
            }}
          />

          <div className="modal-hero-overlay" />
          <div className="modal-hero-content">
            <h2 className="modal-title">{name}</h2>
          </div>
        </div>

        <div className="modal-body">

          {/* COLUNA DA ESQUERDA: Informações Principais */}
          <div className="modal-left">

            <div className="modal-overview-card">
              <h4 className="section-title">Endereço</h4>
              <p>
                📍​ {fullAddress || "Informação não disponível."}
              </p>
            </div>

            <div className="modal-donation-message">
              <h4>Doe sangue, transforme vidas</h4>
              <p>
                Encontre hemocentros próximos, confira informações importantes e ajude a manter
                os estoques abastecidos. Uma simples doação pode fazer a diferença para quem mais precisa.
              </p>
            </div>

          </div>

          {/* COLUNA DA DIREITA: Metadados e Detalhes */}
          <div className="modal-right">
            <div className="metadata-list">

              {/* LÓGICA EXCLUSIVA: Município OU Bairro */}
              {validBairro ? (
                <div className="metadata-item">
                  <span className="metadata-label">Bairro</span>
                  <span className="metadata-value">{validBairro}</span>
                </div>
              ) : validMunicipio ? (
                <div className="metadata-item">
                  <span className="metadata-label">Município</span>
                  <span className="metadata-value">{validMunicipio}</span>
                </div>
              ) : null}

              {/* ZONA */}
              {zone && zone !== "null" && (
                <div className="metadata-item">
                  <span className="metadata-label">Zona</span>
                  <span className="metadata-value">{zone}</span>
                </div>
              )}

              {/* HORÁRIO */}
              <div className="metadata-item">
                <span className="metadata-label">Horário</span>
                <span className="metadata-value">
                  {operation ? operation.substring(0, 15) : "Sob consulta"}
                </span>
              </div>

            </div>
          </div>

        </div>

        <div className="modal-units">
          <div className="units-list">
            {/* Mantido como estava */}
          </div>
        </div>
      </div>
    </div>
  );
}