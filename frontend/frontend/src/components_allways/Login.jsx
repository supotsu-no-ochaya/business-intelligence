import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');     
  const [password, setPassword] = useState('');  
   
  // Create the submit method.
  const submit = async e => {          
    e.preventDefault();          
    const user = {
             username: username,
             password: password
            };          
    // Create the POST requuest
    try {
      const {data} = await                                                                            
                        axios.post('http://localhost:8000/api/auth/login/',
                        user ,{headers: 
                      {'Content-Type': 'application/json'}},{withCredentials: true});
      localStorage.clear();         
      localStorage.setItem('access_token', data.access);         
      localStorage.setItem('refresh_token', data.refresh);         
      axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;   
      onLogin();
      //window.location.href = '/'
    } catch (error) {
      alert('Falsche E-Mail oder Passwort!');
      console.error('Error fetching total earnings:', error);
    }   
            
  }

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
