import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TitleList from "./components/TitleList";
import ZoneSection from "./components/ZoneSection/ZoneSection";
import SearchResults from "./components/SearchResults/SearchResults.jsx";
import Modal from "./components/Modal";
import NeighborhoodModal from "./components/NeighborhoodModal";
import Info from "./pages/infopage/info.jsx";

import "./App.css";

// 1. MOVIDO PARA FORA: Função auxiliar de agrupamento
function groupCentersBy(items, field) {
  const grouped = {};
  items.forEach((center) => {
    let key = null;

    if (field === "bairro") {
      const bairro = center.address?.bairro;
      if (bairro && bairro !== "s/b") key = bairro;
    } else if (field === "municipio") {
      const municipio = center.address?.municipio;
      if (municipio && municipio !== "s/m") key = municipio;
    } else if (field === "estado") {
      key = "São Paulo";
    } else if (field === "abertos") {
      const op = center.operation?.toLowerCase() || "";
      if (!op.includes("fechada") && !op.includes("conferir")) {
        key = "Unidades abertas";
      }
    }

    if (!key) return;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(center);
  });
  return grouped;
}

export default function App() {
  const [zones, setZones] = useState([]);
  const [allCenters, setAllCenters] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [neighborhoodModal, setNeighborhoodModal] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("zona");

  useEffect(() => {
    fetch("http://localhost:8080/centers/filter/zone/neighborhoods")
      .then((res) => res.json())
      .then((data) => {
        setZones(data || []);
        const centers = [];
        (data || []).forEach((zone) => {
          (zone.bairros || []).forEach((bairro) => {
            (bairro.bloodCenters || []).forEach((c) => centers.push(c));
          });
        });

        fetch("http://localhost:8080/centers")
          .then((res) => res.json())
          .then((allData) => {
            const merged = [...centers];
            (allData || []).forEach((center) => {
              if (!merged.some((c) => c.bloodCenterId === center.bloodCenterId)) {
                merged.push(center);
              }
            });
            setAllCenters(merged);
          });
      })
      .catch((err) => console.error("Erro zonas:", err));
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

              `http://localhost:8080/centers/filter/search?search=${encodeURIComponent(query)}`

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

  // 2. FUNÇÃO RENDERIZADORA: Limpa o JSX principal
  const renderFilteredContent = () => {
    if (selectedFilter === "zona") {
      return zones?.length > 0 ? (
        zones.map((zoneObj) => (
          <ZoneSection
            key={zoneObj.zone}
            title={zoneObj.zone}
            bairros={zoneObj.bairros || []}
            onOpenNeighborhood={setNeighborhoodModal}
          />
        ))
      ) : (
        <div className="loading">Carregando zonas...</div>
      );
    }

    // 3. UNIFICAÇÃO: Trata bairro, municipio, estado e abertos de uma vez só!
    const groupedData = groupCentersBy(allCenters, selectedFilter);
    const entries = Object.entries(groupedData);

    if (entries.length === 0) {
      const emptyMessages = {
        bairro: "Nenhum bairro disponível nos dados.",
        municipio: "Nenhum município disponível nos dados.",
        abertos: "Nenhuma unidade aberta encontrada.",
        estado: "Nenhum dado de estado encontrado."
      };
      return (
        <div style={{ padding: "40px", color: "black", fontSize: "1.2rem", fontWeight: "600" }}>
          {emptyMessages[selectedFilter]}
        </div>
      );
    }

    return entries.map(([title, centers]) => (
      <TitleList key={title} title={title} initialItems={centers} onOpen={setModalItem} />
    ));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Header onSearch={handleSearch} />
              <Hero onSearch={handleSearch} onFilterChange={setSelectedFilter} />

              {/* RENDERIZAÇÃO CONDICIONAL LIMPA */}
              {searchResults !== null ? (
                <SearchResults results={searchResults} onOpen={setModalItem} />
              ) : (
                renderFilteredContent()
              )}

              {/* MODAIS */}
              {neighborhoodModal && (
                <NeighborhoodModal
                  item={neighborhoodModal}
                  onClose={() => setNeighborhoodModal(null)}
                  onOpenCenter={(center) => {
                    setNeighborhoodModal(null);
                    setModalItem(center);
                  }}
                />
              )}
              {modalItem && <Modal item={modalItem} onClose={() => setModalItem(null)} />}
            </div>
          }
        />
        <Route path="/info" element={<Info />} />
      </Routes>
    </BrowserRouter>
  );
}