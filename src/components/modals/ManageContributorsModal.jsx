import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';

const ManageContributorsModal = ({ isOpen, onClose, opportunity, opportunityType, onUpdate }) => {
  const [contributors, setContributors] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [newRollNo, setNewRollNo] = useState('');
  const [newProfId, setNewProfId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editRollNo, setEditRollNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentNames, setStudentNames] = useState({});
  const [professorNames, setProfessorNames] = useState({});
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (isOpen && opportunity) {
      loadContributors();
    }
  }, [isOpen, opportunity]);

  const loadContributors = () => {
    // Load existing contributors from opportunity
    const existingContributors = opportunity.contributors || [];
    const existingProfessors = opportunity.professors || [];
    setContributors(existingContributors);
    setProfessors(existingProfessors);
    
    // Fetch student names for all contributors
    existingContributors.forEach(contributor => {
      fetchStudentName(contributor.rollNo);
    });
    
    // Fetch professor names
    existingProfessors.forEach(profId => {
      fetchProfessorName(profId);
    });
  };

  const fetchStudentName = async (rollNo) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_ENDPOINTS.USER}/validate/rollNo`,
        { rollNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data && response.data.valid) {
        setStudentNames(prev => ({
          ...prev,
          [rollNo]: response.data.name
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch student name for ${rollNo}:`, err);
      setStudentNames(prev => ({
        ...prev,
        [rollNo]: 'Unknown Student'
      }));
    }
  };

  const fetchProfessorName = async (profId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_ENDPOINTS.USER}/validate/profId`,
        { profId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data && response.data.valid) {
        setProfessorNames(prev => ({
          ...prev,
          [profId]: response.data.name
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch professor name for ${profId}:`, err);
      setProfessorNames(prev => ({
        ...prev,
        [profId]: 'Unknown Professor'
      }));
    }
  };

  const handleAddContributor = async () => {
    if (!newRollNo.trim()) {
      setError('Please enter a roll number');
      return;
    }

    // Check if already exists
    if (contributors.some(c => c.rollNo === newRollNo.trim())) {
      setError('This student is already added');
      return;
    }

    setLoading(true);
    setValidating(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      
      // Validate student roll number
      const validationResponse = await axios.post(
        `${API_ENDPOINTS.USER}/validate/rollNo`,
        { rollNo: newRollNo.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!validationResponse.data.valid) {
        setError(validationResponse.data.message || 'Invalid roll number');
        setLoading(false);
        setValidating(false);
        return;
      }

      const newContributor = {
        rollNo: newRollNo.trim(),
        studentId: validationResponse.data.id,
        addedAt: new Date().toISOString()
      };

      const updatedContributors = [...contributors, newContributor];
      
      // Update opportunity in backend
      await updateOpportunityContributors(updatedContributors, professors);
      
      setContributors(updatedContributors);
      setStudentNames(prev => ({
        ...prev,
        [newRollNo.trim()]: validationResponse.data.name
      }));
      setNewRollNo('');
      setError('');
      setValidating(false);
    } catch (err) {
      console.error('Failed to add contributor:', err);
      setError(err.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContributor = async (contributor) => {
    if (!editRollNo.trim()) {
      setError('Please enter a roll number');
      return;
    }

    if (editRollNo.trim() === contributor.rollNo) {
      setEditingId(null);
      setEditRollNo('');
      return;
    }

    // Check if new roll number already exists
    if (contributors.some(c => c.rollNo === editRollNo.trim() && c.rollNo !== contributor.rollNo)) {
      setError('This student is already added');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      
      // Verify new student exists
      const studentResponse = await axios.get(`${API_ENDPOINTS.USER}/by-rollno/${editRollNo.trim()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!studentResponse.data) {
        setError('Student not found with this roll number');
        setLoading(false);
        return;
      }

      const updatedContributors = contributors.map(c =>
        c.rollNo === contributor.rollNo
          ? { ...c, rollNo: editRollNo.trim(), studentId: studentResponse.data.id }
          : c
      );

      // Update opportunity in backend
      await updateOpportunityContributors(updatedContributors);
      
      setContributors(updatedContributors);
      setStudentNames(prev => ({
        ...prev,
        [editRollNo.trim()]: studentResponse.data.name
      }));
      setEditingId(null);
      setEditRollNo('');
      setError('');
    } catch (err) {
      console.error('Failed to edit contributor:', err);
      setError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContributor = async (rollNo) => {
    if (!confirm('Are you sure you want to remove this student?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedContributors = contributors.filter(c => c.rollNo !== rollNo);
      
      // Update opportunity in backend
      await updateOpportunityContributors(updatedContributors);
      
      setContributors(updatedContributors);
      setError('');
    } catch (err) {
      console.error('Failed to delete contributor:', err);
      setError('Failed to remove student');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfessor = async () => {
    if (!newProfId.trim()) {
      setError('Please enter a professor ID');
      return;
    }

    // Check if already exists
    if (professors.includes(newProfId.trim())) {
      setError('This professor is already added');
      return;
    }

    setLoading(true);
    setValidating(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      
      // Validate professor ID
      const validationResponse = await axios.post(
        `${API_ENDPOINTS.USER}/validate/profId`,
        { profId: newProfId.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!validationResponse.data.valid) {
        setError(validationResponse.data.message || 'Invalid professor ID');
        setLoading(false);
        setValidating(false);
        return;
      }

      const updatedProfessors = [...professors, newProfId.trim()];
      
      // Update opportunity in backend
      await updateOpportunityContributors(contributors, updatedProfessors);
      
      setProfessors(updatedProfessors);
      setProfessorNames(prev => ({
        ...prev,
        [newProfId.trim()]: validationResponse.data.name
      }));
      setNewProfId('');
      setError('');
      setValidating(false);
    } catch (err) {
      console.error('Failed to add professor:', err);
      setError(err.response?.data?.message || 'Failed to add professor');
      setValidating(false);
    } finally {
      setLoading(false);
    }
  };

  const updateOpportunityContributors = async (updatedContributors, updatedProfessors) => {
    const token = localStorage.getItem('authToken');
    let endpoint = '';
    
    if (opportunityType === 'project') {
      endpoint = `${API_ENDPOINTS.ADMIN_PROJECTS}/${opportunity._id}`;
    } else if (opportunityType === 'research') {
      endpoint = `${API_ENDPOINTS.ADMIN_RESEARCH}/${opportunity._id}`;
    } else if (opportunityType === 'patent') {
      endpoint = `${API_ENDPOINTS.ADMIN_PATENTS}/${opportunity._id}`;
    }

    await axios.put(
      endpoint,
      { 
        contributors: updatedContributors,
        professors: updatedProfessors 
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (onUpdate) {
      onUpdate();
    }
  };

  const handleRemoveProfessor = async (profId) => {
    if (!window.confirm('Remove this professor from contributors?')) {
      return;
    }

    setLoading(true);
    try {
      const updatedProfessors = professors.filter(p => p !== profId);
      await updateOpportunityContributors(contributors, updatedProfessors);
      setProfessors(updatedProfessors);
      setError('');
    } catch (err) {
      console.error('Failed to remove professor:', err);
      setError('Failed to remove professor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Contributors</h2>
            <p className="text-sm text-gray-600 mt-1">{opportunity?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Add New Professor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Professor by ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newProfId}
                onChange={(e) => setNewProfId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProfessor()}
                placeholder="Enter professor ID (e.g., PROF001)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
              <button
                onClick={handleAddProfessor}
                disabled={loading || validating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Plus size={18} />
                {validating ? 'Validating...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Professors List */}
          {professors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Professor Contributors ({professors.length})
              </h3>
              <div className="space-y-2">
                {professors.map((profId) => (
                  <div
                    key={profId}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{professorNames[profId] || 'Loading...'}</p>
                      <p className="text-sm text-gray-600">ID: {profId}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveProfessor(profId)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Student Contributor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Student by Roll Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRollNo}
                onChange={(e) => setNewRollNo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddContributor()}
                placeholder="Enter roll number (e.g., 102103456)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleAddContributor}
                disabled={loading || validating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Plus size={18} />
                {validating ? 'Validating...' : 'Add'}
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          {/* Contributors List */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Contributors ({contributors.length})
            </h3>
            
            {contributors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No contributors added yet</p>
                <p className="text-sm mt-1">Add students using their roll numbers</p>
              </div>
            ) : (
              <div className="space-y-2">
                {contributors.map((contributor, index) => (
                  <div
                    key={contributor.rollNo}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      {editingId === contributor.rollNo ? (
                        <input
                          type="text"
                          value={editRollNo}
                          onChange={(e) => setEditRollNo(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleEditContributor(contributor)}
                          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <p className="font-medium text-gray-900">
                            {studentNames[contributor.rollNo] || 'Loading...'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Roll No: {contributor.rollNo}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {editingId === contributor.rollNo ? (
                        <>
                          <button
                            onClick={() => handleEditContributor(contributor)}
                            disabled={loading}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditRollNo('');
                              setError('');
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(contributor.rollNo);
                              setEditRollNo(contributor.rollNo);
                              setError('');
                            }}
                            disabled={loading}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteContributor(contributor.rollNo)}
                            disabled={loading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageContributorsModal;
