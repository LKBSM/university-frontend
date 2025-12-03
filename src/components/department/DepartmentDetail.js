import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { departmentApi } from '../../services/api';

function DepartmentDetail() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [department, setDepartment] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 fetchDepartment();
 }, [id]);

 const fetchDepartment = async () => {
 try {
 setLoading(true);
 const response = await departmentApi.getDepartmentWithProfessors(id);
 setDepartment(response.data);
 setError(null);
 } catch (err) {
 setError('Failed to fetch department details.');
 console.error('Error fetching department:', err);
 } finally {
 setLoading(false);
 }
 };

 const handleDelete = async () => {
 if (window.confirm('Are you sure you want to delete this department?')) {
 try {
 await departmentApi.delete(id);
 navigate('/departments');
 } catch (err) {
 alert('Failed to delete department. It may have professors assigned to it.');
 console.error('Error deleting department:', err);
 }
 }
 };

 if (loading) return <div className="loading">Loading department details...</div>;
 if (error) return <div className="error">{error}</div>;
 if (!department) return <div className="error">Department not found</div>;

 return (
 <div className="detail-container">
 <div className="page-header">
 <h1>{department.name}</h1>
 <div>
 <Link to={`/departments/${id}/edit`} className="btn btn-secondary">Edit</Link>
 <button c={handleDelete} className="btn btn-danger">Delete</button>
 <Link to="/departments" className="btn btn-primary">Back to List</Link>
 </div>
 </div>

 <div className="card" style={{ padding: '2rem' }}>
 <div className="detail-grid">
 <div className="detail-item">
 <label>Department Code</label>
 <p>{department.code}</p>
 </div>
 <div className="detail-item">
 <label>Department Name</label>
 <p>{department.name}</p>
 </div>
 <div className="detail-item">
 <label>Year Established</label>
 <p>{department.yearEstablished || 'N/A'}</p>
 </div>
 <div className="detail-item">
 <label>Number of Professors</label>
 <p>{department.professors?.length || 0}</p>
 </div>
 </div>
 </div>

 <div className="card" style={{ padding: '2rem', marginTop: '1.5rem' }}>
 <div className="professor-list">
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
 <h2>Professors in this Department</h2>
 <Link to={`/professors/new?departmentId=${id}`} className="btn btn-success">
 Add Professor to this Department
 </Link>
 </div>
 {department.professors && department.professors.length > 0 ? (
 department.professors.map((prof) => (
 <div key={prof.id} className="professor-card">
 <div className="professor-info">
 <h4>{prof.firstName} {prof.lastName}</h4>
 <p>{prof.title}</p>
 </div>
 <Link to={`/professors/${prof.id}`} className="btn btn-primary">View Details</Link>
 </div>
 ))
 ) : (
 <p>No professors assigned to this department yet.</p>
 )}
 </div>
 </div>
 </div>
 );
}

export default DepartmentDetail;
