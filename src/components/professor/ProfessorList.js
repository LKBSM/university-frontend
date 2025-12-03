import React, { useState, useEffect } from 'react';
import { professorApi, departmentApi } from '../../services/api';
import Modal from '../common/Modal';
import './ProfessorList.css';

function ProfessorList() {
  const [professors, setProfessors] = useState([]);
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    departmentId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfessors();
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Filter professors based on search term
    const filtered = professors.filter(prof =>
      prof.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prof.title && prof.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prof.department && prof.department.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProfessors(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, professors]);

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const response = await professorApi.getAll();
      setProfessors(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch professors. Please try again.');
      console.error('Error fetching professors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll();
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredProfessors.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredProfessors.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.departmentId) {
      errors.departmentId = 'Department is required';
    }
    return errors;
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      departmentId: ''
    });
    setFormErrors({});
  };

  // Add Modal handlers
  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await professorApi.create(formData);
      await fetchProfessors();
      closeAddModal();
    } catch (err) {
      setError('Failed to create professor. Please try again.');
      console.error('Error creating professor:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Modal handlers
  const openEditModal = (prof) => {
    setSelectedProfessor(prof);
    setFormData({
      firstName: prof.firstName,
      lastName: prof.lastName,
      email: prof.email,
      title: prof.title || '',
      departmentId: prof.department ? prof.department.id : ''
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProfessor(null);
    resetForm();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await professorApi.update(selectedProfessor.id, formData);
      await fetchProfessors();
      closeEditModal();
    } catch (err) {
      setError('Failed to update professor. Please try again.');
      console.error('Error updating professor:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Modal handlers
  const openDeleteModal = (prof) => {
    setSelectedProfessor(prof);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProfessor(null);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await professorApi.delete(selectedProfessor.id);
      await fetchProfessors();
      closeDeleteModal();
    } catch (err) {
      setError('Failed to delete professor. Please try again.');
      console.error('Error deleting professor:', err);
      closeDeleteModal();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading professors...</div>;

  return (
    <div className="professor-list-container">
      <div className="page-header">
        <h1>Manage Professors</h1>
        <button onClick={openAddModal} className="btn btn-primary">
          Add New Professor
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, email, title, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="clear-search">
            Clear
          </button>
        )}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Title</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((prof) => (
                <tr key={prof.id}>
                  <td>{prof.firstName} {prof.lastName}</td>
                  <td>{prof.email}</td>
                  <td>{prof.title || 'N/A'}</td>
                  <td>{prof.department ? prof.department.code : 'N/A'}</td>
                  <td className="action-buttons">
                    <button onClick={() => openEditModal(prof)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => openDeleteModal(prof)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  {searchTerm ? 'No professors found matching your search.' : 'No professors available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredProfessors.length > recordsPerPage && (
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="btn btn-pagination"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages} ({filteredProfessors.length} total)
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="btn btn-pagination"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Add New Professor">
        <form onSubmit={handleAdd} className="professor-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={formErrors.firstName ? 'error' : ''}
            />
            {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={formErrors.lastName ? 'error' : ''}
            />
            {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Full Professor, Associate Professor"
            />
          </div>

          <div className="form-group">
            <label htmlFor="departmentId">Department *</label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              className={formErrors.departmentId ? 'error' : ''}
            >
              <option value="">Select a department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {formErrors.departmentId && <span className="error-text">{formErrors.departmentId}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={closeAddModal} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Professor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Professor">
        <form onSubmit={handleEdit} className="professor-form">
          <div className="form-group">
            <label htmlFor="edit-firstName">First Name *</label>
            <input
              type="text"
              id="edit-firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={formErrors.firstName ? 'error' : ''}
            />
            {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-lastName">Last Name *</label>
            <input
              type="text"
              id="edit-lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={formErrors.lastName ? 'error' : ''}
            />
            {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-email">Email *</label>
            <input
              type="email"
              id="edit-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Full Professor, Associate Professor"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-departmentId">Department *</label>
            <select
              id="edit-departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              className={formErrors.departmentId ? 'error' : ''}
            >
              <option value="">Select a department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {formErrors.departmentId && <span className="error-text">{formErrors.departmentId}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={closeEditModal} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Professor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirm Delete" size="small">
        <div className="delete-confirmation">
          <p>Are you sure you want to delete the professor:</p>
          <p className="delete-item-name">
            {selectedProfessor?.firstName} {selectedProfessor?.lastName}
          </p>
          <p className="warning-text">This action cannot be undone.</p>

          <div className="form-actions">
            <button onClick={closeDeleteModal} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProfessorList;
