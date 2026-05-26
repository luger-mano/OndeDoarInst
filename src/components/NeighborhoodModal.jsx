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
    }
  }, []);

  if (!item) return null;

  return (
    <div
      className="Modal-overlay"
      onClick={onClose}
    >

      <div
        className="Modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="modal-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="modal-hero">

          <img
            src={item.neighborhoodImageUrl}
            alt={item.bairro}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          <div className="modal-hero-overlay" />

          <div className="modal-hero-content">
            <h2 className="modal-title">
              {item.bairro}
            </h2>
          </div>

        </div>

        <div className="modal-units">

          <h3>
            Hemocentros do bairro
          </h3>

          <div className="units-list">

            {item.bloodCenters.map((center) => (

              <div
                key={center.bloodCenterId}
                className="unit-card"
              >

                {/* Imagem agora é clicável */}
                <img
                  src={center.facadeImageUrl}
                  alt={center.name}
                  onClick={() => onOpenCenter(center)}
                  style={{ cursor: "pointer" }}
                />

                <div className="unit-info">

                  {/* Título agora é clicável */}
                  <strong 
                    onClick={() => onOpenCenter(center)}
                    style={{ cursor: "pointer" }}
                  >
                    {center.name}
                  </strong>

                  <div className="address-wrapper">
                    <img
                      src="/logo-od.svg"
                      alt="Ícone OndeDoar"
                      className="address-icon"
                    />
                    <p>{center.address?.fullAddress}</p>
                  </div>

                  <span
                    style={{
                      color: center.operation?.toLowerCase().startsWith("unidade fechada")
                        ? "#E21221"
                        : center.operation?.toLowerCase().startsWith("aberto")
                          ? "#46d369"
                          : "#E21221"
                    }}
                  >
                    {center.operation}
                  </span>

                </div>

                <div className="unit-actions">

                  <button
                    onClick={() => onOpenCenter(center)}
                  >
                    ℹ
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}