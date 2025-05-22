import React from 'react';
import './App.css';
import SnakesAndLadders from './SnakesAndLadders';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      {/* Navbar for KAVIA branding */}
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <div>
              {/* Placeholder for navigation or extra controls */}
            </div>
          </div>
        </div>
      </nav>
      <main>
        {/* Main game container */}
        <SnakesAndLadders />
      </main>
    </div>
  );
}

export default App;