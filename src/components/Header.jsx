import React from "react";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#0b3d4e" }}>
      <div className="container d-flex justify-content-center">
        <a className="navbar-brand text-white fw-bold" href="#" style={{ fontSize: "1.5rem" }}>
          Expense Manager
        </a>
      </div>
    </nav>
  );
};

export default Header;
