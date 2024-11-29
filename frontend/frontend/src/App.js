import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Verbrauch from './components/Verbrauch';
/*import Zutaten from './components/Zutaten';
import Getraenke from './components/Getraenke';
import Verkaufszahlen from './components/Verkaufszahlen';*/
import './App.css'; // Importiere das CSS-Stylesheet

function App() {
  // Zustand für die aktuelle Ansicht
  const [currentView, setCurrentView] = useState('dashboard');

  // Funktion zum Wechseln der Ansicht
  const navigate = (view) => {
    setCurrentView(view);
  };

  // Komponente basierend auf der aktuellen Ansicht rendern
  let content;
  switch (currentView) {
    case 'dashboard':
      content = <Dashboard />;
      break;
    case 'verbrauch':
      content = <Verbrauch />;
      break;/*
    case 'zutaten':
      content = <Zutaten />;
      break;
    case 'getraenke':
      content = <Getraenke />;
      break;
    case 'verkaufszahlen':
      content = <Verkaufszahlen />;
      break;*/
    default:
      content = <Dashboard />;
  }

  return (
    <div className="app">
      {/* Sidebar Container */}
      <aside className="app-sidebar">
        <Sidebar navigate={navigate} />
      </aside>

      {/* Main Content Container */}
      <main className="mainboard">
        <header className="app-header">
          <Header />
        </header>

        {/* Der Hauptinhalt, basierend auf der aktuellen Ansicht */}
        {content}
      </main>
    </div>
  );
}

export default App;
