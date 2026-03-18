import React, { useState, useRef } from "react";

export default function Search({ onSearch }) {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleIconClick = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (e.target.value.length > 2) {
      onSearch(e.target.value);
    }
    if (!e.target.value) {
      onSearch("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value);
  };

  const handleBlur = () => {
    if (!value) setOpen(false);
  };

  return (
    <form
      className={`Search ${open ? "open" : ""}`}
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="search-icon"
        onClick={handleIconClick}
        aria-label="Open search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="white" width="15" height="15">
          <path d="M9.375 8.25H8.7825L8.5725 8.0475C9.33291 7.16552 9.75083 6.03952 9.75 4.875C9.75 3.91082 9.46409 2.96829 8.92842 2.1666C8.39274 1.36491 7.63137 0.740067 6.74058 0.371089C5.84979 0.00211226 4.86959 -0.094429 3.92394 0.093674C2.97828 0.281777 2.10964 0.746076 1.42786 1.42786C0.746076 2.10964 0.281777 2.97828 0.093674 3.92394C-0.094429 4.86959 0.00211226 5.84979 0.371089 6.74058C0.740067 7.63137 1.36491 8.39274 2.1666 8.92842C2.96829 9.46409 3.91082 9.75 4.875 9.75C6.0825 9.75 7.1925 9.3075 8.0475 8.5725L8.25 8.7825V9.375L12 13.1175L13.1175 12L9.375 8.25ZM4.875 8.25C3.0075 8.25 1.5 6.7425 1.5 4.875C1.5 3.0075 3.0075 1.5 4.875 1.5C6.7425 1.5 8.25 3.0075 8.25 4.875C8.25 6.7425 6.7425 8.25 4.875 8.25Z" fill="black" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="search"
        placeholder="Endereço, CEP, Bairro"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label="Search"
      />
    </form>
  );
}