import React, { useState } from 'react';
import './Settings.css';
import { changePassword, addUser, uploadFile } from '../apiService'; // Importiere die API-Funktionen

const Settings = () => {
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState({ username: '', email: '', group: '' });
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/json') {
      setFile(uploadedFile);
      setErrorMessage('');
    } else {
      setFile(null);
      setErrorMessage('Bitte laden Sie nur eine JSON-Datei hoch.');
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      await changePassword(password);
      alert('Passwort geändert!');
      setPassword('');
    } catch (error) {
      setErrorMessage('Fehler beim Ändern des Passworts.');
      console.error(error);
    }
  };

  const handleNewUserSubmit = async () => {
    try {
      await addUser(newUser);
      alert(`Neuer Benutzer hinzugefügt: ${newUser.username}`);
      setNewUser({ username: '', email: '', group: '' });
    } catch (error) {
      setErrorMessage('Fehler beim Hinzufügen des Benutzers.');
      console.error(error);
    }
  };

  const handleFileSubmit = async () => {
    if (!file) return;

    try {
      await uploadFile(file);
      setSuccessMessage('Datei erfolgreich hochgeladen!');
      setFile(null);
    } catch (error) {
      setErrorMessage('Fehler beim Hochladen der Datei.');
      console.error(error);
    }
  };

  return (
    <div className="settings-container">
      <h2>Einstellungen</h2>

      <div className="settings-grid">
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
            <label htmlFor="group">Gruppe</label>
            <select
              id="group"
              name="group"
              value={newUser.group}
              onChange={handleNewUserChange}
            >
              <option value="" disabled>
                Gruppe auswählen
              </option>
              <option value="admin">Admin</option>
              <option value="editor">Kassenwart</option>
              <option value="viewer">Küchenleitung</option>
            </select>
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
          {successMessage && <p className="success-message">{successMessage}</p>}
          {file && <p>Ausgewählte Datei: {file.name}</p>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
