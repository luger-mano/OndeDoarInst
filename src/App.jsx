import React, {
  useState,
  useEffect,
  useCallback
} from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";

import TitleList from "./components/TitleList";
import ZoneSection from "./components/ZoneSection/ZoneSection";

import SearchResults from "./components/SearchResults/SearchResults.jsx";

import Modal from "./components/Modal";
import NeighborhoodModal from "./components/NeighborhoodModal";

import Item from "./components/Item";

import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Info from "./pages/infopage/info.jsx";

export default function App() {

  // ZONAS
  const [zones, setZones] =
    useState([]);

  // TODOS OS HEMOCENTROS
  const [
    allCenters,
    setAllCenters
  ] = useState([]);

  // SEARCH
  const [
    searchResults,
    setSearchResults
  ] = useState(null);

  // MODAL HEMOCENTRO
  const [
    modalItem,
    setModalItem
  ] = useState(null);

  // MODAL BAIRRO
  const [
    neighborhoodModal,
    setNeighborhoodModal
  ] = useState(null);

  // FILTRO
  const [
    selectedFilter,
    setSelectedFilter
  ] = useState("zona");

  // BUSCAR ZONAS
  useEffect(() => {

    fetch(
      "http://localhost:8080/centers/filter/zone/neighborhoods"
    )

      .then((res) => res.json())

      .then((data) => {

        setZones(data || []);

        // TODOS OS HEMOCENTROS
        const centers = [];

        (data || []).forEach((zone) => {

          (zone.bairros || []).forEach((bairro) => {

            (bairro.bloodCenters || []).forEach((center) => {

              centers.push(center);

            });

          });

        });

        // BUSCAR TODOS
        fetch(
          "http://localhost:8080/centers"
        )

          .then((res) => res.json())

          .then((allData) => {

            // ADICIONA OS DO INTERIOR/LITORAL
            // QUE NÃO ESTÃO NAS ZONAS
            const merged = [
              ...centers
            ];

            (allData || []).forEach((center) => {

              const alreadyExists =
                merged.some(
                  (c) =>
                    c.bloodCenterId ===
                    center.bloodCenterId
                );

              if (!alreadyExists) {

                merged.push(center);

              }

            });

            setAllCenters(merged);

          });

      })

      .catch((err) => {

        console.error(
          "Erro zonas:",
          err
        );

      });

  }, []);

  // SEARCH
  const handleSearch =
    useCallback(

      async (query) => {

        // LIMPA SEARCH
        if (
          !query ||
          !query.trim()
        ) {

          setSearchResults(null);

          return;
        }

        try {

          const response =
            await fetch(

              `/api/centers/filter/search?search=${encodeURIComponent(query)}`

            );

          const data =
            await response.json();

          setSearchResults(
            data || []
          );

        } catch (err) {

          console.error(
            "Erro search:",
            err
          );

          setSearchResults([]);

        }

      },

      []
    );

  // AGRUPAMENTO
  function groupCentersBy(
    items,
    field
  ) {

    const grouped = {};

    items.forEach((center) => {

      let key = null;

      // BAIRRO
      if (field === "bairro") {

        const bairro =
          center.address?.bairro;

        if (
          bairro &&
          bairro !== "s/b"
        ) {

          key = bairro;

        }

      }

      // MUNICIPIO
      else if (
        field === "municipio"
      ) {

        const municipio =
          center.address?.municipio;

        // TUDO QUE NÃO É s/m
        // É CONSIDERADO MUNICÍPIO
        if (
          municipio &&
          municipio !== "s/m"
        ) {

          key = municipio;

        }

      }

      // ESTADO
      else if (
        field === "estado"
      ) {

        key = "São Paulo";

      }

      // ABERTOS
      else if (
        field === "abertos"
      ) {

        const operation =
          center.operation?.toLowerCase() || "";

        const isClosed =
          operation.includes(
            "fechada"
          );

        const needsCheck =
          operation.includes(
            "conferir"
          );

        // SOMENTE ABERTOS
        if (
          !isClosed &&
          !needsCheck
        ) {

          key = "Unidades abertas";

        }

      }

      if (!key) return;

      if (!grouped[key]) {

        grouped[key] = [];

      }

      grouped[key].push(center);

    });

    return grouped;
  }

  return (

    <BrowserRouter>

      <Routes>

        <Route

          path="/"

          element={

            <div>

              {/* HEADER */}
              <Header
                onSearch={handleSearch}
              />

              {/* HERO */}
              <Hero

                onSearch={handleSearch}

                onFilterChange={(filter) => {

                  setSelectedFilter(
                    filter
                  );

                }}

              />

              {/* SEARCH */}
              {searchResults !== null ? (

                <SearchResults

                  results={searchResults}

                  onOpen={setModalItem}

                />

              ) : (

                <>

                  {/* ZONA */}
                  {selectedFilter ===
                    "zona" && (

                    <>

                      {zones &&
                      Array.isArray(zones) &&
                      zones.length > 0 ? (

                        zones.map((zoneObj) => (

                          <ZoneSection

                            key={zoneObj.zone}

                            title={
                              zoneObj.zone
                            }

                            bairros={
                              zoneObj.bairros || []
                            }

                            onOpenNeighborhood={
                              setNeighborhoodModal
                            }

                          />

                        ))

                      ) : (

                        <div className="loading">
                          Carregando zonas...
                        </div>

                      )}

                    </>

                  )}

                  {/* BAIRRO */}
                  {selectedFilter === "bairro" && (

                    <div
                      style={{
                        padding: "30px"
                      }}
                    >

                      {Object.entries(

                        groupCentersBy(
                          allCenters,
                          "bairro"
                        )

                      ).map(
                        ([bairro, centers]) => (

                          <div
                            key={bairro}
                            style={{
                              marginBottom: "50px"
                            }}
                          >

                            <h1
                              style={{
                                color: "black",
                                marginBottom: "20px"
                              }}
                            >
                              {bairro}
                            </h1>

                            <div
                              style={{
                                display: "flex",
                                gap: "20px",
                                flexWrap: "wrap"
                              }}
                            >

                              {centers.map((center) => (

                                <Item

                                  key={
                                    center.bloodCenterId
                                  }

                                  title={center.name}

                                  score={
                                    center.bloodStock
                                  }

                                  address={
                                    center.address
                                  }

                                  phones={
                                    center.phone
                                  }

                                  operation={
                                    center.operation
                                  }

                                  facadeImageUrl={
                                    center.facadeImageUrl
                                  }

                                  municipalityImageUrl={
                                    center.municipalityImageUrl
                                  }

                                  neighborhoodImageUrl={
                                    center.neighborhoodImageUrl
                                  }

                                  onOpen={() =>
                                    setModalItem(center)
                                  }

                                />

                              ))}

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                  {/* MUNICIPIO */}
                  {selectedFilter ===
                    "municipio" && (

                    <div
                      style={{
                        padding: "30px"
                      }}
                    >

                      {Object.keys(

                        groupCentersBy(
                          allCenters,
                          "municipio"
                        )

                      ).length > 0 ? (

                        Object.entries(

                          groupCentersBy(
                            allCenters,
                            "municipio"
                          )

                        ).map(
                          ([municipio, centers]) => (

                            <div
                              key={municipio}
                              style={{
                                marginBottom: "50px"
                              }}
                            >

                              <h1
                                style={{
                                  color: "black",
                                  marginBottom: "20px"
                                }}
                              >
                                {municipio}
                              </h1>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "20px",
                                  flexWrap: "wrap"
                                }}
                              >

                                {centers.map((center) => (

                                  <Item

                                    key={
                                      center.bloodCenterId
                                    }

                                    title={center.name}

                                    score={
                                      center.bloodStock
                                    }

                                    address={
                                      center.address
                                    }

                                    phones={
                                      center.phone
                                    }

                                    operation={
                                      center.operation
                                    }

                                    facadeImageUrl={
                                      center.facadeImageUrl
                                    }

                                    municipalityImageUrl={
                                      center.municipalityImageUrl
                                    }

                                    neighborhoodImageUrl={
                                      center.neighborhoodImageUrl
                                    }

                                    onOpen={() =>
                                      setModalItem(center)
                                    }

                                  />

                                ))}

                              </div>

                            </div>

                          )
                        )

                      ) : (

                        <div
                          style={{
                            padding: "40px",
                            color: "black",
                            fontSize: "1.2rem",
                            fontWeight: "600"
                          }}
                        >
                          Nenhum município
                          disponível nos dados.
                        </div>

                      )}

                    </div>

                  )}

                  {/* ESTADO */}
                  {selectedFilter ===
                    "estado" && (

                    <>

                      {Object.entries(

                        groupCentersBy(
                          allCenters,
                          "estado"
                        )

                      ).map(
                        ([estado, centers]) => (

                          <TitleList

                            key={estado}

                            title={estado}

                            initialItems={
                              centers
                            }

                            onOpen={
                              setModalItem
                            }

                          />

                        )
                      )}

                    </>

                  )}

                  {/* ABERTOS */}
                  {selectedFilter ===
                    "abertos" && (

                    <>

                      {Object.keys(

                        groupCentersBy(
                          allCenters,
                          "abertos"
                        )

                      ).length > 0 ? (

                        Object.entries(

                          groupCentersBy(
                            allCenters,
                            "abertos"
                          )

                        ).map(
                          ([titulo, centers]) => (

                            <TitleList

                              key={titulo}

                              title={titulo}

                              initialItems={
                                centers
                              }

                              onOpen={
                                setModalItem
                              }

                            />

                          )
                        )

                      ) : (

                        <div
                          style={{
                            padding: "40px",
                            color: "black",
                            fontSize: "1.2rem",
                            fontWeight: "600"
                          }}
                        >
                          Nenhuma unidade aberta
                          encontrada.
                        </div>

                      )}

                    </>

                  )}

                </>

              )}

              {/* MODAL BAIRRO */}
              {neighborhoodModal && (

                <NeighborhoodModal

                  item={
                    neighborhoodModal
                  }

                  onClose={() =>
                    setNeighborhoodModal(
                      null
                    )
                  }

                  onOpenCenter={(center) => {

                    setNeighborhoodModal(
                      null
                    );

                    setModalItem(center);

                  }}

                />

              )}

              {/* MODAL */}
              {modalItem && (

                <Modal

                  item={modalItem}

                  onClose={() =>
                    setModalItem(null)
                  }

                />

              )}

            </div>

          }

        />

        {/* INFO */}
        <Route

          path="/info"

          element={<Info />}

        />

      </Routes>

    </BrowserRouter>
  );
}