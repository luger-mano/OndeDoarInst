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
  const op = operation || "";

  // Nova lógica: É considerado fechado se a string contiver "Abre" (Abre amanhã, Abre segunda, Abre hoje às...)
  const isClosed = op.toLowerCase().includes("abre");
  const isConsult = op.includes("CONSULTAR") || op.includes("Ligar ou acessar");
  const isOpen = op.includes("ABERTO") || op.includes("Unidade aberta");

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

  const parts = op.split("|");
  const statusTitle = parts[0].trim(); 
  const statusSubtitle = parts[1] ? parts[1].trim() : "Verifique o horário"; 

  return (
    <div className="Item" onClick={() => onOpen && onOpen()}>
      <div className="thumb-wrapper">
        <img className="thumb" src={bg} alt={title} loading="lazy" />

        {/* Exibe se o status indicar que o local está fechado no momento */}
        {isClosed && (
          <div className="status-bar" style={{ backgroundColor: 'rgba(200, 0, 0, 0.8)' }}>
            <div className="status-title" style={{ textTransform: 'uppercase' }}>
              {statusTitle}
            </div>
            <div className="status-subtitle">{statusSubtitle}</div>
          </div>
        )}

        {/* Exibe APENAS se for consultar */}
        {isConsult && (
          <div className="status-bar" style={{ backgroundColor: 'rgba(255, 165, 0, 0.8)' }}>
            <div className="status-title">CONSULTAR</div>
            <div className="status-subtitle">{op}</div>
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