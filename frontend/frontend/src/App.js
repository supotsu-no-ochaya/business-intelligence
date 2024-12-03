import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Verbrauch from './components/Verbrauch';
import Zutaten from './components/Zutaten'; // Beide Versionen importiert
import Getraenke from './components/Getraenke';
import Verkaufszahlen from './components/Verkaufszahlen';
import './App.css'; // Importiere das CSS-Stylesheet

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const navigate = (view) => {
    setCurrentView(view);
  };

  let content;
  switch (currentView) {
    case 'dashboard':
      content = <Dashboard />;
      break;
    case 'verbrauch':
      content = <Verbrauch />;
      break;
    case 'zutaten':
      content = <Zutaten />;  // Stellen sicher, dass diese Komponente gerendert wird
      break;
    case 'getraenke':
      content = <Getraenke />;
      break;
    case 'verkaufszahlen':
      content = <Verkaufszahlen />;
      break;
    default:
      content = <Dashboard />;
  }

  return (
    <div className="app">
      <aside className="app-sidebar">
        <Sidebar navigate={navigate} />
      </aside>

      <main className="mainboard">
        <header className="app-header">
          <Header />
        </header>

        {content}
      </main>
    </div>
  );
}

export default App;