import React from "react";

import "./Item.css";

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

  return (
    <div className="Item" onClick={() => onOpen && onOpen()}>
      <div className="thumb-wrapper">
        <img className="thumb" src={bg} alt={title} loading="lazy" />

        {/* Exibe APENAS se estiver fechado */}
        {isClosed && (
          <div className="status-bar status-closed-overlay">
            <div className="status-content-wrapper">
              <div className="status-title-huge">FECHADO</div>

              <div className="status-schedule-reveal">
                <span className="schedule-label">Horários de Funcionamento</span>
                <ul className="schedule-lines">
                  {(op.split("|")[1] || op)
                    .replace(/Abre de/gi, "")
                    .split("/")
                    .map((line, idx) => (
                      <li key={idx}>{line.trim()}</li>
                    ))}
                </ul>
              </div>
            </div>
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