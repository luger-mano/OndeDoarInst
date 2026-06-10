import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation/Navigation";
import UserProfile from "./UserProfile/UserProfile";
import MapModal from "./MapModal";

export default function Header({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`Header ${scrolled ? "scrolled" : ""}`}>
        <div className="div-logo-nav">
          <Logo onLogoClick={() => setShowMap(true)} />
          <Navigation />
        </div>
        <div className="Header-right">
          <UserProfile />
        </div>
      </header>

      {showMap && <MapModal onClose={() => setShowMap(false)} />}
    </>
  );
}