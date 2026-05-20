import React from "react";

const PLACEHOLDER =
  "https://via.placeholder.com/400x225?text=Bairro";

export default function NeighborhoodCard({
  bairro,
  image,
  bloodCenters,
  onOpen
}) {

  return (

    <div
      className="neighborhood-card"
      onClick={onOpen}
    >

      {/* IMAGEM */}
      <img
        className="neighborhood-image"
        src={image || PLACEHOLDER}
        alt={bairro}
      />

      {/* OVERLAY */}
      <div className="neighborhood-overlay">

        <h2>
          {bairro}
        </h2>

        <p>
          📍 {bloodCenters.length}
          {" "}
          hemocentro(s)
        </p>

      </div>

    </div>
  );
}