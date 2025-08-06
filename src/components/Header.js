import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-icon">⚽</div>
        <div>
          <h1 className="header-title">FutScore</h1>
          <p className="header-subtitle">
            Transforme suas partidas em cards memoráveis
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header; 