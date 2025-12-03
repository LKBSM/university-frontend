import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>University Department System</h1>
        </Link>
        <nav className="header-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/departments" className="nav-link">Manage Departments</Link>
            </li>
            <li className="nav-item">
              <Link to="/professors" className="nav-link">Manage Professors</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
