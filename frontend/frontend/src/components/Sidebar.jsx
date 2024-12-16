import React from 'react';
import './Sidebar.css'; // Importiere das CSS-Stylesheet

const Sidebar = ({ navigate }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Your Logo</h2>
      </div>
      <div style={{ width: '100%', border: '1px #1D1E2C solid' }}></div>
      <ul className="nav-list">
        <li className="nav-item" onClick={() => navigate('dashboard')}>
          <i className="icon">⌛</i> Dashboard
        </li>
        {/*<li className="nav-item" onClick={() => navigate('verbrauch')}>
          <i className="icon">🍴</i> Verbrauch
        </li>
        <li className="nav-item" onClick={() => navigate('zutaten')}>
          <i className="icon">📦</i> Zutaten
        </li>*/}
        <li className="nav-item" onClick={() => navigate('getraenke')}>
          <i className="icon">🥤</i> Getränke
        </li>
        <li className="nav-item" onClick={() => navigate('transaktionen')}>
          <i className="icon">💳</i> Transaktionen
        </li>
        <li className="nav-item" onClick={() => navigate('einnahmen')}>
          <i className="icon">📈</i> Einnahmen
        </li>
        <li className="nav-item" onClick={() => navigate('ausgaben')}>
          <i className="icon">💲</i> Ausgaben
        </li>
        <li className="nav-item" onClick={() => navigate('verkaufszahlen')}>
          <i className="icon">📊</i> Verkaufszahlen
        </li>
      </ul>
      <div style={{ width: '100%', border: '1px #1D1E2C solid' }}></div>
      <div className="bottom-links">
        <li className="nav-item" onClick={() => navigate('settings')}>
          <i className="icon">⚙️</i> Settings
        </li>
        {/*<div className="nav-item">
          <i className="icon">❓</i> Support
        </div>*/}
        <div style={{ width: '100%', border: '1px #1D1E2C solid' }}></div>
        <div className="nav-item logout">
          <i className="icon">🔓</i> Log out
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
