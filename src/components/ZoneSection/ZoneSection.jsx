import React, {
  useState
} from "react";

import NeighborhoodCard from "../NeighborhoodCard";

const CARD_WIDTH = 360;

const VISIBLE = 4;

export default function ZoneSection({
  title,
  bairros,
  onOpenNeighborhood
}) {

  const [offset, setOffset] =
    useState(0);

  const canPrev = offset > 0;

  const canNext =
    offset + VISIBLE < bairros.length;

  return (

    <div
      style={{
        padding: "30px"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >

        <h2
          style={{
            color: "black",
            fontSize: "2rem"
          }}
        >
          ZONA {title}
        </h2>

      </div>

      {/* SLIDER */}
      <div
        style={{
          position: "relative",
          overflow: "visible"
        }}
      >

        {/* ESQUERDA */}
        <button
          className={`slider-btn prev ${
            !canPrev ? "hidden" : ""
          }`}
          onClick={() =>
            setOffset((o) =>
              Math.max(0, o - 1)
            )
          }
        >
          ‹
        </button>

        {/* TRACK */}
        <div
          style={{
            overflow: "hidden"
          }}
        >

          <div
            style={{
              display: "flex",
              gap: "20px",
              transition:
                "transform 0.4s ease",
              transform:
                `translateX(-${offset * CARD_WIDTH}px)`
            }}
          >

            {bairros.map((bairro) => (

              <NeighborhoodCard

                key={bairro.bairro}

                bairro={bairro.bairro}

                image={
                  bairro.neighborhoodImageUrl
                }

                bloodCenters={
                  bairro.bloodCenters
                }

                onOpen={() =>
                  onOpenNeighborhood(
                    bairro
                  )
                }

              />

            ))}

          </div>

        </div>

        {/* DIREITA */}
        <button
          className={`slider-btn next ${
            !canNext ? "hidden" : ""
          }`}
          onClick={() =>
            setOffset((o) =>
              Math.min(
                bairros.length - VISIBLE,
                o + 1
              )
            )
          }
        >
          ›
        </button>

      </div>

    </div>
  );
}