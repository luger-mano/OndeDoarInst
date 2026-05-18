import React, { useState, useEffect, useRef } from "react";
import ModalLogin from "../ModalLogin/ModalLogin";
import ModalEdicao from "../ModalEdicao/ModalEdicao";
import ModalCadastro from "../ModalCadastro/ModalCadastro";
import logo_without_account from "../../assets/logo_without_account.svg"
import "./UserProfile.css";

const DEFAULT_PROFILES = [
  {
    name: "Jack Oliver",
    img: "https://i.pravatar.cc/96?u=jack",
  },
  {
    name: "Alexander",
    img: "https://i.pravatar.cc/96?u=alex",
  },
  {
    name: "Mattias",
    img: "https://i.pravatar.cc/96?u=mattias",
  },
];

export default function UserProfile() {
  const [profiles, setProfiles] = useState(DEFAULT_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleSelect(i) {
    setCurrentIndex(i);
    setOpen(false);
  }

  // function handleAddProfile() {
  //   const name = prompt("Enter profile name:");
  //   if (!name) return;
  //   const img = `https://i.pravatar.cc/96?u=${Date.now()}`;
  //   setProfiles((prev) => [...prev, { name, img }]);
  //   setCurrentIndex(profiles.length);
  //   setOpen(false);
  // }

  const current = profiles[currentIndex];

  return (
    <div
      className={`UserProfile ${open ? "open" : ""}`}
      ref={ref}
    >
         {/* <button onClick={() => setLoginOpen(true)}>Login</button> */}
              
            <ModalLogin isOpen={loginOpen}onClose={() => setLoginOpen(false)}/> 
      
             {/* <button onClick={() => setEditOpen(true)}> Abrir edição</button> */}
      
            <ModalEdicao isOpen={editOpen}onClose={() => setEditOpen(false)}/>

              <ModalCadastro
                            isOpen={registerOpen}
                            onClose={() => setRegisterOpen(false)}
                          />


      {/* Current user trigger */}
      <div
        className="User"
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
        }}
      >
        <div className="image">
          <img
            src={logo_without_account}
            alt={current?.name || "Profile"}
          />
        </div>
        <span className="caret">▾</span>
      </div>

      <div className="UserProfile-menu">
       
        <div className="UserNavigation">
          <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setLoginOpen(true)}>Login</button></div>
          <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setRegisterOpen(true)}>Cadastro</button></div>
          <div className="UserProfile-menu-item"><button className="botaoLog" onClick={() => setEditOpen(true)}>Editar Perfil</button></div>
        </div>

        <hr className="UserProfile-menu-divider" />
        <div
          className="UserProfile-menu-item"
          style={{ color: "rgba(105, 105, 105, 0.55)" }}
        >
          Sair
        </div>
      </div>
    </div>
  );
}