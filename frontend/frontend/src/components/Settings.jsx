import React, { useState } from 'react';
import './Settings.css';
import { changePassword, uploadFile } from '../apiService'; // Importiere die API-Funktionen

const Settings = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordWarn, setPasswordWarn] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessageFull, setErrorMessageFull] = useState('');
  const [showFullErrorMessage, setShowFullErrorMessage] = useState(false)

  const handlePasswordChange = (e) => { 
    if(e.target.id == 'password') {
      setPassword(e.target.value);
    }
    if(e.target.id == 'password_confirm') {
      setPasswordConfirm(e.target.value)
    }
  }

  const pw_checks = {
    length: password.length >= 8,
    numeric: /\d/.test(password),
    uppercaseLowercase: /[a-z]/.test(password) && /[A-Z]/.test(password),
  };

  function isPasswordValid(password) {
    for (const key in pw_checks) {
      if (Object.prototype.hasOwnProperty.call(pw_checks, key)) {
        const valid = pw_checks[key];
        if(!valid) return false;
      }
    }
    return true;
  }

  function handleKeyPress(event) {
    const capsLockOn = event.getModifierState('CapsLock');

    console.log(capsLockOn)
    // Display a warning message if Caps Lock is on
    if (capsLockOn) {
      setPasswordWarn('! Caps Lock is on');
    } else {
      setPasswordWarn('');
    }
  }

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
    setPasswordError('');
    setPasswordSuccess('')
    if(password != passwordConfirm)  {
      setPasswordError('Passwörter stimmen nicht überein');
      return
    }

    if(!isPasswordValid()) return;

    try {
      await changePassword(password);
      setPasswordSuccess('Passwort erfolgreich geändert')
      setTimeout(() => {
        setPasswordSuccess('')
      }, 5000);
    } catch (error) {
      setPasswordError('Fehler beim Ändern des Passworts.');
      console.error(error);
    }
  };

  const handleFileSubmit = async () => {
    setErrorMessageFull('')
    if (!file) return;

    try {
      await uploadFile(file);
      setSuccessMessage('Datei erfolgreich hochgeladen!');
      setFile(null);
    } catch (error) {
      setErrorMessage('Fehler beim Hochladen der Datei.');
      setErrorMessageFull(JSON.stringify(error.response.data, undefined, 2))
      console.error(error);
    }
  };

  const toggleShowPassword = (e) => {
    var x = document.querySelectorAll('#password, #password_confirm');
    if(e.target.checked) {
      x.forEach(elem => elem.type = 'text')
    } else {
      x.forEach(elem => elem.type = 'password')
    }
  }

  return (
    <div className="settings-container">
      <h2>Einstellungen</h2>

      <div className="settings-grid">
        {/* Passwort ändern */}
        <div className="settings-section">
          <h3>Passwort ändern</h3>
          <div className="form-group">
            <label htmlFor="password">Neues Passwort</label>
            <div className='password1'>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Neues Passwort eingeben"
                onKeyUp={handleKeyPress}
              />
              <ul className='password-requirements'>
                <li style={{ color: pw_checks.length ? "green" : "red" }}>Passwort muss mindestens 8 Zeichen lang sein</li>
                <li style={{ color: pw_checks.numeric ? "green" : "red" }}>Passwort muss mindestens eine Ziffer enthalten</li>
                <li style={{ color: pw_checks.uppercaseLowercase ? "green" : "red" }}>Passwort muss mindestens einen Groß- und Kleinbuchstaben enthalten</li>
              </ul>
            </div>
            <label htmlFor="password">Passwort bestätigen</label>
            <input
              type="password"
              id="password_confirm"
              value={passwordConfirm}
              onChange={handlePasswordChange}
              placeholder="Passwort wiederholen"
              onKeyUp={handleKeyPress}
            />
            <div className='passwordWarn'>{passwordWarn}</div>
            <div><input type="checkbox" onClick={toggleShowPassword}/>Passwort anzeigen</div>
            <button onClick={handlePasswordSubmit}>Passwort ändern</button>
            <div className='error-message'>{passwordError}</div>
            <div className='success-message'>{passwordSuccess}</div>
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
          {errorMessage && <div><p className="error-message">{errorMessage} <span className="show-error-message" onClick={() => setShowFullErrorMessage(true)} type="button">Fehler Anzeigen</span></p></div>}
          {errorMessageFull && showFullErrorMessage && <pre className="file-error-message-container">{errorMessageFull}</pre>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {file && <p>Ausgewählte Datei: {file.name}</p>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
