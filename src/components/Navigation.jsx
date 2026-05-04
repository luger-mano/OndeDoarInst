import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  const items = [
    { label: "Quem Somos", path: "/info#quem-somos" },
    { label: "Por que doar?", path: "/info#porque-doar" },
    { label: "Requisitos de Doação", path: "/info#requisitos" },
  ];

  return (
    <div className="Navigation">
      <nav aria-label="Main navigation">
        <ul>
          {items.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="nav-link"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}