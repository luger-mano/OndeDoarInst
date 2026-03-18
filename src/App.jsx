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
            <path d="M78.7401 18H243.174C252.009 18 260.505 21.8447 265.083 29.4014C270.282 37.985 276.107 50.3191 276.107 62.5C276.107 73.0179 270.284 83.8422 265.086 91.4106C260.43 98.1889 252.409 101.5 244.186 101.5C158.911 101.5 121.267 101.5 36.5619 101.5C27.4507 101.5 18.6911 105.59 13.9307 113.359C8.48804 122.241 2.37223 134.6 2.60654 145C2.82571 154.728 8.67738 166.127 13.9133 174.433C18.7032 182.032 27.3132 186 36.2955 186H116.815" stroke="#5DA8E6" stroke-width="5.2" stroke-miterlimit="3.99393" stroke-linejoin="round" stroke-dasharray="30 15" />
            <path d="M132.464 32.0909V83H124.261L100.273 48.3232H99.8501V83H90.6278V32.0909H98.8807L122.844 66.7926H123.291V32.0909H132.464ZM166.764 83H149.513V32.0909H167.112C172.166 32.0909 176.508 33.1101 180.138 35.1484C183.783 37.1702 186.584 40.0786 188.54 43.8736C190.495 47.6686 191.473 52.2093 191.473 57.4957C191.473 62.7988 190.487 67.3561 188.515 71.1676C186.559 74.9792 183.734 77.9041 180.038 79.9425C176.359 81.9808 171.934 83 166.764 83ZM158.735 75.0206H166.317C169.863 75.0206 172.821 74.3743 175.191 73.0817C177.561 71.7725 179.342 69.8253 180.535 67.2401C181.729 64.6383 182.325 61.3902 182.325 57.4957C182.325 53.6013 181.729 50.3698 180.535 47.8011C179.342 45.2159 177.577 43.2853 175.241 42.0092C172.921 40.7166 170.037 40.0703 166.59 40.0703H158.735V75.0206ZM207.235 83V32.0909H240.346V39.8217H216.458V53.6428H238.631V61.3736H216.458V75.2692H240.545V83H207.235Z" fill="#E21221" />
            <path d="M51.8793 166H34.6278V115.091H52.2273C57.2817 115.091 61.6236 116.11 65.2528 118.148C68.8987 120.17 71.6993 123.079 73.6548 126.874C75.6103 130.669 76.5881 135.209 76.5881 140.496C76.5881 145.799 75.602 150.356 73.63 154.168C71.6745 157.979 68.849 160.904 65.1534 162.942C61.4744 164.981 57.0497 166 51.8793 166ZM43.8501 158.021H51.4318C54.9782 158.021 57.9363 157.374 60.3061 156.082C62.6759 154.772 64.4574 152.825 65.6506 150.24C66.8438 147.638 67.4403 144.39 67.4403 140.496C67.4403 136.601 66.8438 133.37 65.6506 130.801C64.4574 128.216 62.6925 126.285 60.3558 125.009C58.0358 123.717 55.1522 123.07 51.7053 123.07H43.8501V158.021Z" fill="#E21221" />
            <path d="M112.372 82.5889C112.628 82.1447 113.266 82.1471 113.52 82.5781C118.156 90.4414 124.53 101.251 129.746 111.857C132.354 117.16 134.661 122.388 136.313 127.152C137.972 131.936 138.938 136.161 138.938 139.485C138.938 153.853 127.29 165.5 112.923 165.5C98.5552 165.5 86.9074 153.853 86.9073 139.485C86.9073 136.166 87.8887 131.946 89.5694 127.164C91.2429 122.403 93.5756 117.178 96.2032 111.877C101.461 101.271 107.843 90.4686 112.372 82.5889Z" fill="white" stroke="#E21221" stroke-width="2.60152" stroke-linejoin="round" />
            <path d="M98.484 148.617C94.6338 152.763 90.4627 150.992 88.8584 149.589C91.7851 154.676 97.3134 165.5 113.573 165.5C127.556 165.5 134.277 154.892 136.986 149.913C132.775 152.504 133.377 151.532 125.857 149.589C118.337 147.646 114.727 155.094 109.313 155.094C103.898 155.094 103.297 143.436 98.484 148.617Z" fill="#E21221" />
            <path d="M52.3722 3.58887C52.6276 3.14467 53.2655 3.14709 53.5196 3.57812C58.1555 11.4414 64.5299 22.2513 69.7462 32.8574C72.354 38.1599 74.6605 43.3884 76.3126 48.1523C77.9716 52.9364 78.9376 57.1607 78.9376 60.4854C78.9376 74.8529 67.2905 86.4997 52.9229 86.5C38.5552 86.5 26.9074 74.8531 26.9073 60.4854C26.9073 57.1658 27.8887 52.946 29.5694 48.1641C31.2429 43.4029 33.5756 38.1778 36.2032 32.877C41.4608 22.2707 47.8435 11.4686 52.3722 3.58887Z" stroke="#E21221" stroke-width="2.60152" stroke-linejoin="round" />
            <path d="M49.3453 28.777C43.4919 24.2244 40.24 28.1266 38.6141 28.777L28.208 51.0548C26.2568 65.9051 28.208 87.8012 56.1743 86.1753C80.8888 84.7384 80.6719 56.7998 76.0109 46.8273L66.5804 26.8257C61.0272 22.7783 59.4253 24.2449 58.9632 26.3055C58.6084 27.8874 58.3373 29.6437 56.8541 30.2986C55.0984 31.0738 52.4179 31.1668 49.3453 28.777Z" fill="#E21221" />
            <path d="M154.165 166H144.322L162.244 115.091H173.629L191.577 166H181.733L168.136 125.531H167.738L154.165 166ZM154.489 146.039H181.335V153.447H154.489V146.039ZM205.282 166V115.091H224.373C228.284 115.091 231.565 115.77 234.217 117.129C236.885 118.488 238.898 120.394 240.257 122.847C241.633 125.283 242.32 128.125 242.32 131.373C242.32 134.638 241.624 137.471 240.232 139.874C238.857 142.261 236.827 144.108 234.142 145.418C231.458 146.71 228.16 147.357 224.249 147.357H210.651V139.7H223.006C225.293 139.7 227.165 139.385 228.624 138.756C230.082 138.109 231.159 137.173 231.855 135.947C232.568 134.704 232.924 133.179 232.924 131.373C232.924 129.567 232.568 128.025 231.855 126.749C231.143 125.457 230.057 124.479 228.599 123.816C227.141 123.137 225.26 122.797 222.956 122.797H214.504V166H205.282ZM231.582 142.932L244.185 166H233.894L221.514 142.932H231.582Z" fill="#E21221" />
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
              <option value="en">🌐 English</option>
              <option value="hi">हिन्दी</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="pt-BR">Português</option>
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