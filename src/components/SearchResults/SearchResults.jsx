import React from "react";

import Item from "../Item";

import "./SearchResults.css";

export default function SearchResults({ results, onOpen }) {

  if (!results || results.length === 0) {

    return (
      <div className="SearchResults">
        <h2>Nenhum hemocentro encontrado</h2>
      </div>
    );
  }

  return (

    <div className="SearchResults">

      <h2>Resultados da Busca</h2>

      <div className="search-grid">

        {Array.isArray(results) && results.map((center) => (

          <Item
            key={center.bloodCenterId}

            title={center.name}

            score={center.score}

            address={center.address}

            phones={center.phones}

            operation={center.operation}

            facadeImageUrl={center.facadeImageUrl}

            municipalityImageUrl={center.municipalityImageUrl}

            neighborhoodImageUrl={center.neighborhoodImageUrl}

            onOpen={() => onOpen(center)}
          />

        ))}

      </div>

    </div>
  );
}