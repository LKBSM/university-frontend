import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About University Department System</h1>
        <p className="subtitle">A Modern Full-Stack Web Application</p>
      </div>

      <div className="about-section">
        <h2>Project Overview</h2>
        <p>
          The University Department System is a comprehensive full-stack application designed to manage university departments
          and their faculty members. This system demonstrates modern web development practices using industry-standard technologies
          and architectural patterns.
        </p>
      </div>

      <div className="about-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Department Management</h3>
            <ul>
              <li>Create, read, update, and delete departments</li>
              <li>View department details with assigned professors</li>
              <li>Search and filter departments</li>
              <li>Paginated listing for better performance</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>Professor Management</h3>
            <ul>
              <li>Complete CRUD operations for professors</li>
              <li>Associate professors with departments</li>
              <li>Advanced search functionality</li>
              <li>Real-time validation</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>User Interface</h3>
            <ul>
              <li>Modern, responsive design</li>
              <li>Modal-based forms for better UX</li>
              <li>Intuitive navigation</li>
              <li>Error handling and user feedback</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>Backend Architecture</h3>
            <ul>
              <li>RESTful API design</li>
              <li>3-layer architecture</li>
              <li>Database persistence</li>
              <li>Proper HTTP status codes</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Technology Stack</h2>
        <div className="tech-stack">
          <div className="tech-category">
            <h3>Backend</h3>
            <ul>
              <li><strong>Java 17</strong> - Programming language</li>
              <li><strong>Spring Boot 3.x</strong> - Application framework</li>
              <li><strong>Spring Data JPA</strong> - Data persistence</li>
              <li><strong>PostgreSQL</strong> - Production database</li>
              <li><strong>H2 Database</strong> - Development database</li>
              <li><strong>Hibernate Validator</strong> - Bean validation</li>
              <li><strong>Lombok</strong> - Boilerplate reduction</li>
              <li><strong>Gradle</strong> - Build tool</li>
            </ul>
          </div>
          <div className="tech-category">
            <h3>Frontend</h3>
            <ul>
              <li><strong>React 18</strong> - UI library</li>
              <li><strong>React Router DOM v6</strong> - Navigation</li>
              <li><strong>Axios</strong> - HTTP client</li>
              <li><strong>CSS3</strong> - Styling</li>
              <li><strong>JavaScript ES6+</strong> - Programming language</li>
            </ul>
          </div>
          <div className="tech-category">
            <h3>Deployment</h3>
            <ul>
              <li><strong>Neon.tech</strong> - PostgreSQL hosting</li>
              <li><strong>Render.com</strong> - Backend hosting</li>
              <li><strong>Netlify.com</strong> - Frontend hosting</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Architecture</h2>
        <p>This application follows a clean 3-layer architecture pattern:</p>
        <div className="architecture-diagram">
          <div className="arch-layer">
            <h4>Presentation Layer</h4>
            <p>REST Controllers handling HTTP requests and responses</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <h4>Business Logic Layer</h4>
            <p>Services implementing business rules and validations</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <h4>Data Access Layer</h4>
            <p>Repositories managing database operations</p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Course Information</h2>
        <div className="course-info">
          <div className="info-item">
            <strong>Course:</strong> 420-N34_LA Java Web Programming
          </div>
          <div className="info-item">
            <strong>Institution:</strong> Champlain College Saint-Lambert
          </div>
          <div className="info-item">
            <strong>Professor:</strong> Haikel Hichri
          </div>
          <div className="info-item">
            <strong>Term:</strong> Fall 2025
          </div>
          <div className="info-item">
            <strong>Milestone:</strong> 2 (Full-Stack Integration)
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Team Members</h2>
        <div className="team-members">
          <div className="team-member">
            <h3>Luca Rarau</h3>
          </div>
          <div className="team-member">
            <h3>Loukmane Bessam</h3>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Project Highlights</h2>
        <ul className="highlights">
          <li>✓ Complete CRUD operations for both resources</li>
          <li>✓ One-to-many relationship (Department → Professors)</li>
          <li>✓ Comprehensive validation and error handling</li>
          <li>✓ Pagination for improved performance</li>
          <li>✓ Search functionality across all fields</li>
          <li>✓ Modal-based forms for better UX</li>
          <li>✓ Responsive design for all screen sizes</li>
          <li>✓ RESTful API with proper HTTP codes</li>
          <li>✓ Database seeding with 10+ departments and 50+ professors</li>
          <li>✓ Cloud deployment (Database, Backend, Frontend)</li>
        </ul>
      </div>

      <div className="about-footer">
        <p>
          This project was created for academic purposes as part of the Java Web Programming course
          at Champlain College Saint-Lambert.
        </p>
      </div>
    </div>
  );
}

export default About;
