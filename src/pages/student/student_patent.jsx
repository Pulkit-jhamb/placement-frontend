import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import StudentSidebar from './student_sidebar';
import { Pencil } from 'lucide-react';

const Patent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllOngoing, setShowAllOngoing] = useState(false);
  const [showAllBrowse, setShowAllBrowse] = useState(false);
  const [allOngoingPatents, setAllOngoingPatents] = useState([]);
  const [allBrowsePatents, setAllBrowsePatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatents();
  }, []);

  const fetchPatents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch professor's patents (admin opportunities)
      const response = await axios.get(API_ENDPOINTS.STUDENT_OPPORTUNITIES.PATENTS, { headers });
      const patents = response.data.patents || [];
      
      // For now, show all patents in browse section
      setAllBrowsePatents(patents);
      setAllOngoingPatents([]);
    } catch (err) {
      console.error('Failed to fetch patents:', err);
      setError('Failed to load patents');
      setAllBrowsePatents([]);
      setAllOngoingPatents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToPatent = (patent) => {
    if (patent.googleFormLink) {
      window.open(patent.googleFormLink, '_blank');
    } else {
      alert('Application link not available for this patent');
    }
  };

  // Filter patents based on search query
  const filterPatents = (patents) => {
    if (!searchQuery) return patents;
    return patents.filter(patent =>
      patent.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patent.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patent.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredOngoingPatents = filterPatents(allOngoingPatents);
  const filteredBrowsePatents = filterPatents(allBrowsePatents);

  const ongoingPatents = showAllOngoing ? filteredOngoingPatents : filteredOngoingPatents.slice(0, 4);
  const browsePatents = showAllBrowse ? filteredBrowsePatents : filteredBrowsePatents.slice(0, 4);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
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
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64">
        {/* Header with Search */}
        <header className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search patents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </header>

        {/* Ongoing Patents */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Ongoing Patents</h2>
            {filteredOngoingPatents.length > 4 && (
              <button 
                onClick={() => setShowAllOngoing(!showAllOngoing)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                {showAllOngoing ? 'Show less' : 'View all'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-6">Find your all patents here</p>
          <div className="grid grid-cols-4 gap-6">
            {ongoingPatents.map((patent, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative">
                <button
                  className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  title="Edit patent"
                >
                  <Pencil size={16} className="text-gray-700" />
                </button>
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{patent.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{patent.inventor}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {patent.category}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {patent.status}
                  </div>
                  <button className="w-full mt-3 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Browse Patents */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse Patents</h2>
            {filteredBrowsePatents.length > 4 && (
              <button 
                onClick={() => setShowAllBrowse(!showAllBrowse)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                {showAllBrowse ? 'Show less' : 'View all'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-6">Find all professor's patents here</p>
          {browsePatents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No patents available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {browsePatents.map((patent, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{patent.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">Professor's Patent</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {patent.domain || 'Not specified'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {patent.studentsRequired || 0} students needed
                    </div>
                    <button 
                      onClick={() => handleApplyToPatent(patent)}
                      className="w-full mt-3 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Patent;
