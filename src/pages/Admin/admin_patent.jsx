import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, Users } from 'lucide-react';
import AdminSidebar from './admin_sidebar';
import AddAdminOpportunityModal from '../../components/modals/AddAdminOpportunityModal';
import ManageContributorsModal from '../../components/modals/ManageContributorsModal';
import { API_ENDPOINTS } from '../../config';

const AdminPatent = () => {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);
  const [editingPatent, setEditingPatent] = useState(null);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatents();
  }, []);

  const fetchPatents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      // TODO: Replace with actual admin patents endpoint
      const response = await axios.get(`${API_ENDPOINTS.USER}/admin/patents`, { headers });
      setPatents(response.data.patents || []);
    } catch (err) {
      console.error('Failed to fetch patents:', err);
      setPatents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatent = async (patentData) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingPatent) {
        // Update existing patent
        await axios.put(
          `${API_ENDPOINTS.USER}/admin/patents/${editingPatent.id}`,
          patentData,
          { headers }
        );
        alert('Patent updated successfully!');
      } else {
        // Create new patent
        await axios.post(
          `${API_ENDPOINTS.USER}/admin/patents`,
          patentData,
          { headers }
        );
        alert('Patent created successfully!');
      }

      fetchPatents();
      setIsModalOpen(false);
      setEditingPatent(null);
    } catch (err) {
      console.error('Failed to save patent:', err);
      setError(err.response?.data?.message || 'Failed to save patent');
    }
  };

  const handleEditPatent = (patent) => {
    setEditingPatent(patent);
    setIsModalOpen(true);
  };

  const handleDeletePatent = async (patentId) => {
    if (!window.confirm('Are you sure you want to delete this patent?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`${API_ENDPOINTS.USER}/admin/patents/${patentId}`, { headers });
      alert('Patent deleted successfully!');
      fetchPatents();
    } catch (err) {
      console.error('Failed to delete patent:', err);
      alert(err.response?.data?.message || 'Failed to delete patent');
    }
  };

  const calculateDaysLeft = (deadline) => {
    if (!deadline) return 'No deadline';
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Loading patents...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1">
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-800 hover:text-red-900 text-xl">×</button>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Patents</h1>
              <p className="text-gray-600">Manage all patent opportunities here</p>
            </div>
            <button 
              onClick={() => {
                setEditingPatent(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} />
              Upload New
            </button>
          </div>

          {patents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-4">No patents yet. Create your first patent opportunity!</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
                Add Patent
              </button>
            </div>
          ) : (
            <>
              {/* Active Patents */}
              {patents.filter(p => p.status?.toLowerCase() !== 'completed').length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Active Patents</h2>
                  <div className="grid grid-cols-4 gap-6">
                    {patents.filter(p => p.status?.toLowerCase() !== 'completed').map((patent) => (
                <div key={patent.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative">
                  <button
                    onClick={() => handleEditPatent(patent)}
                    className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Edit patent"
                  >
                    <Pencil size={16} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDeletePatent(patent.id)}
                    className="absolute top-2 left-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="Delete patent"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                  {patent.status && (
                    <div className="absolute top-14 right-2 z-10">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-md ${
                        patent.status === 'active' ? 'bg-green-100 text-green-700' :
                        patent.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {patent.status}
                      </span>
                    </div>
                  )}
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{patent.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {patent.domain}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <a href={patent.googleFormLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        Application Form
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {patent.studentsRequired} Students Required
                    </div>
                    {patent.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {patent.duration}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {calculateDaysLeft(patent.deadline)}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedPatent(patent);
                        setIsContributorsModalOpen(true);
                      }}
                      className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 mb-2"
                    >
                      <Users size={16} />
                      Manage Contributors ({patent.contributors?.length || 0})
                    </button>
                  </div>
                </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Patents */}
              {patents.filter(p => p.status?.toLowerCase() === 'completed').length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Completed Patents</h2>
                  <div className="grid grid-cols-4 gap-6">
                    {patents.filter(p => p.status?.toLowerCase() === 'completed').map((patent) => (
                      <div key={patent.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative opacity-75">
                        <button
                          onClick={() => handleEditPatent(patent)}
                          className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          title="Edit patent"
                        >
                          <Pencil size={16} className="text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDeletePatent(patent.id)}
                          className="absolute top-2 left-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          title="Delete patent"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                        <div className="absolute top-14 right-2 z-10">
                          <span className="px-2 py-1 rounded-full text-xs font-medium shadow-md bg-gray-100 text-gray-700">
                            completed
                          </span>
                        </div>
                        <div className="h-40 bg-gray-200"></div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{patent.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {patent.domain}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <a href={patent.googleFormLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              Application Form
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {patent.studentsRequired} Students Required
                          </div>
                          {patent.duration && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {patent.duration}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {calculateDaysLeft(patent.deadline)}
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedPatent(patent);
                              setIsContributorsModalOpen(true);
                            }}
                            className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 mb-2"
                          >
                            <Users size={16} />
                            Manage Contributors ({patent.contributors?.length || 0})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add/Edit Patent Modal */}
      <AddAdminOpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatent(null);
        }}
        onSubmit={handleAddPatent}
        editingItem={editingPatent}
        type="Patent"
      />

      {/* Manage Contributors Modal */}
      <ManageContributorsModal
        isOpen={isContributorsModalOpen}
        onClose={() => {
          setIsContributorsModalOpen(false);
          setSelectedPatent(null);
        }}
        opportunity={selectedPatent}
        opportunityType="patent"
        onUpdate={fetchPatents}
      />
    </div>
  );
};

export default AdminPatent;
