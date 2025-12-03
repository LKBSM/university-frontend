import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { departmentApi } from '../../services/api';

function DepartmentForm() {
 const { id } = useParams();
 const navigate = useNavigate();
 const isEditMode = Boolean(id);

 const [formData, setFormData] = useState({
 name: '',
 code: '',
 yearEstablished: ''
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 useEffect(() => {
 if (isEditMode) {
 fetchDepartment();
 }
 }, [id]);

 const fetchDepartment = async () => {
 try {
 setLoading(true);
 const response = await departmentApi.getById(id);
 setFormData({
 name: response.data.name,
 code: response.data.code,
 yearEstablished: response.data.yearEstablished || ''
 });
 } catch (err) {
 setError('Failed to fetch department details.');
 console.error('Error fetching department:', err);
 } finally {
 setLoading(false);
 }
 };

 const handleChange = (e) => {
 const { name, value } = e.target;
 setFormData(prev => ({
 ...prev,
 [name]: value
 }));
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError(null);

 // Validation
 if (!formData.name || !formData.code) {
 setError('Name and Code are required fields.');
 return;
 }

 try {
 setLoading(true);
 const data = {
 name: formData.name,
 code: formData.code,
 yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : null
 };

 if (isEditMode) {
 await departmentApi.update(id, data);
 } else {
 await departmentApi.create(data);
 }

 navigate('/departments');
 } catch (err) {
 if (err.response && err.response.data) {
 setError(err.response.data.message || 'Failed to save department.');
 } else {
 setError('Failed to save department. Please try again.');
 }
 console.error('Error saving department:', err);
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="form-container">
 <div className="page-header">
 <h1>{isEditMode ? 'Edit Department' : 'Create New Department'}</h1>
 </div>

 <div className="card" style={{ padding: '2rem' }}>
 {error && <div className="error">{error}</div>}

 <form s={handleSubmit}>
 <div className="form-group">
 <label htmlFor="name">Department Name *</label>
 <input
 type="text"
 id="name"
 name="name"
 value={formData.name}
 c={handleChange}
 required
 placeholder="e.g., Computer Science"
 />
 </div>

 <div className="form-group">
 <label htmlFor="code">Department Code *</label>
 <input
 type="text"
 id="code"
 name="code"
 value={formData.code}
 c={handleChange}
 required
 placeholder="e.g., CS"
 maxLength="10"
 />
 </div>

 <div className="form-group">
 <label htmlFor="yearEstablished">Year Established</label>
 <input
 type="number"
 id="yearEstablished"
 name="yearEstablished"
 value={formData.yearEstablished}
 c={handleChange}
 placeholder="e.g., 1995"
 min="1800"
 max={new Date().getFullYear()}
 />
 </div>

 <div>
 <button type="submit" className="btn btn-success" disabled={loading}>
 {loading ? 'Saving...' : (isEditMode ? 'Update Department' : 'Create Department')}
 </button>
 <Link to="/departments" className="btn btn-secondary">Cancel</Link>
 </div>
 </form>
 </div>
 </div>
 );
}

export default DepartmentForm;
