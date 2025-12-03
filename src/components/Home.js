import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to University Department System</h1>
      <p>Manage departments and professors efficiently</p>

      <div className="home-cards">
        <div className="home-card">
          <h2>Departments</h2>
          <p>View, create, update, and manage all university departments</p>
          <Link to="/departments" className="btn btn-primary">View Departments</Link>
        </div>

        <div className="home-card">
          <h2>Professors</h2>
          <p>Manage professor information and department assignments</p>
          <Link to="/professors" className="btn btn-primary">View Professors</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
