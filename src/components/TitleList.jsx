import React, { useState, useEffect } from "react";
import Item from "./Item";

const VISIBLE = 5;

export default function TitleList({
  title,
  onOpen,
  initialItems
}) {

  const [items, setItems] = useState([]);

  const [offset, setOffset] = useState(0);

  const [loaded, setLoaded] = useState(false);

  const [animating, setAnimating] = useState(false);

  useEffect(() => {

    if (initialItems && initialItems.length > 0) {

      setItems(initialItems);

      setLoaded(true);

    } else {

      const requestUrl = `http://localhost:8080/centers/filter/region/neighborhoods`;

      fetch(requestUrl)

        .then((res) => res.json())

        .then((json) => {

          setItems(json || []);

          setLoaded(true);

        })

        .catch((err) => {

          console.error(
            "Erro ao buscar hemocentros:",
            err
          );

          setLoaded(true);

        });

    }

  }, [initialItems]);

  // ANIMAÇÃO
  function handleNext() {

    setAnimating(true);

    setOffset((o) =>
      Math.min(
        items.length - VISIBLE,
        o + VISIBLE
      )
    );

    setTimeout(() => {
      setAnimating(false);
    }, 250);
  }

  function handlePrev() {

    setAnimating(true);

    setOffset((o) =>
      Math.max(0, o - VISIBLE)
    );

    setTimeout(() => {
      setAnimating(false);
    }, 250);
  }

  const canPrev = offset > 0;

  const canNext =
    offset + VISIBLE < items.length;

  const visible =
    items.slice(offset, offset + VISIBLE);

  // SEM ITENS
  if (loaded && items.length === 0) {
    return null;
  }

  // LOADING
  if (!loaded) {

    return (

      <div
        className="TitleList"
        data-loaded="false"
      >

        <div className="Title">

          <div className="row-header">

            <span className="row-title">
              {title || "Carregando..."}
            </span>

          </div>

          <div className="slider-wrap">

            <div className="titles-wrapper">

              {[...Array(VISIBLE)].map((_, i) => (

                <div
                  key={i}
                  className="Item skeleton"
                  style={{
                    aspectRatio: "16/9"
                  }}
                />

              ))}

            </div>

          </div>

        </div>

      </div>
    );
  }

  return (

    <div
      className="TitleList"
      data-loaded="true"
    >

      <div className="Title">

        {/* HEADER */}
        <div className="row-header">

          <span className="row-title">
            {title}
          </span>


        </div>

        {/* SLIDER */}
        <div className="slider-wrap">

          {/* ESQUERDA */}
          <button
            className={`slider-btn prev ${
              !canPrev ? "hidden" : ""
            }`}
            onClick={handlePrev}
          >
            ‹
          </button>

          {/* CARDS */}
          <div
            className={`titles-wrapper ${
              animating ? "animating" : ""
            }`}
          >

            {visible.map((t) => (

              <Item
                key={t.bloodCenterId}

                title={t.name}

                score={t.bloodStock}

                address={t.address}

                phones={t.phone}

                operation={t.operation}

                facadeImageUrl={
                  t.facadeImageUrl
                }

                municipalityImageUrl={
                  t.municipalityImageUrl
                }

                neighborhoodImageUrl={
                  t.neighborhoodImageUrl
                }

                onOpen={() => onOpen(t)}
              />

            ))}

          </div>

          {/* DIREITA */}
          <button
            className={`slider-btn next ${
              !canNext ? "hidden" : ""
            }`}
            onClick={handleNext}
          >
            ›
          </button>

        </div>

      </div>

    </div>
  );
}