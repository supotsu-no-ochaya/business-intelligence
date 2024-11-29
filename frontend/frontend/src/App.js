import React from 'react';
import Sidebar from './components/Sidebar'; // Sidebar importieren
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#1D1E2C',  minHeight: '100vh'}}>
      {/* Sidebar Container */}
      <aside className="app-sidebar">
        <Sidebar />
      </aside>

      <div className="mainboard">
        {/* Header Container */}
        <header className="app-header">
          <Header />
        </header>

        {/* Dashboard Content */}
        <div className="dashboard">
        <Dashboard/>
        </div>
      </div>
    </div>
  );
}
export default App;
