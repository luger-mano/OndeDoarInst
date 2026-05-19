import React from "react";

const PLACEHOLDER =
  "https://via.placeholder.com/400x225?text=Hemocentro";

export default function Item({
  title,
  score,
  address,
  phones,
  operation,
  facadeImageUrl,
  municipalityImageUrl,
  neighborhoodImageUrl,
  onOpen
}) {
  const bg =
    facadeImageUrl ||
    municipalityImageUrl ||
    neighborhoodImageUrl ||
    PLACEHOLDER;

  const getStockStatus = (stock) => {
    if (stock == null) return "Sem dados";
    if (stock < 30) return "🔴 Estoque Baixo";
    if (stock < 70) return "🟡 Estoque Médio";
    return "🟢 Estoque Alto";
  };

  // Lógica de exibição exclusiva: Bairro OU Município
  const getExclusiveLocation = () => {
    if (!address) return "Localização não informada";

    const { bairro, municipio, zone } = address;
    const hasBairro = bairro && bairro.toLowerCase() !== "s/b";
    const hasMunicipio = municipio && municipio.toLowerCase() !== "s/m";

    let location = "";
    if (hasBairro) {
      location = bairro;
    } else if (hasMunicipio) {
      location = municipio;
    }

    const zoneText = (zone && zone !== "null") ? ` | Zona ${zone}` : "";
    return location ? `${location}${zoneText}` : "Localização disponível";
  };

  return (
    <div className="Item" onClick={() => onOpen && onOpen()}>
      <div className="thumb-wrapper">
        <img
          className="thumb"
          src={bg}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.target.src = PLACEHOLDER;
          }}
        />
        {/* Alterei aqui */}
        {(operation?.includes("Unidade fechada") ||
          operation?.includes("Ligar ou acessar o site para conferir")) && (
            <div className="status-bar">
              🕒 {operation}
            </div>
          )}
      </div>

      <div className="overlay">
        <div className="actions">
          <button className="card-btn more" title="Ver Detalhes">ℹ</button>
        </div>
        <div className="rating">
          <span className="match">{getStockStatus(score)}</span>
        </div>
        <div className="title">{title}</div>
        <div className="plot">
          <p>📍 {address?.fullAddress || "Endereço não informado"}</p>
          <p style={{ fontSize: '0.70rem', opacity: 0.9, fontWeight: 600, color: '#0b0b0b' }}>
            {getExclusiveLocation()}
          </p>
        </div>
      </div>
    </div>
  );
}