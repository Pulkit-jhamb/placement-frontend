import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import StudentSidebar from './student_sidebar';
import { Plus } from 'lucide-react';
import AddResearchModal from '../../components/modals/AddResearchModal';

const ResearchPaper = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllOngoing, setShowAllOngoing] = useState(false);
  const [showAllBrowse, setShowAllBrowse] = useState(false);
  const [allOngoingPapers, setAllOngoingPapers] = useState([]);
  const [allBrowsePapers, setAllBrowsePapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchResearchPapers();
  }, []);

  const fetchResearchPapers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [browseResp, myResp] = await Promise.all([
        axios.get(API_ENDPOINTS.STUDENT_OPPORTUNITIES.RESEARCH, { headers }),
        axios.get(API_ENDPOINTS.RESEARCH, { headers })
      ]);

      setAllBrowsePapers(browseResp.data.papers || []);
      setAllOngoingPapers(myResp.data.papers || []);
    } catch (err) {
      console.error('Failed to fetch research papers:', err);
      setError('Failed to load research papers');

      setAllBrowsePapers([]);
      setAllOngoingPapers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToPaper = (paper) => {
    if (paper.googleFormLink) {
      window.open(paper.googleFormLink, '_blank');
    } else {
      alert('Application link not available for this research paper');
    }
  };

  const filterPapers = (papers) => {
    if (!searchQuery) return papers;
    return papers.filter(paper =>
      paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredOngoingPapers = filterPapers(allOngoingPapers);
  const filteredBrowsePapers = filterPapers(allBrowsePapers);

  const ongoingPapers = showAllOngoing ? filteredOngoingPapers : filteredOngoingPapers.slice(0, 4);
  const browsePapers = showAllBrowse ? filteredBrowsePapers : filteredBrowsePapers.slice(0, 4);

  const handleCreateResearch = async (payload) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.post(API_ENDPOINTS.RESEARCH, payload, { headers });
      setIsModalOpen(false);
      await fetchResearchPapers();
    } catch (err) {
      console.error('Failed to create research paper:', err);
      const message = err.response?.data?.message || 'Failed to create research paper.';
      alert(message);
    }
  };

  const palette = ['bg-[#d7efff]', 'bg-[#fbd4d3]', 'bg-[#fdecc8]', 'bg-[#d6f5d6]'];

  const renderPaperCard = (paper, idx, variant = 'browse') => {
    const bgColor = palette[idx % palette.length];
    const title = paper.title || 'Untitled Research';
    const domain = paper.domain || paper.category || 'General Domain';
    const studentsNeeded = paper.studentsRequired || paper.students || 0;
    const deadline = paper.deadline || paper.duration || 'Rolling basis';

    return (
      <div key={`${title}-${idx}`} className="rounded-[24px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow flex flex-col">
        <div className={`${bgColor} h-28 rounded-t-[24px] relative`}>
          {variant === 'browse' && (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 text-gray-700 shadow">
              {paper.status || 'Open'}
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">{variant === 'browse' ? 'Professor Research' : 'Your Research'}</p>
            <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">{title}</h3>
          </div>
          <p className="text-sm text-gray-500">{domain}</p>

          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-900"></span>
              <span>{paper.professor || 'Faculty Mentor'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-900"></span>
              <span>{studentsNeeded} students • {deadline}</span>
            </div>
          </div>

          <div className="mt-auto pt-4">
            {variant === 'browse' ? (
              <button
                onClick={() => handleApplyToPaper(paper)}
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
            <p className="text-gray-600">Loading research papers...</p>
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
              <h1 className="text-4xl font-bold text-gray-900">Research Opportunities</h1>
              <p className="text-gray-500">Collaborate with faculty on live research problems</p>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search research papers..."
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
                <h2 className="text-2xl font-semibold text-gray-900">Your Research Papers</h2>
                <p className="text-gray-500">Monitor applications you've already started</p>
              </div>
              {filteredOngoingPapers.length > 4 && (
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

            {ongoingPapers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">You don't have any active research submissions yet.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800"
                >
                  <Plus size={18} /> Start Research
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800"
                  >
                    <Plus size={16} /> Add Research
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl-grid-cols-3 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {ongoingPapers.map((paper, idx) => renderPaperCard(paper, idx, 'ongoing'))}
                </div>
              </>
            )}
          </section>

          {/* <section>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Professor Research</h2>
                <p className="text-gray-500">Browse open roles and contribute to lab work</p>
              </div>
              {filteredBrowsePapers.length > 4 && (
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

            {browsePapers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-300">
                <p className="text-gray-500">No professor research opportunities available right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl-grid-cols-3 gap-8">
                {browsePapers.map((paper, idx) => renderPaperCard(paper, idx, 'browse'))}
              </div>
            )}
          </section> */}
        </div>
      </main>

      <AddResearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateResearch}
      />
    </div>
  );
};

export default ResearchPaper;