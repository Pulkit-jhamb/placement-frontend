import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';

const ProfIdModal = ({ isOpen, onClose, onSuccess }) => {
  const [profId, setProfId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profId.trim()) {
      setError('Professor ID is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('authToken');
      
      await axios.put(
        API_ENDPOINTS.USER,
        { profId: profId.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save professor ID:', err);
      setError(err.response?.data?.message || 'Failed to save professor ID');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Set Your Professor ID</h2>
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
          <p className="text-sm text-gray-600 mb-4">
            Please enter your unique Professor ID. This will be used to identify you when you're added as a contributor to projects, research papers, or patents.
          </p>
          
          <p className="text-xs text-gray-500 mb-4">
            Note: This ID will not be displayed publicly and is only used for internal identification.
          </p>

          <div className="mb-4">
            <label htmlFor="profId" className="block text-sm font-medium text-gray-700 mb-2">
              Professor ID*
            </label>
            <input
              type="text"
              id="profId"
              value={profId}
              onChange={(e) => setProfId(e.target.value)}
              placeholder="e.g., PROF001"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Professor ID'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfIdModal;
