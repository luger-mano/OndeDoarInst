import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import Search from "./Search";
import UserProfile from "./UserProfile";

export default function Header({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`Header ${scrolled ? "scrolled" : ""}`}>
      <Logo />
      <Navigation />
      <div className="Header-right">
        {/* <button className="NotifBtn" title="Notifications" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20">
            <path d="M9.99998 18.3333C10.9166 18.3333 11.6666 17.5833 11.6666 16.6666H8.33331C8.33331 17.5833 9.08331 18.3333 9.99998 18.3333ZM15 13.3333V9.16665C15 6.60831 13.6416 4.46665 11.25 3.89998V3.33331C11.25 2.64165 10.6916 2.08331 9.99998 2.08331C9.30831 2.08331 8.74998 2.64165 8.74998 3.33331V3.89998C6.36665 4.46665 4.99998 6.59998 4.99998 9.16665V13.3333L3.33331 15V15.8333H16.6666V15L15 13.3333Z" fill="black" />
          </svg>
        </button> */}
        <UserProfile />
      </div>
    </header>
  );
}