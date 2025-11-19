import React, { useState } from 'react';

const EditCGPAModal = ({ isOpen, onClose, onSubmit, currentCGPA }) => {
  const [cgpa, setCgpa] = useState(currentCGPA || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cgpaValue = parseFloat(cgpa);
    
    if (!cgpa || isNaN(cgpaValue)) {
      setError('Please enter a valid CGPA');
      return;
    }

    if (cgpaValue < 0 || cgpaValue > 10) {
      setError('CGPA must be between 0 and 10');
      return;
    }

    onSubmit(cgpaValue);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit CGPA</h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-6">* Indicates required</p>

          {/* CGPA Input */}
          <div className="mb-6">
            <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-2">
              CGPA (out of 10)*
            </label>
            <input
              type="number"
              id="cgpa"
              step="0.01"
              min="0"
              max="10"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="e.g., 8.5"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCGPAModal;
