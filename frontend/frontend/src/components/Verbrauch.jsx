import React from 'react';
import './Verbrauch.css'; // Importiere das CSS-Stylesheet


  const data = [
    { name: 'Kaffee Filter', total: 7, used: 5 },
    { name: 'Abwaschhandschuhe', total: 5, used: 5 },
    { name: 'Müllbeutel (60L)', total: 8, used: 6 },
    { name: 'Messer (Holz)', total: 2, used: 1 },
    { name: 'Gabel (Holz)', total: 2, used: 1 },
    { name: 'Papier Teller', total: 5, used: 4 },
    { name: 'Servietten (klein/weiß)', total: 7, used: 5 },
    { name: 'Servietten (groß)', total: 2, used: 2 },
    { name: 'Mochi Formen', total: 3, used: 2 },
    { name: 'Flächendesinfektion', total: 10, used: 3 },
    { name: 'Spülmittel', total: 7, used: 5 },
  ];

  const VerbrauchDashboard = () => {
    // Gesamtsumme aller "total"-Werte berechnen
    const totalSum = data.reduce((sum, item) => sum + item.total, 0);
  
    return (
      <div className="Verbrauch-dashboard-container">
        <div className="Verbrauch-card">
          <h2>Analytics</h2>
          <select className="Verbrauch-dropdown">
            <option>Letzter Monat</option>
            <option>Alle Monate</option>
          </select>
          <ul className="Verbrauch-analytics-list">
            {data.map((item, index) => (
              <li key={index}>
                <span className="Verbrauch-item-name">{item.name}</span>
                <div className="Verbrauch-progress-bar">
                  {/* Fortschritt Total */}
                  <div
                    className="Verbrauch-progress-fill-total"
                    style={{ width: '100%' }} // Total entspricht immer 100%
                  ></div>
                  {/* Fortschritt Used */}
                  <div
                    className="Verbrauch-progress-fill-used"
                    style={{
                      width: `${(item.used / item.total) * 100}%`, // Used im Verhältnis zu Total
                    }}
                  ></div>
                </div>
                <div className="Verbrauch-values">
                  {item.used} / {item.total}
                </div>
              </li>
            ))}
          </ul>
          <div className="Verbrauch-total">Total: {totalSum}</div>
        </div>
      </div>
    );
  };
  
  export default VerbrauchDashboard;
