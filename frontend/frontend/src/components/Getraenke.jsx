import React from 'react';
import './Getraenke.css';

const Getraenke = () => {
  const data = [
    { name: 'Kaffe', total: 7, used: 5 },
    { name: 'Apfelschorle', total: 5, used: 5 },
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

  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <h2>Analytics</h2>
        <div className="dropdown">
          <span>Last Month</span>
          <span className="arrow">▼</span>
        </div>
      </div>

      <div className="analytics-table">
        <div className="table-header">
          <span>Name</span>
          <span>gesamt</span>
          <span>gebraucht</span>
        </div>
        {data.map((item, index) => (
          <div key={index} className="table-row">
            <span className="item-name">{item.name}</span>
            <div className="progress-bar">
              <div
                className="progress-used"
                style={{
                  width: `${(item.used / item.total) * 100}%`,
                }}
              >
                <span className="progress-text">{item.used}</span>
              </div>
            </div>
            <span>{item.total}</span>
          </div>
        ))}
      </div>

      <div className="analytics-footer">
        <span>Total</span>
        <span className="total-amount">$17,355</span>
      </div>
    </div>
  );
};

export default Getraenke;