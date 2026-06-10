import React, { useEffect } from "react";

const formatOperationUI = (opString) => {
  if (!opString) return { statusText: null, statusType: "fechado", schedules: [] };

  // Parse operation string based on the first " - "
  const firstDash = opString.indexOf(" - ");
  const statusText = firstDash !== -1 ? opString.slice(0, firstDash).trim() : opString;
  const timesPart = firstDash !== -1 ? opString.slice(firstDash + 3).trim() : "";

  let statusType = "fechado";
  const lowerStatus = statusText.toLowerCase();

  if (lowerStatus.includes("abert") || lowerStatus.includes("abre ")) {
    statusType = "aberto";
  } else if (lowerStatus.includes("atenç") || lowerStatus.includes("atenc")) {
    statusType = "atencao";
  }

  const schedules = timesPart
    ? timesPart.replace(/Abre de/gi, "").split("/").map(s => s.trim())
    : [];

  return { statusText, statusType, schedules };
};

const formatPhones = (phoneString) => {
  if (phoneString === null || phoneString === undefined) return [];

  const safeString = String(phoneString).trim();

  if (!safeString) return [];

  const regex = /\(\d{2}\)\s?\d{4,5}-\d{4}/g;
  const matches = safeString.match(regex);

  return matches ? matches : [safeString];
};

export default function Modal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!item) return null;

  const { name, bloodStock, address, phone, operation, zone } = item;
  const { fullAddress, bairro, municipio } = address || {};

  const validBairro = bairro && bairro.toLowerCase() !== "s/b" ? bairro : null;
  const validMunicipio = municipio && municipio.toLowerCase() !== "s/m" ? municipio : null;

  const locationSubtitle = [validBairro, validMunicipio].filter(Boolean).join(" • ");

  const { statusText, statusType, schedules } = formatOperationUI(operation);

  return (
    <div className="Modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="Modal-container" onClick={(e) => e.stopPropagation()}>

        {/* BOTÃO FECHAR */}
        <button className="modal-close" onClick={onClose} aria-label="Fechar modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* HERO (VÍDEO DE FUNDO COM GRADIENTE SUAVE) */}
        <div className="modal-hero">
          <video
            src="/generic_blood_gif.mp4"
            className="modal-video"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="modal-hero-overlay" />
          <div className="modal-hero-content">
            {zone && zone !== "null" && (
              <span className="modal-badge">Zona {zone}</span>
            )}
            <h2 className="modal-title">{name}</h2>
            {locationSubtitle && <p className="modal-subtitle">{locationSubtitle}</p>}
          </div>
        </div>

        {/* CORPO DO MODAL */}
        <div className="modal-body">

          {/* COLUNA ESQUERDA (Info Principal) */}
          <div className="modal-left">
            {/* CARD DE ENDEREÇO */}
            <div className="info-card">
              <div className="info-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h4>Endereço</h4>
              </div>
              <div className="address-wrapper">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    fullAddress || ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="address-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {fullAddress || "Endereço não encontrado"}
                </a>
              </div>
            </div>

            <div className="info-grid">
              {/* CARD DE FUNCIONAMENTO */}
              <div className="info-card operation-card">
                <div className="info-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <h4>Funcionamento</h4>
                </div>

                {statusText && (
                  <div className="status-badge" data-status={statusType}>
                    <span className="status-dot"></span>
                    {statusText}
                  </div>
                )}

                {schedules.length > 0 ? (
                  <ul className="schedule-list">
                    {schedules.map((sched, index) => {
                      const [day, hour] = sched.split("-").map(s => s.trim());
                      return (
                        <li key={index}>
                          <span className="schedule-days">{day}</span>
                          {hour && <span className="schedule-hours">{hour}</span>}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p></p>
                )}
              </div>

              {/* CARD DE CONTATO */}
              {phone && (() => {
                const phoneList = formatPhones(phone);
                return (
                  <div className="info-card contact-card">
                    <div className="info-header">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <h4>Contato</h4>
                    </div>

                    <ul className="contact-list">
                      {phoneList.map((num, idx) => {
                        const cleanNumber = num.replace(/\D/g, "");
                        return (
                          <li key={idx}>
                            <a href={`tel:+55${cleanNumber}`} className="phone-link">
                              {num}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* COLUNA DIREITA (Ação e Destaques) */}
          <div className="modal-right">
            {/* CARD DE ESTOQUE CRÍTICO */}
            {bloodStock && (
              <div className="stock-card">
                <h4>Estoque Crítico</h4>
                <div className="blood-type-badge">{bloodStock}</div>
              </div>
            )}

            {/* CARD DE DOAÇÃO (CTA) */}
            <div className="donation-cta">
              <div className="cta-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-5.5c-.5 1.5-2 3.9-4 5.5S5 13 5 15a7 7 0 0 0 7 7z"></path>
                </svg>
              </div>
              <h4>Doe sangue, salve vidas</h4>
              <p>Uma simples doação faz toda a diferença. Ajude a manter os estoques abastecidos.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}