import React, { useState, useContext } from 'react';
import Login from './components_allways/Login';
import Sidebar from './components/Sidebar';
import Header from './components_allways/Header';
//import Dashboard from './components/Dashboard';
// import Zutaten from './components/Zutaten';
import IngredientUsage from './components/IngredientUsage';
import Lager from './components/Lager';
import Verkaufszahlen from './components/Verkaufszahlen';
import Transaktionen from './components/Transkationen';
import Profile from './components/Profile'
import './App.css'; // Importiere das CSS-Stylesheet
import Settings from './components/Settings';
import { AuthContext } from "./AuthContext";

function App() {
  // Zustand für die aktuelle Ansicht
  const [currentView, setCurrentView] = useState('dashboard');

  // Zustand für den Login-Status
  const { loggedIn, setLoggedIn } = useContext(AuthContext);

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
    case 'zutaten':
      content = <Zutaten />;
      break;*/
      case 'verbrauch':
      content = <IngredientUsage />;
      break;
    case 'profile':
      content = <Profile />
      break;
    case 'lager':
      content = <Lager />;
      break; 
    /*case 'ausgaben':
      content = <Ausgaben />;
      break;
    case 'einnahmen':
      content = <Einnahmen />;
      break;*/
    case 'verkaufszahlen':
      content = <Verkaufszahlen />;
      break;
    case 'transaktionen':
      content = <Transaktionen />;
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
