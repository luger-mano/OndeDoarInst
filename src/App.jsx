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
    const [capitalZones, setCapitalZones] = useState([]);
    const [metropolisZones, setMetropolisZones] = useState([]);
    const [interiorZones, setInteriorZones] = useState([]);
    
    const [allCenters, setAllCenters] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [modalItem, setModalItem] = useState(null);
    const [neighborhoodModal, setNeighborhoodModal] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("zona");

    // ===> NOVO: Estado para lembrar de qual bairro o usuário veio <===
    const [previousNeighborhood, setPreviousNeighborhood] = useState(null);

    useEffect(() => {
      const extractCenters = (data) => {
        const list = [];
        (data || []).forEach((zone) => {
          (zone.bairros || []).forEach((bairro) => {
            (bairro.bloodCenters || []).forEach((c) => list.push(c));
          });
        });
        return list;
      };

      Promise.all([
        fetch("http://localhost:8080/centers/filter/region/neighborhoods?regiao=capital").then(res => res.json()),
        fetch("http://localhost:8080/centers/filter/region/neighborhoods?regiao=metropole").then(res => res.json()),
        fetch("http://localhost:8080/centers/filter/region/neighborhoods?regiao=interior").then(res => res.json()),
        fetch("http://localhost:8080/centers").then(res => res.json()).catch(() => [])
      ])
      .then(([capitalData, metropolisData, interiorData, allData]) => {
        setCapitalZones(capitalData || []);
        setMetropolisZones(metropolisData || []);
        setInteriorZones(interiorData || []);

        const combinedRegionalCenters = [
          ...extractCenters(capitalData),
          ...extractCenters(metropolisData),
          ...extractCenters(interiorData)
        ];

        const generalCentersList = Array.isArray(allData) ? allData : [];
        const merged = [...combinedRegionalCenters];
        
        generalCentersList.forEach((center) => {
          if (!merged.some((c) => c.bloodCenterId === center.bloodCenterId)) {
            merged.push(center);
          }
        });
        
        setAllCenters(merged);
      })
      .catch((err) => console.error("Erro ao carregar dados iniciais:", err));
    }, []);

    const handleSearch = useCallback(async (query) => {
      if (!query || !query.trim()) {
        setSearchResults(null);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/centers/filter/search?search=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSearchResults(data || []);
      } catch (err) {
        console.error("Erro search:", err);
        setSearchResults([]);
      }
    }, []);

    const renderFilteredContent = () => {
      if (selectedFilter === "zona") {
        const hasAnyData = capitalZones.length > 0 || metropolisZones.length > 0 || interiorZones.length > 0;

        if (!hasAnyData) {
          return <div className="loading">Carregando hemocentros...</div>;
        }

        return (
          <div className="regions-container">
            {capitalZones.length > 0 && (
              <div className="region-group">
                {capitalZones.map((zoneObj) => (
                  <ZoneSection
                    key={`capital-${zoneObj.zone}`}
                    title={zoneObj.zone}
                    bairros={zoneObj.bairros || []}
                    onOpenNeighborhood={setNeighborhoodModal}
                  />
                ))}
              </div>
            )}

            {metropolisZones.length > 0 && (
              <div className="region-group" style={{ marginTop: "40px" }}>
                {metropolisZones.map((zoneObj) => (
                  <ZoneSection
                    key={`metropolis-${zoneObj.zone}`}
                    title={zoneObj.zone}
                    bairros={zoneObj.bairros || []}
                    onOpenNeighborhood={setNeighborhoodModal}
                  />
                ))}
              </div>
            )}

            {interiorZones.length > 0 && (
              <div className="region-group" style={{ marginTop: "40px" }}>
                {interiorZones.map((zoneObj) => (
                  <ZoneSection
                    key={`interior-${zoneObj.zone}`}
                    title={zoneObj.zone}
                    bairros={zoneObj.bairros || []}
                    onOpenNeighborhood={setNeighborhoodModal}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }

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
      {/* Wrapper principal para estruturar a página e o footer */}
      <div className="app-wrapper">
        <div className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Header onSearch={handleSearch} />
                  <Hero onSearch={handleSearch} onFilterChange={setSelectedFilter} />

                  {searchResults !== null ? (
                    <SearchResults results={searchResults} onOpen={setModalItem} />
                  ) : (
                    renderFilteredContent()
                  )}

                  {/* MODAL DE BAIRROS */}
                  {neighborhoodModal && (
                    <NeighborhoodModal
                      item={neighborhoodModal}
                      onClose={() => {
                        setNeighborhoodModal(null);
                        setPreviousNeighborhood(null);
                      }}
                      onOpenCenter={(center) => {
                        setPreviousNeighborhood(neighborhoodModal);
                        setNeighborhoodModal(null);
                        setModalItem(center);
                      }}
                    />
                  )}

                  {/* MODAL DE DETALHES DO CENTRO */}
                  {modalItem && (
                    <Modal 
                      item={modalItem} 
                      onClose={() => {
                        setModalItem(null);
                        if (previousNeighborhood) {
                          setNeighborhoodModal(previousNeighborhood);
                          setPreviousNeighborhood(null);
                        }
                      }} 
                    />
                  )}
                </div>
              }
            />
            <Route path="/info" element={<Info />} />
          </Routes>
        </div>

        {/* FOOTER ADICIONADO AQUI */}
        <footer className="main-footer">
          Desenvolvido por doadores &copy; Onde Doar 2026
        </footer>
      </div>
    </BrowserRouter>
  );
  }