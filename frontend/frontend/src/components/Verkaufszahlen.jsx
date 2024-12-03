import React from 'react';
import './Verkaufszahlen.css';

const Verkaufszahlen = () => {
  const speisen = [
    { name: 'Sandwich Käse Schinken', sales: 142 },
    { name: 'Nutella Crepe', sales: 96 },
    { name: 'Thun Onigiri', sales: 96 },
    { name: 'Hack Onigiri', sales: 85 },
  ];

  const getraenke = [
    { name: 'Cola', sales: 108 },
    { name: 'Kakao', sales: 92 },
    { name: 'Kaffee', sales: 62 },
  ];

  const maxSalesSpeisen = Math.max(...speisen.map(item => item.sales));
  const maxSalesGetraenke = Math.max(...getraenke.map(item => item.sales));

  const renderCategory = (data, maxSales, title) => (
    <div className="sales-card">
      <div className="sales-header">
        <h2>Verkaufsschlager</h2>
        <div className="filters">
          <div className="filter">Gesamter Zeitraum</div>
          <div className="filter">Top Produkte</div>
        </div>
      </div>

      <div className="sales-category">
        <h3>{title}</h3>
        {data.map((item, index) => (
          <div key={index} className="sales-row">
            <span className="item-name">{item.name}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(item.sales / maxSales) * 100}%`,
                }}
              >
                <span className="progress-text">{item.sales}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sales-footer">
        <span>Total</span>
        <span className="total-amount">6,158.04 €</span>
      </div>
    </div>
  );

  return (
    <div className="sales-dashboard">
      {renderCategory(speisen, maxSalesSpeisen, 'Speisen')}
      {renderCategory(getraenke, maxSalesGetraenke, 'Getränke')}
    </div>
  );
};

export default Verkaufszahlen;
