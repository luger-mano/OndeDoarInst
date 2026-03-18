import React from "react";

export default function HeroButton({ primary, text, icon, filter, onClick }) {
  return (
    <button
      className="Button"
      data-primary={primary}
      onClick={onClick}
    >
      {text}
      {filter && <span className="filter">{filter}</span>}
      {icon && <span className="btn-icon">{icon}</span>}
    </button>
  );
}