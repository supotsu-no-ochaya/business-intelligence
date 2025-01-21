import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../apiService'; // Importiere die Funktion
import './Header.css';

const TopBar = () => {
  const [username, setUsername] = useState(''); // Zustand für den Benutzernamen

  useEffect(() => {
    // Benutzername beim Laden der Komponente abrufen
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser(); // API-Aufruf
        setUsername(user.username); // Setze den Benutzernamen aus der API-Response
      } catch (error) {
        console.error("Fehler beim Abrufen des Benutzernamens:", error);
      }
    };

    fetchUser(); // Funktion ausführen
  }, []); // Leeres Array sorgt dafür, dass der Effekt nur einmal ausgeführt wird

  return (
    <div className="top-bar">
      {/* Dynamischer Benutzername */}
      <h1>Hallo, {username || 'Gast'}</h1>
    </div>
  );
};

export default TopBar;
