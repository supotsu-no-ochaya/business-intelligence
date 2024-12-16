import React, { useState } from 'react';
import Login from './components_allways/Login';
import Sidebar from './components/Sidebar';
import Header from './components_allways/Header';
import Dashboard from './components/Dashboard';
import Ausgaben from './components/Ausgaben';
 //import Verbrauch from './components/Verbrauch';
// import Zutaten from './components/Zutaten';
import Getraenke from './components/Getraenke';
import Verkaufszahlen from './components/Verkaufszahlen';
import './App.css'; // Importiere das CSS-Stylesheet
import Settings from './components/Settings';

function App() {
  // Zustand für die aktuelle Ansicht
  const [currentView, setCurrentView] = useState('dashboard');

  // Zustand für den Login-Status
  const [loggedIn, setLoggedIn] = useState(false);

  // Funktion zum Wechseln der Ansicht
  const navigate = (view) => {
    setCurrentView(view);
  };

  // Handler für den Login (z. B. nach erfolgreicher Authentifizierung)
  const handleLogin = () => {
    setLoggedIn(true); // Setzt den Login-Status auf 'true'
  };

  // Komponente basierend auf der aktuellen Ansicht rendern
  let content;
  switch (currentView) {
   /* case 'dashboard':
      content = <Dashboard />;
      break;
    case 'verbrauch':
      content = <Verbrauch />;
      break;
    case 'zutaten':
      content = <Zutaten />;
      break;*/
    case 'getraenke':
      content = <Getraenke />;
      break; 
    case 'ausgaben':
      content = <Ausgaben />;
      break;
    case 'verkaufszahlen':
      content = <Verkaufszahlen />;
      break;
    case 'settings':
      content = <Settings />;
      break;
    default:
      content = <Verkaufszahlen />;
  }

  return (
    <div className="app">
      {!loggedIn ? (
        <Login onLogin={handleLogin} />  
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default App;
