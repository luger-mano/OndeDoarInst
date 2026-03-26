import React, { useState, useCallback } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TitleList from "./components/TitleList";
import SearchResults from "./components/SearchResults";
import Modal from "./components/Modal";
import "./App.css";

const API_KEY = "87dfa1c669eea853da609d4968d294be";

// All content rows shown on the homepage
const ROWS = [
  { title: "Top Picks for You", url: "trending/all/week" },
  { title: "Trending Now", url: "trending/movie/day" },
  { title: "Netflix Originals", url: "discover/tv?with_networks=213&sort_by=popularity.desc" },
  { title: "Popular on Netflix", url: "discover/movie?sort_by=popularity.desc&page=1" },
  { title: "Most Watched in Horror", url: "discover/movie?with_genres=27&sort_by=popularity.desc&page=1" },
  { title: "Sci-Fi Greats", url: "discover/movie?with_genres=878&sort_by=popularity.desc&page=1" },
  { title: "Comedy Magic", url: "discover/movie?with_genres=35&sort_by=popularity.desc&page=1" },
  { title: "Action & Adventure", url: "discover/movie?with_genres=28&sort_by=popularity.desc&page=1" },
  { title: "Top Rated", url: "movie/top_rated" },
];

export default function App() {
  const [searchResults, setSearchResults] = useState(null); // null = not searching
  const [modalItem, setModalItem] = useState(null);

  // Called by Search component whenever query changes
  const handleSearch = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setSearchResults(null);
      return;
    }

    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
      query
    )}&api_key=${API_KEY}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      // Only show results that have an image
      const filtered = (json.results || []).filter(
        (x) => x.backdrop_path || x.poster_path
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error("Search error:", err);
    }
  }, []);

  return (
    <div>
      {/* Fixed top navigation */}
      <Header onSearch={handleSearch} />

      {searchResults ? (
        /* ── Search results view ── */
        <SearchResults results={searchResults} onOpen={setModalItem} />
      ) : (
        /* ── Normal home view ── */
        <>
          <Hero onMoreInfo={setModalItem} onSearch={handleSearch} />

          {ROWS.map((row) => (
            <TitleList
              key={row.url}
              title={row.title}
              url={row.url}
              onOpen={setModalItem}
            />
          ))}
        </>
      )}

      {/* ── Footer ── */}
      <footer className="Footer">
        <div className="footer-logo">
          {/* Inline Netflix wordmark */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="3 0 200 200"
            width="80"
            height="40"
            fill="none"
            aria-label="Onde Doar"
            role="img"
          >

            <path d="M28.7763 -1.25785e-06C24.9974 -1.09267e-06 21.2554 0.744321 17.7641 2.19047C14.2728 3.63661 11.1005 5.75626 8.42839 8.42839C5.75626 11.1005 3.63661 14.2728 2.19046 17.7641C0.74432 21.2554 -1.58822e-06 24.9974 -1.25785e-06 28.7763C-9.27486e-07 32.5553 0.744321 36.2972 2.19047 39.7885C3.63661 43.2798 5.75626 46.4521 8.42839 49.1243C11.1005 51.7964 14.2728 53.916 17.7641 55.3622C21.2554 56.8083 24.9974 57.5526 28.7763 57.5526L28.7763 46.457C26.4545 46.457 24.1553 45.9997 22.0102 45.1112C19.8651 44.2226 17.916 42.9203 16.2742 41.2785C14.6324 39.6367 13.33 37.6876 12.4415 35.5424C11.5529 33.3973 11.0956 31.0982 11.0956 28.7763C11.0956 26.4545 11.5529 24.1553 12.4415 22.0102C13.33 19.8651 14.6324 17.916 16.2742 16.2742C17.916 14.6324 19.8651 13.33 22.0102 12.4415C24.1553 11.5529 26.4545 11.0956 28.7763 11.0956L28.7763 -1.25785e-06Z" fill="#E21221" />
            <path d="M28.7764 57.5527C32.5554 57.5527 36.2973 56.8084 39.7886 55.3622C43.2799 53.9161 46.4522 51.7964 49.1243 49.1243C51.7965 46.4522 53.9161 43.2799 55.3623 39.7886C56.8084 36.2973 57.5527 32.5553 57.5527 28.7764C57.5527 24.9974 56.8084 21.2555 55.3623 17.7642C53.9161 14.2729 51.7965 11.1006 49.1243 8.42845C46.4522 5.75632 43.2799 3.63667 39.7886 2.19053C36.2973 0.744381 32.5554 5.96121e-05 28.7764 5.97773e-05L28.7764 11.0957C31.0983 11.0957 33.3974 11.553 35.5425 12.4415C37.6876 13.3301 39.6368 14.6324 41.2786 16.2742C42.9204 17.916 44.2227 19.8651 45.1113 22.0103C45.9998 24.1554 46.4571 26.4545 46.4571 28.7764C46.4571 31.0982 45.9998 33.3974 45.1113 35.5425C44.2227 37.6876 42.9204 39.6367 41.2786 41.2785C39.6368 42.9203 37.6876 44.2227 35.5425 45.1112C33.3974 45.9998 31.0983 46.4571 28.7764 46.4571L28.7764 57.5527Z" fill="#E21221" />
            <path d="M7.25935 34.1509L7.25935 38.3846C7.25936 41.7555 9.6591 44.649 12.9719 45.2724L24.6927 47.478C28.5546 48.2048 32.5492 47.5518 35.9787 45.6332L48.2796 38.7516C51.6195 36.8831 52.2968 32.3644 49.6515 29.5988C48.267 28.1514 46.2382 27.5126 44.2742 27.9054C43.0257 28.1551 41.7297 27.991 40.583 27.4378L33.8634 24.1966C30.5044 22.5764 26.4642 23.7426 24.4852 26.9037L23.095 29.1243C21.4652 31.7277 17.9067 32.2827 15.5616 30.2992C12.2828 27.5261 7.25935 29.8566 7.25935 34.1509Z" fill="#E21221" />
            <path d="M22.6048 52.8826C22.3512 49.2916 25.1959 46.2389 28.7958 46.2389C32.3813 46.2389 35.2209 49.2683 34.9893 52.8463L30.8153 117.325C30.7528 118.29 29.9522 119.041 28.9855 119.041C28.0229 119.041 27.2242 118.296 27.1564 117.336L22.6048 52.8826Z" fill="#E21221" />

          </svg>
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

      {/* ── Detail Modal ── */}
      {modalItem && (
        <Modal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </div>
  );
}