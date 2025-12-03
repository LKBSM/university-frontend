import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Department components
import DepartmentList from './components/department/DepartmentList';
import DepartmentDetail from './components/department/DepartmentDetail';
import DepartmentForm from './components/department/DepartmentForm';

// Professor components
import ProfessorList from './components/professor/ProfessorList';
import ProfessorDetail from './components/professor/ProfessorDetail';
import ProfessorForm from './components/professor/ProfessorForm';

// Other components
import Home from './components/Home';
import About from './components/About';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* Department routes */}
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/departments/new" element={<DepartmentForm />} />
            <Route path="/departments/:id" element={<DepartmentDetail />} />
            <Route path="/departments/:id/edit" element={<DepartmentForm />} />

            {/* Professor routes */}
            <Route path="/professors" element={<ProfessorList />} />
            <Route path="/professors/new" element={<ProfessorForm />} />
            <Route path="/professors/:id" element={<ProfessorDetail />} />
            <Route path="/professors/:id/edit" element={<ProfessorForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;