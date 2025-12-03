import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { departmentApi } from '../../services/api';
import Modal from '../common/Modal';
import './DepartmentList.css';

function DepartmentList() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
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
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    yearEstablished: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Filter departments based on search term
    const filtered = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.yearEstablished && dept.yearEstablished.toString().includes(searchTerm))
    );
    setFilteredDepartments(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, departments]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentApi.getAll();
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments. Please try again.');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredDepartments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDepartments.length / recordsPerPage);

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
    if (!formData.name.trim()) {
      errors.name = 'Department name is required';
    }
    if (!formData.code.trim()) {
      errors.code = 'Department code is required';
    }
    if (formData.yearEstablished && (formData.yearEstablished < 1800 || formData.yearEstablished > new Date().getFullYear())) {
      errors.yearEstablished = 'Please enter a valid year';
    }
    return errors;
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', yearEstablished: '' });
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
      await departmentApi.create(formData);
      await fetchDepartments();
      closeAddModal();
    } catch (err) {
      setError('Failed to create department. Please try again.');
      console.error('Error creating department:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Modal handlers
  const openEditModal = (dept) => {
    setSelectedDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      yearEstablished: dept.yearEstablished || ''
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDepartment(null);
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
      await departmentApi.update(selectedDepartment.id, formData);
      await fetchDepartments();
      closeEditModal();
    } catch (err) {
      setError('Failed to update department. Please try again.');
      console.error('Error updating department:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Modal handlers
  const openDeleteModal = (dept) => {
    setSelectedDepartment(dept);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await departmentApi.delete(selectedDepartment.id);
      await fetchDepartments();
      closeDeleteModal();
    } catch (err) {
      setError('Failed to delete department. It may have professors assigned to it.');
      console.error('Error deleting department:', err);
      closeDeleteModal();
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (deptId) => {
    navigate(`/departments/${deptId}`);
  };

  if (loading) return <div className="loading">Loading departments...</div>;

  return (
    <div className="department-list-container">
      <div className="page-header">
        <h1>Manage Departments</h1>
        <button onClick={openAddModal} className="btn btn-primary">
          Add New Department
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, code, or year..."
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
              <th>Code</th>
              <th>Name</th>
              <th>Year Established</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.code}</td>
                  <td>{dept.name}</td>
                  <td>{dept.yearEstablished || 'N/A'}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleViewDetails(dept.id)} className="btn btn-info btn-sm">
                      View
                    </button>
                    <button onClick={() => openEditModal(dept)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => openDeleteModal(dept)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">
                  {searchTerm ? 'No departments found matching your search.' : 'No departments available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredDepartments.length > recordsPerPage && (
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="btn btn-pagination"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages} ({filteredDepartments.length} total)
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
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Add New Department">
        <form onSubmit={handleAdd} className="department-form">
          <div className="form-group">
            <label htmlFor="name">Department Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="code">Department Code *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={formErrors.code ? 'error' : ''}
            />
            {formErrors.code && <span className="error-text">{formErrors.code}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="yearEstablished">Year Established</label>
            <input
              type="number"
              id="yearEstablished"
              name="yearEstablished"
              value={formData.yearEstablished}
              onChange={handleInputChange}
              className={formErrors.yearEstablished ? 'error' : ''}
              min="1800"
              max={new Date().getFullYear()}
            />
            {formErrors.yearEstablished && <span className="error-text">{formErrors.yearEstablished}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={closeAddModal} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Department'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Department">
        <form onSubmit={handleEdit} className="department-form">
          <div className="form-group">
            <label htmlFor="edit-name">Department Name *</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-code">Department Code *</label>
            <input
              type="text"
              id="edit-code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={formErrors.code ? 'error' : ''}
            />
            {formErrors.code && <span className="error-text">{formErrors.code}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-yearEstablished">Year Established</label>
            <input
              type="number"
              id="edit-yearEstablished"
              name="yearEstablished"
              value={formData.yearEstablished}
              onChange={handleInputChange}
              className={formErrors.yearEstablished ? 'error' : ''}
              min="1800"
              max={new Date().getFullYear()}
            />
            {formErrors.yearEstablished && <span className="error-text">{formErrors.yearEstablished}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={closeEditModal} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Department'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirm Delete" size="small">
        <div className="delete-confirmation">
          <p>Are you sure you want to delete the department:</p>
          <p className="delete-item-name">"{selectedDepartment?.name}"?</p>
          <p className="warning-text">This action cannot be undone. If professors are assigned to this department, the deletion will fail.</p>

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

export default DepartmentList;
