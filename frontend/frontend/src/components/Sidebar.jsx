import React from 'react';
import './Sidebar.css'; // Importiere das CSS-Stylesheet

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Your Logo</h2>
      </div>
      <div style={{width: '100%', border: '1px #1D1E2C solid'}}></div>
      <ul className="nav-list">
        <li className="nav-item active">
          <i className="icon">⌛</i> Dashboard
        </li>
        <li className="nav-item">
          <i className="icon">🍴</i> Verbrauch
        </li>
        <li className="nav-item">
          <i className="icon">📦</i> Zutaten
        </li>
        <li className="nav-item">
          <i className="icon">🥤</i> Getränke
        </li>
        <li className="nav-item">
          <i className="icon">📊</i> Verkaufszahlen
        </li>
      </ul>
      <div style={{width: '100%', border: '1px #1D1E2C solid'}}></div>
      <div className="bottom-links">
        <div className="nav-item"><i className="icon">⚙️</i> Settings</div>
        <div className="nav-item"><i className="icon">❓</i> Support</div>
        <div style={{width: '100%', border: '1px #1D1E2C solid'}}></div>
        <div className="nav-item logout"><i className="icon">🔓</i> Log out</div>
      </div>
    </div>
  );
};

export default Sidebar;
