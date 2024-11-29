import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <div className="app">
      {/* Sidebar Container */}
      <aside className="app-sidebar">
        <Sidebar />
      </aside>

      
      {/* Header Container */}
      <header className="app-header">
        <Header />
      </header>

      {/* Dashboard Content */}
      <div className="dashboard">
        <h1>Willkommen zum Dashboard!</h1>
      </div>
    </div>
  );
}
export default App;
