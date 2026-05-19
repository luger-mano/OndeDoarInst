import React, { useState, useEffect, useCallback } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TitleList from "./components/TitleList";
import SearchResults from "./components/SearchResults/SearchResults.jsx";
import Modal from "./components/Modal";

import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Info from "./pages/infopage/info.jsx";
import Footer from "./components/Footer/Footer.jsx";

export default function App() {

  const [allCenters, setAllCenters] = useState([]);

  const [searchResults, setSearchResults] = useState(null);

  const [modalItem, setModalItem] = useState(null);

  const [groups, setGroups] = useState({});

  // BUSCAR HEMOCENTROS
  useEffect(() => {

    fetch("http://localhost:8080/centers")

      .then((res) => res.json())

      .then((data) => {

        setAllCenters(data || []);

        // AGRUPAR POR ZONA
        const grouped = (data || []).reduce((acc, center) => {

          const zone = center.address?.zone;

          let zoneKey = "Outras Regiões";

          if (zone && zone !== "null") {
            zoneKey = `ZONA ${zone.toUpperCase()}`;
          }

          if (!acc[zoneKey]) {
            acc[zoneKey] = [];
          }

          acc[zoneKey].push(center);

          return acc;

        }, {});

        setGroups(grouped);

      })

      .catch((err) => console.error("Erro:", err));

  }, []);

  // PESQUISA BACKEND
  const handleSearch = useCallback(async (query) => {

    // LIMPAR PESQUISA
    if (!query || !query.trim()) {

      setSearchResults(null);

      return;
    }

    try {

      const response = await fetch(

        `http://localhost:8080/centers/filter/search?search=${encodeURIComponent(query)}`

      );

      const data = await response.json();

      setSearchResults(data || []);

    } catch (err) {

      console.error(
        "Erro ao pesquisar:",
        err
      );

      setSearchResults([]);

    }

  }, []);

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"

          element={

            <div>

              {/* HEADER */}
              <Header onSearch={handleSearch} />

              {/* HERO */}
              <Hero
                onMoreInfo={setModalItem}
                onSearch={handleSearch}
              />

              {/* RESULTADOS */}
              {searchResults ? (

                <SearchResults
                  results={searchResults}
                  onOpen={setModalItem}
                />

              ) : (

                <>
                  {/* LISTAS */}
                  {Object.keys(groups).length > 0 ? (

                    Object.keys(groups).map((locationName) => (

                      <TitleList
                        key={locationName}
                        title={locationName}
                        initialItems={groups[locationName]}
                        onOpen={setModalItem}
                      />

                    ))

                  ) : (

                    <div className="loading">
                      Carregando hemocentros...
                    </div>

                  )}
                </>

              )}

              {/* FOOTER */}
              {/* <Footer /> */}

              {/* MODAL */}
              {modalItem && (

                <Modal
                  item={modalItem}
                  onClose={() => setModalItem(null)}
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