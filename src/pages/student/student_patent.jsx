import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import StudentSidebar from './student_sidebar';
import { Plus } from 'lucide-react';
import AddPatentModal from '../../components/modals/AddPatentModal';

const Patent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllOngoing, setShowAllOngoing] = useState(false);
  const [showAllBrowse, setShowAllBrowse] = useState(false);
  const [allOngoingPatents, setAllOngoingPatents] = useState([]);
  const [allBrowsePatents, setAllBrowsePatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPatents();
  }, []);

  const fetchPatents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [browseResp, myResp] = await Promise.all([
        axios.get(API_ENDPOINTS.STUDENT_OPPORTUNITIES.PATENTS, { headers }),
        axios.get(API_ENDPOINTS.PATENTS, { headers })
      ]);

      setAllBrowsePatents(browseResp.data.patents || []);
      setAllOngoingPatents(myResp.data.patents || []);
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

  const handleCreatePatent = async (payload) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.post(API_ENDPOINTS.PATENTS, payload, { headers });
      setIsModalOpen(false);
      await fetchPatents();
    } catch (err) {
      console.error('Failed to create patent:', err);
      const message = err.response?.data?.message || 'Failed to create patent.';
      alert(message);
    }
  };

  const palette = ['bg-[#d7efff]', 'bg-[#fbd4d3]', 'bg-[#fdecc8]', 'bg-[#d6f5d6]'];

  const renderPatentCard = (patent, idx, variant = 'browse') => {
    const bgColor = palette[idx % palette.length];
    const title = patent.title || 'Untitled Patent';
    const domain = patent.domain || patent.category || 'General Domain';
    const studentsNeeded = patent.studentsRequired || patent.students || 0;
    const status = patent.status || 'Open';
    const deadline = patent.deadline || patent.duration || 'Flexible timeline';

    return (
      <div key={`${title}-${idx}`} className="rounded-[24px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow flex flex-col">
        <div className={`${bgColor} h-28 rounded-t-[24px] relative`}>
          {variant === 'browse' && patent.status && (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 text-gray-700 shadow">
              {status}
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">{variant === 'browse' ? 'Professor Patent' : 'Your Patent'}</p>
            <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">{title}</h3>
          </div>
          <p className="text-sm text-gray-500">{domain}</p>

          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-900"></span>
              <span>{deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-900"></span>
              <span>{studentsNeeded} students required</span>
            </div>
          </div>

          <div className="mt-auto pt-4">
            {variant === 'browse' ? (
              <button
                onClick={() => handleApplyToPatent(patent)}
                className="w-full py-2.5 rounded-full font-semibold bg-gray-900 text-white hover:opacity-90 transition"
              >
                Apply
              </button>
            ) : (
              <button className="w-full py-2.5 rounded-full font-semibold border border-gray-300 text-gray-900 hover:bg-gray-50 transition">
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
      <StudentSidebar />

      <main className="flex-1 ml-64 bg-[#f6f6f6]">
        <div className="px-6 sm:px-10 py-10 w-full">
          <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Patent Opportunities</h1>
              <p className="text-gray-500">Track your filings and apply to professor initiatives</p>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patents..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-800 hover:text-red-900 text-xl">×</button>
            </div>
          )}

          <section className="mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Your Patents</h2>
                <p className="text-gray-500">Monitor submissions you've already started</p>
              </div>
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

            {ongoingPatents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">You don't have any active patent submissions yet.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800"
                >
                  <Plus size={18} /> Start Patent
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800"
                  >
                    <Plus size={16} /> Add Patent
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {ongoingPatents.map((patent, idx) => renderPatentCard(patent, idx, 'ongoing'))}
                </div>
              </>
            )}
          </section>

          <section>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Professor Patents</h2>
                <p className="text-gray-500">Browse open innovation initiatives from faculty</p>
              </div>
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

            {browsePatents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-300">
                <p className="text-gray-500">No professor patents available right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {browsePatents.map((patent, idx) => renderPatentCard(patent, idx, 'browse'))}
              </div>
            )}
          </section>
        </div>
      </main>

      <AddPatentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePatent}
      />
    </div>
  );
}

export default Patent;
