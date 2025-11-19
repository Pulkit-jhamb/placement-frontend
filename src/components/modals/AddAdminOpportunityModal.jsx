import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddAdminOpportunityModal = ({ isOpen, onClose, onSubmit, editingItem, type }) => {
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    studentsRequired: '',
    duration: '',
    googleFormLink: '',
    description: '',
    deadline: '',
    status: 'Planning',
    professors: [],
    students: []
  });

  const [professorId, setProfessorId] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [error, setError] = useState('');

  // Prefill form data when editingItem changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        domain: editingItem.domain || '',
        studentsRequired: editingItem.studentsRequired || '',
        duration: editingItem.duration || '',
        googleFormLink: editingItem.googleFormLink || '',
        description: editingItem.description || '',
        deadline: editingItem.deadline || '',
        status: editingItem.status || 'Planning',
        professors: editingItem.professors || [],
        students: editingItem.students || []
      });
    } else {
      // Reset form for new item
      setFormData({
        title: '',
        domain: '',
        studentsRequired: '',
        duration: '',
        googleFormLink: '',
        description: '',
        deadline: '',
        status: 'Planning',
        professors: [],
        students: []
      });
    }
    setError('');
  }, [editingItem, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProfessor = () => {
    if (professorId.trim()) {
      setFormData({
        ...formData,
        professors: [...formData.professors, professorId.trim()]
      });
      setProfessorId('');
    }
  };

  const handleRemoveProfessor = (index) => {
    setFormData({
      ...formData,
      professors: formData.professors.filter((_, i) => i !== index)
    });
  };

  const handleAddStudent = () => {
    if (studentRollNo.trim()) {
      setFormData({
        ...formData,
        students: [...formData.students, studentRollNo.trim()]
      });
      setStudentRollNo('');
    }
  };

  const handleRemoveStudent = (index) => {
    setFormData({
      ...formData,
      students: formData.students.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.domain.trim()) {
      setError('Domain is required');
      return;
    }
    if (!formData.studentsRequired || formData.studentsRequired <= 0) {
      setError('Number of students required must be greater than 0');
      return;
    }
    if (!formData.googleFormLink.trim()) {
      setError('Google Form link is required');
      return;
    }

    onSubmit(formData);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    if (editingItem) return `Edit ${type}`;
    return `Add New ${type}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-6">* Indicates required</p>

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., ML Rainfall Prediction System"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Domain and Students Required */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                Domain*
              </label>
              <input
                type="text"
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="e.g., Machine Learning"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="studentsRequired" className="block text-sm font-medium text-gray-700 mb-2">
                Students Required*
              </label>
              <input
                type="number"
                id="studentsRequired"
                name="studentsRequired"
                value={formData.studentsRequired}
                onChange={handleChange}
                placeholder="e.g., 3"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Duration, Deadline, and Status */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status*
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
                <option value="Published">Published</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Google Form Link */}
          <div className="mb-4">
            <label htmlFor="googleFormLink" className="block text-sm font-medium text-gray-700 mb-2">
              Google Form Link*
            </label>
            <input
              type="url"
              id="googleFormLink"
              name="googleFormLink"
              value={formData.googleFormLink}
              onChange={handleChange}
              placeholder="https://forms.google.com/..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Professors Section (Only for editing) */}
          {editingItem && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professors (Contributors)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={professorId}
                  onChange={(e) => setProfessorId(e.target.value)}
                  placeholder="Enter Professor ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddProfessor}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.professors.map((prof, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{prof}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProfessor(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Section (Only for editing) */}
          {editingItem && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Students (Contributors)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={studentRollNo}
                  onChange={(e) => setStudentRollNo(e.target.value)}
                  placeholder="Enter Student Roll Number"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.students.map((student, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{student}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
              {error}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminOpportunityModal;
