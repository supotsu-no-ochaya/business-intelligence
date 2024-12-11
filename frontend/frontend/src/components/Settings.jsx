import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/json') {
      setFile(uploadedFile);
      setErrorMessage(''); // Fehler zurücksetzen, falls vorher ein Fehler aufgetreten ist
    } else {
      setFile(null);
      setErrorMessage('Bitte laden Sie nur eine JSON-Datei hoch.');
    }
  };

  const handlePasswordSubmit = () => {
    alert('Passwort geändert!');
    setPassword('');
  };

  const handleNewUserSubmit = () => {
    alert(`Neuer Benutzer hinzugefügt: ${newUser.username}`);
    setNewUser({ username: '', email: '' });
  };

  const handleFileSubmit = () => {
    if (file) {
      alert(`Datei hochgeladen: ${file.name}`);
      setFile(null);
    }
  };

  return (
    <div className="settings-container">
      <h2>Einstellungen</h2>

      {/* Passwort ändern */}
      <div className="settings-section">
        <h3>Passwort ändern</h3>
        <div className="form-group">
          <label htmlFor="password">Neues Passwort</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Neues Passwort eingeben"
          />
          <button onClick={handlePasswordSubmit}>Passwort ändern</button>
        </div>
      </div>

      {/* Benutzer hinzufügen */}
      <div className="settings-section">
        <h3>Benutzer hinzufügen</h3>
        <div className="form-group">
          <label htmlFor="username">Benutzername</label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
            onChange={handleNewUserChange}
            placeholder="Benutzername eingeben"
          />
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={newUser.email}
            onChange={handleNewUserChange}
            placeholder="E-Mail eingeben"
          />
          <button onClick={handleNewUserSubmit}>Benutzer hinzufügen</button>
        </div>
      </div>

      {/* Datei hochladen */}
      <div className="settings-section">
        <h3>Datei hochladen</h3>
        <div className="form-group">
          <input type="file" accept=".json" onChange={handleFileUpload} />
          <button onClick={handleFileSubmit} disabled={!file}>
            Datei hochladen
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {file && <p>Ausgewählte Datei: {file.name}</p>}
      </div>
    </div>
  );
};

export default Settings;
