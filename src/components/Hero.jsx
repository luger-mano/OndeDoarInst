import React, { useState, useEffect, useRef } from "react";
import HeroButton from "./HeroButton";
import Search from "./Search";

const API_KEY = "87dfa1c669eea853da609d4968d294be";
const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

export default function Hero({ onMoreInfo, onSearch }) {
  const [featured, setFeatured] = useState([]);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
    )
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
      videoRef.current.playbackRate = 10.0;
    }
  }, []);

  function goTo(i) {
    setIdx(i);
    clearInterval(timerRef.current);
  }

  const item = featured[idx];

  if (!item) {
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
        onLoadedMetadata={() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }}
      />

      <div className="vignette" />

      <div className="content">
        <div className="button-wrapper">
          <Search onSearch={onSearch} />
          <HeroButton
            primary={false}
            text="Filtrar por: "
            filter="São Paulo"
            icon="▾"
            onClick={() => onMoreInfo && onMoreInfo(item)}
          />
        </div>
      </div>
    </div>
  );
}