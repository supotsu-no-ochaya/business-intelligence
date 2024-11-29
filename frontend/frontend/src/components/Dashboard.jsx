import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="card">
        <h2>Analytics</h2>
        <select className="dropdown">
        <option>Letztes Event</option>
        <option>Alle Events</option>
        </select>
        <ul className="analytics-list">
          {/* Beispielhafte Liste */}
          {['Stairs', 'Footings', 'Electrical', 'Framing Material', 'Finish Labor', 'Hardware', 'Framing', 'Tile Installation', 'Roofing', 'Appliances Install', 'Insulation', 'Interior Painting'].map((item, index) => (
            <li key={index}>
              <span>{item}</span>
              <div className="progress-bar"><div className="progress-fill"></div></div>
            </li>
          ))}
        </ul>
        <div className="total">Total: $17,355</div>
      </div>

      {/* Zwei weitere Karten */}
      <div className="card">
        <h2>Analytics</h2>
        <select className="dropdown">
        <option>Letztes Event</option>
        <option>Alle Events</option>
        </select>
        {/* Wiederhole den Inhalt */}
        <ul className="analytics-list">
       {/* Beispielhafte Liste */}
       {['Stairs', 'Footings', 'Electrical', 'Framing Material', 'Finish Labor', 'Hardware', 'Framing', 'Tile Installation', 'Roofing', 'Appliances Install', 'Insulation', 'Interior Painting'].map((item, index) => (
            <li key={index}>
              <span>{item}</span>
              <div className="progress-bar"><div className="progress-fill"></div></div>
            </li>
          ))}
        </ul>
        <div className="total">Total: $17,355</div>
      </div>

      <div className="card">
        <h2>Analytics</h2>
        <select className="dropdown">
          <option>Letztes Event</option>
          <option>Alle Events</option>
        </select>
        {/* Wiederhole den Inhalt */}
        <ul className="analytics-list">
          {/* Beispielhafte Liste */}
          {['Stairs', 'Footings', 'Electrical', 'Framing Material', 'Finish Labor', 'Hardware', 'Framing', 'Tile Installation', 'Roofing', 'Appliances Install', 'Insulation', 'Interior Painting'].map((item, index) => (
            <li key={index}>
              <span>{item}</span>
              <div className="progress-bar"><div className="progress-fill"></div></div>
            </li>
          ))}
        </ul>
        <div className="total">Total: $17,355</div>
      </div>
    </div>
  );
};

export default Dashboard;
