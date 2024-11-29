import React from 'react';
import Sidebar from './components/Sidebar'; // Sidebar importieren
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#1D1E2C',  minHeight: '100vh'}}>
      <Sidebar />
      <Dashboard/>
    </div>
  );
}

export default App;
