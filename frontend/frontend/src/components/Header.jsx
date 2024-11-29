import React from 'react';
import './Header.css';
import { FaSun, FaSearch, FaBell } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="top-bar">
      {/* Linker Abschnitt */}
      <h1>Hello, Drax</h1>

      {/* Rechter Abschnitt */}
      <div className="right-section">
        {/* Icons */}
        <FaSun className="icon" />
        <FaSearch className="icon" />
        <FaBell className="icon" />

        {/* Benutzerprofil */}
        <div className="profile">
          <img
            src="https://via.placeholder.com/40" // Avatar-URL ersetzen
            alt="User Avatar"
          />
          <span>Danish A.</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
