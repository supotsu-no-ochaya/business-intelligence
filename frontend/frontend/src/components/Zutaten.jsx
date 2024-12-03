// src/components/ZutatenDashboard.jsx

import React from 'react';
import './Zutaten.css';  // Importiere die CSS-Datei für das Styling

const data = [
  { name: 'Mais (425g)', total: 10, used: 2 },
  { name: 'Apfelmus (710g)', total: 1, used: 0 },
  { name: 'Thunfisch', total: 6, used: 2 },
  { name: 'Sushi Reis', total: 2, used: 1 },
  { name: 'Nori (Alge)', total: 2, used: 1 },
  { name: 'Öl', total: 4, used: 1 },
  { name: 'Mehl (1000g)', total: 5, used: 2 },
  { name: 'Mayonnaise (500g)', total: 5, used: 1 },
  { name: 'Nutella (750g)', total: 3, used: 1 },
  { name: 'Speisestärke (400g)', total: 3, used: 1 },
  { name: 'Zucker (1000g)', total: 5, used: 2 },
  { name: 'großes Sandwich', total: 7, used: 2 },
  { name: 'Margarine', total: 5, used: 2 },
  { name: 'Gouda Scheiben', total: 5, used: 2 },
  { name: 'Kochschinken', total: 5, used: 2 },
];

const ZutatenDashboard = () => {
  // Gesamtsumme aller "total"-Werte berechnen
  const totalSum = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="dashboard-container">
      <div className="card">
        <h2>Analytics</h2>
        <select className="dropdown">
          <option>Letzter Monat</option>
          <option>Alle Monate</option>
        </select>
        <ul className="analytics-list">
          {data.map((item, index) => (
            <li key={index}>
              <span className="item-name">{item.name}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill total"
                  style={{ width: `${(item.total / 10) * 100}%` }}
                ></div>
                <div
                  className="progress-fill used"
                  style={{ width: `${(item.used / item.total) * 100}%` }}
                ></div>
              </div>
              <div className="values">
                <span>{item.used} / {item.total}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="total">Total: {totalSum}</div>
      </div>
    </div>
  );
};

export default ZutatenDashboard;
