import React, { useState } from 'react';
import styles from './Login.module.css';
import { loginUser } from '../apiService'; // Importiere die Login-Funktion

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Login-Funktion aus apiService aufrufen
      await loginUser(username, password);
      onLogin(); // Callback nach erfolgreichem Login
    } catch (error) {
      alert('Falsche E-Mail oder Passwort!');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Supotsu no Ochaya<br />Business Intelligence</h1>
        <h2 className={styles.subtitle}>Login</h2>
        <form className={styles.form} onSubmit={submit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className={styles.button}>Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
