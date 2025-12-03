import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>University Department System</h3>
          <p>A full-stack application for managing university departments and professors</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/departments">Departments</a></li>
            <li><a href="/professors">Professors</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Technology Stack</h4>
          <ul className="footer-tech">
            <li>Spring Boot Backend</li>
            <li>React Frontend</li>
            <li>PostgreSQL Database</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Course Information</h4>
          <p>420-N34_LA Java Web Programming</p>
          <p>Champlain College Saint-Lambert</p>
          <p>Fall 2025</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} University Department System. Created for academic purposes.</p>
      </div>
    </footer>
  );
}

export default Footer;
