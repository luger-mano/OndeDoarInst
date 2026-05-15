import React, { useState, useEffect, useRef } from "react";
import HeroButton from "./HeroButton";
import Search from "./Search";

const API_KEY = "87dfa1c669eea853da609d4968d294be";


const FILTER_OPTIONS = [
  { id: "zona", name: "Filtrar por Zona", img: "https://cdn-icons-png.flaticon.com/512/854/854878.png" },
  { id: "bairro", name: "Filtrar por Bairro", img: "https://cdn-icons-png.flaticon.com/512/1210/1210103.png" },
  { id: "municipio", name: "Filtrar por Município", img: "https://cdn-icons-png.flaticon.com/512/1210/1210103.png" },
  { id: "estado", name: "Filtrar por Estado", img: "https://cdn-icons-png.flaticon.com/512/484/484167.png" },
  { id: "abertos", name: "Filtrar por  Abertos", img: "https://cdn-icons-png.flaticon.com/512/4149/4149673.png" },
  { id: "proximos", name: "Mais próximos", img: "https://cdn-icons-png.flaticon.com/512/1865/1865269.png" },
];

export default function Hero({ onMoreInfo, onSearch, onFilterChange }) {
  
  const [featured, setFeatured] = useState([]);
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("São Paulo");

  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const menuRef = useRef(null);

  
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const items = (data.results || [])
          .filter((x) => x.backdrop_path)
          .slice(0, 6);
        setFeatured(items);
      })
      .catch(console.error);
  }, []);

  
  useEffect(() => {
    if (!featured.length) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % featured.length);
    }, 8000);
    return () => clearInterval(timerRef.current);
  }, [featured.length]);

  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  
  const item = featured[idx];

  
  if (!featured.length) {
    return <div className="Hero" style={{ background: "#ffffff" }} />;
  }

  return (
    <div className="Hero">
      <video
        ref={videoRef}
        className="bg"
        src="/home.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="vignette" />

      <div className="content">
        <div className="button-wrapper">
          <Search onSearch={onSearch} />

          {/* Wrapper do Menu de Filtragem */}
          <div className={`UserProfile ${open ? "open" : ""}`} ref={menuRef}>
            <HeroButton
              primary={false}
              text="Filtrar por: "
              filter={selectedFilter}
              icon="▾"
              onClick={() => setOpen(!open)}
            />

            {/* Menu Dropdown - Mesma estrutura do UserProfile original */}
            <div className="UserProfile-menu hero-menu-adjust">
              <div className="UserProfileSwitch">
                {FILTER_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className="UserProfile-menu-item"
                    onClick={() => {
                      setSelectedFilter(opt.name.replace("Filtrar por ", ""));
                      setOpen(false);
                      if (onFilterChange) onFilterChange(opt.id);
                    }}
                  >
                    <img 
                      src={opt.img} 
                      alt={opt.name} 
                      style={{ 
                        filter: 'brightness(0) invert(0.2)', 
                        opacity: 0.8,
                        objectFit: 'contain' 
                      }} 
                    />
                    <span>{opt.name}</span>
                  </div>
                ))}
              </div>

              <hr className="UserProfile-menu-divider" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}