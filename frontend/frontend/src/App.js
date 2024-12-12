import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components_allways/Login';
import Sidebar from './components/Sidebar';
import Header from './components_allways/Header';
import Dashboard from './components/Dashboard';
// import Verbrauch from './components/Verbrauch';
// import Zutaten from './components/Zutaten';
// import Getraenke from './components/Getraenke';
import Verkaufszahlen from './components/Verkaufszahlen';
import './App.css'; // Importiere das CSS-Stylesheet
import Settings from './components/Settings';

function App() {
  // Zustand für den Login-Status
  const [loggedIn, setLoggedIn] = useState(false);

  // Zustand für die aktuelle Ansicht
  const [currentView, setCurrentView] = useState('dashboard');

  // Funktion zum Wechseln der Ansicht
  const navigate = (view) => {
    setCurrentView(view);
  };

  // Handler für den Login (z. B. nach erfolgreicher Authentifizierung)
  const handleLogin = () => {
    setLoggedIn(true); // Setzt den Login-Status auf 'true'
  };

  return (
    <BrowserRouter>
      <div className="app">
        {!loggedIn ? (
          <Routes>
            {/* Route für Login */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {/* Weiterleitung zur Login-Seite */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
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
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/verkaufszahlen" element={<Verkaufszahlen />} />
                <Route path="/settings" element={<Settings />} />
                {/* Standardroute */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
