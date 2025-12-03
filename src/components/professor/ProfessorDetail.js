import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { professorApi } from '../../services/api';

function ProfessorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfessor();
  }, [id]);

  const fetchProfessor = async () => {
    try {
      setLoading(true);
      const response = await professorApi.getById(id);
      setProfessor(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch professor details.');
      console.error('Error fetching professor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this professor?')) {
      try {
        await professorApi.delete(id);
        navigate('/professors');
      } catch (err) {
        alert('Failed to delete professor. Please try again.');
        console.error('Error deleting professor:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading professor details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!professor) return <div className="error">Professor not found</div>;

  return (
    <div>
      <div className="page-header">
        <h1>{professor.firstName} {professor.lastName}</h1>
        <div>
          <Link to={`/professors/${id}/edit`} className="btn btn-secondary">Edit</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          <Link to="/professors" className="btn btn-primary">Back to List</Link>
        </div>
      </div>

      <div className="card">
        <div className="detail-grid">
          <div className="detail-item">
            <label>First Name</label>
            <p>{professor.firstName}</p>
          </div>
          <div className="detail-item">
            <label>Last Name</label>
            <p>{professor.lastName}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{professor.email}</p>
          </div>
          <div className="detail-item">
            <label>Title</label>
            <p>{professor.title || 'N/A'}</p>
          </div>
          {professor.department && (
            <div className="detail-item">
              <label>Department</label>
              <p>
                <Link to={`/departments/${professor.department.id}`}>
                  {professor.department.code} - {professor.department.name}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessorDetail;
