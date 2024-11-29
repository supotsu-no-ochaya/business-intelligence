import React from 'react';
import Sidebar from './components/Sidebar'; // Sidebar importieren

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Willkommen zum Dashboard!</h1>
      </div>
    </div>
  );
}

export default App;
