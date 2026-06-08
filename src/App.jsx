  import React, { useState, useEffect, useCallback } from "react";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import { getUserLocation } from "./services/locationService";
  import Header from "./components/Header";
  import Hero from "./components/Hero";
  import TitleList from "./components/TitleList";
  import ZoneSection from "./components/ZoneSection/ZoneSection";
  import SearchResults from "./components/SearchResults/SearchResults";
  import Modal from "./components/Modal";
  import NeighborhoodModal from "./components/NeighborhoodModal";
  import MapModal from "./components/MapModal";
  import Info from "./pages/infopage/info";
  import TeamCard from "./components/TeamCard/TeamCard";
  import "./components/TeamCard/TeamSection.css";

  import hug from "./assets/fotosDevs/hug.png";
  import hug2 from "./assets/fotosDevs/hug2.png";
  import kai from "./assets/fotosDevs/kai.png";
  import kai2 from "./assets/fotosDevs/kai2.png";
  import luc from "./assets/fotosDevs/luc.png";
  import luc2 from "./assets/fotosDevs/luc2.png";
  import rob from "./assets/fotosDevs/rob.png";
  import rob2 from "./assets/fotosDevs/rob2.png";

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
    const [loadingNearest, setLoadingNearest] = useState(false);
    const [allCenters, setAllCenters] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [modalItem, setModalItem] = useState(null);
    const [neighborhoodModal, setNeighborhoodModal] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("zona");
    const [nearestCenters, setNearestCenters] = useState([]);
    const [showTeam, setShowTeam] = useState(false);
    const [showMap, setShowMap] = useState(false);

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

 const handleNearestFilter = async () => {

  try {

    const location =
      await getUserLocation();
setLoadingNearest(true);
    const response =
      await fetch(

        `http://localhost:8080/centers/filter/nearest?latitudeStarting=${location.latitude}&longitudeStarting=${location.longitude}`

      );

      

    if (!response.ok) {

      throw new Error(
        `Erro ${response.status}`
      );
    }

    const data =
      await response.json();

    console.log(
      "HEMOCENTROS PRÓXIMOS:",
      data
    );

    setNearestCenters(data);

    

  } catch (error) {

    console.error(
      error
    );
  }finally {
  setLoadingNearest(false);
}
};

useEffect(() => {

  if (
    selectedFilter === "proximos" &&
    nearestCenters.length === 0
  ) {

    setLoadingNearest(true);

    handleNearestFilter();
  }

}, [selectedFilter]);



    const handleSearch = useCallback(async (query) => {
      if (!query || !query.trim()) {
        setSearchResults(null);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/centers/filter/search?search=${encodeURIComponent(query)}`);
        if (!response.ok) {

  console.error(
    "STATUS:",
    response.status
  );

  throw new Error(
    `Erro ${response.status}`
  );
}
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

     if (selectedFilter === "proximos") {

  if (loadingNearest) {

    return (
      <div
        style={{
          padding: "40px",
          color: "black",
          fontSize: "1.2rem",
          fontWeight: "600"
        }}
      >
        📍 Obtendo sua localização...
      </div>
    );
  }

  if (nearestCenters.length === 0) {

    return (
      <div
        style={{
          padding: "40px",
          color: "black",
          fontSize: "1.2rem",
          fontWeight: "600"
        }}
      >
        Nenhum hemocentro encontrado próximo à sua localização.
      </div>
    );
  }

  return (
    <TitleList
      title="Hemocentros mais próximos"
      initialItems={nearestCenters}
      onOpen={setModalItem}
    />
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
                  <Hero 
                    onSearch={handleSearch} 
                    onFilterChange={setSelectedFilter} 
                    onOpenMap={() => setShowMap(true)}
                  />
                  {searchResults !== null ? (
                    <SearchResults results={searchResults} onOpen={setModalItem} />
                  ) : (
                    renderFilteredContent()
                  )}

                  {/* MODAL DE MAPA v2.8 */}
                  {showMap && <MapModal onClose={() => setShowMap(false)} />}

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

        {/* FOOTER COM DROPUP v2.1 */}
        <footer 
          className="main-footer"
          onMouseEnter={() => setShowTeam(true)}
          onMouseLeave={() => setShowTeam(false)}
          onClick={() => setShowTeam(!showTeam)}
        >
          {showTeam && (
            <div className="footer-team-dropup" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-section-content" style={{ padding: '30px', textAlign: 'left', background: '#fff', borderRadius: '24px 24px 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)' }}>
                <span className="menu-tag">EQUIPE ONDEDOAR</span>
                <h2 style={{ margin: '10px 0' }}>Conheça nossa equipe</h2>
                <p className="team-description" style={{ marginBottom: '20px', color: '#666' }}>
                  Somos uma equipe de doadores apaixonada por tecnologia e impacto social,
                  unindo nossas habilidades para facilitar a doação de sangue.
                </p>
                <div className="team-grid">
                  <TeamCard name="Hugo Severo" role="CEO" email="contato@hugosevero.com" linkedin="https://www.linkedin.com/in/hugosevero/" photo={hug} photoDonation={hug2} />
                  <TeamCard name="Kaiqui Petty" role="DevOps" email="kaiquidejesus@gmail.com" linkedin="https://www.linkedin.com/in/kaiqui-petty-6b9299217/" photo={kai} photoDonation={kai2} />
                  <TeamCard name="Lucas Germano" role="CTO e Desenvolvedor Full-Stack" email="germanoluc890@gmail.com" linkedin="https://www.linkedin.com/in/lucas-germano-dev/" photo={luc} photoDonation={luc2} />
                  <TeamCard name="Robson Rioki" role="Desenvolvedor Front-End" email="riokirobson@gmail.com" linkedin="https://www.linkedin.com/in/riokirobson/" photo={rob} photoDonation={rob2} />
                </div>
              </div>
            </div>
          )}
          <span className={`footer-text ${showTeam ? 'active' : ''}`}>
            Desenvolvido por doadores &copy; Onde Doar 2026
          </span>
        </footer>
      </div>
    </BrowserRouter>
  );
  }