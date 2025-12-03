import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { professorApi, departmentApi } from '../../services/api';

function ProfessorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    departmentId: ''
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
    if (isEditMode) {
      fetchProfessor();
    } else {
      // Check if departmentId is provided in query params
      const deptId = searchParams.get('departmentId');
      if (deptId) {
        setFormData(prev => ({
          ...prev,
          departmentId: deptId
        }));
      }
    }
  }, [id, searchParams]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll();
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchProfessor = async () => {
    try {
      setLoading(true);
      const response = await professorApi.getById(id);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        title: response.data.title || '',
        departmentId: response.data.departmentId || ''
      });
    } catch (err) {
      setError('Failed to fetch professor details.');
      console.error('Error fetching professor:', err);
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.departmentId) {
      setError('First Name, Last Name, Email, and Department are required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        title: formData.title || null,
        departmentId: parseInt(formData.departmentId)
      };

      if (isEditMode) {
        await professorApi.update(id, data);
      } else {
        await professorApi.create(data);
      }

      navigate('/professors');
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.status === 409) {
          setError('A professor with this email already exists.');
        } else if (err.response.data.validationErrors) {
          const errors = Object.values(err.response.data.validationErrors).join(', ');
          setError(errors);
        } else {
          setError(err.response.data.message || 'Failed to save professor.');
        }
      } else {
        setError('Failed to save professor. Please try again.');
      }
      console.error('Error saving professor:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDepartmentName = () => {
    const dept = departments.find(d => d.id === parseInt(formData.departmentId));
    return dept ? ` for ${dept.name}` : '';
  };

  return (
    <div>
      <div className="page-header">
        <h1>
          {isEditMode ? 'Edit Professor' : 'Create New Professor'}
          {!isEditMode && formData.departmentId && getSelectedDepartmentName()}
        </h1>
      </div>

      <div className="card">
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="e.g., John"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="e.g., Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g., john.smith@uni.ca"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Full Professor, Assistant Professor"
            />
          </div>

          <div className="form-group">
            <label htmlFor="departmentId">Department *</label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.code} - {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update Professor' : 'Create Professor')}
            </button>
            <Link to="/professors" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfessorForm;
