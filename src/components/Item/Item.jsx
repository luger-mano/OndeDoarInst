import React from "react";
import "./Item.css";

const PLACEHOLDER = "https://via.placeholder.com/400x225?text=Hemocentro";

const formatOperationStatusOnly = (opString) => {
  if (!opString) return "";

  const firstDash = opString.indexOf(" - ");
  return firstDash !== -1 ? opString.slice(0, firstDash).trim() : opString.trim();
};

export default function Item({
  title,
  score,
  address,
  phones,
  operation,
  facadeImageUrl,
  municipalityImageUrl,
  neighborhoodImageUrl,
  onOpen,
  zoneCount,
  showZoneBadge
}) {
  const op = operation || "";

  const isClosed = operation?.includes("FECHADO") || operation?.includes("Unidade fechada");
  const isConsult = operation?.includes("CONSULTAR");
  const isOpen = operation?.includes("ABERTO") || operation?.includes("Unidade aberta");

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

  const displayOperation = formatOperationStatusOnly(operation);

  return (
    <div className="Item" onClick={() => onOpen && onOpen()}>
      {showZoneBadge && zoneCount && zoneCount >= 2 && (
        <div className="item-zone-badge">
          <img src="/mynaui_hospital-solid.svg" alt="hemocentro" />
          <span>{zoneCount}</span>
        </div>
      )}
      <div className="thumb-wrapper">
        <img className="thumb" src={bg} alt={title} loading="lazy" />

        {/* Alterado para renderizar apenas a parte limpa do status extraído */}
        {displayOperation && !displayOperation.toLowerCase().startsWith("unidade aberta") && (
          <div className="status-bar">
            {displayOperation.split(':')[0].trim()}
          </div>
        )}
      </div>

      <div className="overlay">
        <div className="title">{title}</div>
        <div className="plot">
          <p className="address">📍​ {address?.fullAddress || "Endereço não informado"}</p>
        </div>
      </div>
    </div>
  );
}