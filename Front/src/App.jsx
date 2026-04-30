import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TitleList from "./components/TitleList";
import SearchResults from "./components/SearchResults";
import Modal from "./components/Modal";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Info from "./pages/infopage/info";

export default function App() {
  const [allCenters, setAllCenters] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [groups, setGroups] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/centers")
      .then((res) => res.json())
      .then((data) => {
        setAllCenters(data || []);

        const grouped = (data || []).reduce((acc, center) => {
          
          const zone = center.address?.zone;

          let zoneKey = "Outras Regiões";
          if (zone && zone !== "null") {
            zoneKey = `ZONA ${zone.toUpperCase()}`;  
          }

          if (!acc[zoneKey]) acc[zoneKey] = [];
          acc[zoneKey].push(center);
          return acc;
        }, {});

        setGroups(grouped);
      })
      .catch((err) => console.error("Erro:", err));
  }, []);



  const handleSearch = useCallback((query) => {
    if (!query || !query.trim()) {
      setSearchResults(null);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Filtro
    const filtered = allCenters.filter((center) => {
      const nameMatch = center.name?.toLowerCase().includes(lowerQuery);
      const bairroMatch = center.address?.bairro?.toLowerCase().includes(lowerQuery);
      const municipioMatch = center.address?.municipio?.toLowerCase().includes(lowerQuery);

      return nameMatch || bairroMatch || municipioMatch;
    });

    setSearchResults(filtered);
  }, [allCenters]);

  
 return (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <Header onSearch={handleSearch} />

            {searchResults ? (
              <SearchResults results={searchResults} onOpen={setModalItem} />
            ) : (
              <>
                <Hero onMoreInfo={setModalItem} />

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
                  <div className="loading">Carregando hemocentros...</div>
                )}
              </>
            )}

            <footer className="Footer">
              <div className="footer-logo">
                {/* seu SVG continua igual */}
                {/* ... (não mexi em nada aqui) */}
              </div>

              <div className="Footer-links">
                <div className="col">
                  <ul>
                    <li>FAQ</li>
                    <li>Investor Relations</li>
                    <li>Privacy</li>
                    <li>Speed Test</li>
                  </ul>
                </div>
                <div className="col">
                  <ul>
                    <li>Help Center</li>
                    <li>Jobs</li>
                    <li>Cookie Preferences</li>
                    <li>Legal Notices</li>
                  </ul>
                </div>
                <div className="col">
                  <ul>
                    <li>Account</li>
                    <li>Ways to Watch</li>
                    <li>Corporate Information</li>
                    <li>Only on Netflix</li>
                  </ul>
                </div>
                <div className="col">
                  <ul>
                    <li>Media Center</li>
                    <li>Terms of Use</li>
                    <li>Contact Us</li>
                  </ul>
                </div>
              </div>

              <div className="Footer-bottom">
                <div className="language">
                  <select defaultValue="en" aria-label="Language">
                    <option value="pt-BR">Português</option>
                    <option value="en">🌐 English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div className="copyright">
                  © {new Date().getFullYear()} Onde Doar.
                </div>
              </div>
            </footer>

            {modalItem && (
              <Modal item={modalItem} onClose={() => setModalItem(null)} />
            )}
          </div>
        }
      />

      {/* NOVA ROTA */}
      <Route path="/info" element={<Info />} />
    </Routes>
  </BrowserRouter>
);
}