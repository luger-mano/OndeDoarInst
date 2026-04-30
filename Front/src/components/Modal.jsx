import React, { useEffect } from "react";

export default function Modal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!item) return null;

  const { name, bloodStock, address, phone, operation } = item;
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
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, #bc1823, #222)" }} />
          <div className="modal-hero-overlay" />
          <div className="modal-hero-content">
            <h2 className="modal-title">{name}</h2>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <div className="modal-meta-row">
              <img className="modal-hd" width="25" height="25" src="/drop.svg" alt="drop" />
              <span className="modal-match">{getStockStatus(bloodStock)}</span>
              {/* Exibe o que for válido (Bairro ou Município) ao lado do status */}
              <span className="modal-year">{validBairro || validMunicipio || ""}</span>
            </div>
            <p className="modal-overview">
              <strong>Endereço:</strong><br />
              {fullAddress || "Informação não disponível."}
            </p>
          </div>

          <div className="modal-right">
            {/* LÓGICA EXCLUSIVA: Município OU Bairro */}
            {validBairro ? (
              <div><strong style={{ color: "#000" }}>Bairro: </strong>{validBairro}</div>
            ) : validMunicipio ? (
              <div><strong style={{ color: "#000" }}>Município: </strong>{validMunicipio}</div>
            ) : null}

            {zone && zone !== "null" && (
              <div><strong style={{ color: "#000" }}>Zona: </strong>{zone}</div>
            )}
            <div>
              <strong style={{ color: "#000" }}>Horário: </strong>
              {operation ? operation.substring(0, 5) : "Sob consulta"}
            </div>
          </div>
        </div>

        <div className="modal-units">
          <h3>Unidades</h3>

          <div className="units-list">
            {/* {mockUnits.map((unit, index) => (
              <div key={index} className="unit-card">
                <img src={unit.image} alt={unit.name} />

                <div className="unit-info">
                  <strong>{unit.name}</strong>
                  <p>{unit.address}</p>
                  <span>{unit.hours}</span>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}