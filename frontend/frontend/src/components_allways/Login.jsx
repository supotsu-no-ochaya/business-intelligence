import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Überprüfe die Zugangsdaten (Beispiel)
    if (email === 'admin@example.com' && password === 'password123') {
      onLogin();  // Loggt den Benutzer ein
    } else {
      alert('Falsche E-Mail oder Passwort!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Supotsu no Ochaya<br />Business Intelligence</h1>
        <h2 className={styles.subtitle}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="username@gmail.com" 
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
