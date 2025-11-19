import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import { Upload } from 'lucide-react';
import AdminSidebar from './admin_sidebar';

const AdminHome = () => {
  const [projects, setProjects] = useState([]);
  const [research, setResearch] = useState([]);
  const [patents, setPatents] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [performanceDocUrl, setPerformanceDocUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingPerformance, setUploadingPerformance] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user profile
      const profileResp = await axios.get(API_ENDPOINTS.USER, { headers });
      setUserProfile(profileResp.data);
      setResumeUrl(profileResp.data.resumeUrl || '');
      setPerformanceDocUrl(profileResp.data.performanceDocUrl || '');

      // Fetch projects
      const projectsResp = await axios.get(API_ENDPOINTS.ADMIN_PROJECTS, { headers });
      setProjects(projectsResp.data.projects || []);

      // Fetch research
      const researchResp = await axios.get(API_ENDPOINTS.ADMIN_RESEARCH, { headers });
      setResearch(researchResp.data.papers || []);

      // Fetch patents
      const patentsResp = await axios.get(API_ENDPOINTS.ADMIN_PATENTS, { headers });
      setPatents(patentsResp.data.patents || []);

      // Thesis would be a new collection - for now empty
      setThesis([]);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAtsAnalyzeFromDrive = async () => {
    if (!resumeUrl) {
      setAtsError('No resume Drive link saved. Please upload a resume link first.');
      return;
    }

    try {
      setAtsLoading(true);
      setAtsError(null);
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        API_ENDPOINTS.ATS_FROM_SAVED_RESUME,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAtsScore(response.data.ats_score);
    } catch (err) {
      console.error('Failed to analyze ATS score from Drive link:', err);
      const message = err.response?.data?.error || 'Failed to analyze resume ATS score';
      setAtsError(message);
    } finally {
      setAtsLoading(false);
    }
  };

  const handleResumeUpload = async () => {
    const link = prompt('Enter Google Drive link for Resume:');
    if (!link) return;

    if (!link.startsWith('https://drive.google.com/')) {
      alert('Please enter a valid Google Drive link');
      return;
    }

    try {
      setUploadingResume(true);
      const token = localStorage.getItem('authToken');
      await axios.put(
        API_ENDPOINTS.USER,
        { resumeUrl: link },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumeUrl(link);
      alert('Resume uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload resume:', err);
      alert('Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handlePerformanceDocUpload = async () => {
    const link = prompt('Enter Google Drive link for Performance Doc:');
    if (!link) return;

    if (!link.startsWith('https://drive.google.com/')) {
      alert('Please enter a valid Google Drive link');
      return;
    }

    try {
      setUploadingPerformance(true);
      const token = localStorage.getItem('authToken');
      await axios.put(
        API_ENDPOINTS.USER,
        { performanceDocUrl: link },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPerformanceDocUrl(link);
      alert('Performance Doc uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload performance doc:', err);
      alert('Failed to upload performance doc');
    } finally {
      setUploadingPerformance(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Planning': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Planning' },
      'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      'Under Review': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
      'Completed': { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      'Published': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Published' },
      'On Hold': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'On Hold' },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig['In Progress'];
    return (
      <span className={`inline-block px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <main className="flex-1 p-12">
        <div className="mb-12">
          <p className="text-gray-400 text-sm mb-2">Good Morning,</p>
          <h1 className="text-5xl font-bold text-gray-900">
           Dr. {userProfile?.name || 'Admin'}
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* First Row - Projects and Research Papers */}
            <div className="grid grid-cols-4 gap-6">
              {/* Projects Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-gray-400 text-sm mb-4">Projects</h3>
                <div className="text-4xl font-bold mb-4">{projects.length}</div>
                <div className="space-y-3">
                  {projects.slice(0, 2).map((project, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-gray-700 text-sm font-medium">{project.title}</p>
                      <div>{getStatusBadge(project.status)}</div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-gray-400 text-sm">No projects yet</p>
                  )}
                </div>
              </div>

              {/* Research Papers Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-gray-400 text-sm mb-4">Research Papers</h3>
                <div className="text-4xl font-bold mb-4">{research.length}</div>
                <div className="space-y-3">
                  {research.slice(0, 2).map((paper, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-gray-700 text-sm font-medium">{paper.title}</p>
                      <div>{getStatusBadge(paper.status)}</div>
                    </div>
                  ))}
                  {research.length === 0 && (
                    <p className="text-gray-400 text-sm">No research papers yet</p>
                  )}
                </div>
              </div>

              {/* Resume Card - Row Span 2 */}
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center row-span-2 min-h-[400px]">
                <h3 className="text-gray-900 text-xl font-bold mb-2">Resume</h3>
                {atsScore && (
                  <div className="mb-4 text-center">
                    <p className="text-xs text-gray-500">ATS Score</p>
                    <p className="text-3xl font-bold">{atsScore.percentage}%</p>
                    <p className="text-xs text-gray-600">{atsScore.rating}</p>
                  </div>
                )}
                <button
                  onClick={handleResumeUpload}
                  disabled={uploadingResume}
                  className="px-6 py-2.5 bg-gray-700 text-white rounded-full hover:bg-gray-800 disabled:bg-gray-400 text-sm font-medium"
                >
                  {uploadingResume ? 'Uploading...' : 'Upload +'}
                </button>
                <div className="mt-4 w-full px-2">
                  <button
                    onClick={handleAtsAnalyzeFromDrive}
                    disabled={atsLoading}
                    className={`w-full px-4 py-2 rounded-full text-xs font-medium border ${
                      atsLoading
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {atsLoading ? 'Analyzing ATS from Drive...' : 'Analyze ATS Score from Drive Link'}
                  </button>
                  {atsError && (
                    <p className="mt-2 text-[11px] text-red-600 text-center">{atsError}</p>
                  )}
                </div>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs text-blue-600 hover:underline"
                  >
                    View Resume
                  </a>
                )}
              </div>

              {/* Performance Doc Card - Row Span 2 */}
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center row-span-2 min-h-[400px]">
                <h3 className="text-gray-900 text-xl font-bold mb-6">Performance Doc</h3>
                <button
                  onClick={handlePerformanceDocUpload}
                  disabled={uploadingPerformance}
                  className="px-6 py-2.5 bg-gray-700 text-white rounded-full hover:bg-gray-800 disabled:bg-gray-400 text-sm font-medium"
                >
                  {uploadingPerformance ? 'Uploading...' : 'Upload +'}
                </button>
                {performanceDocUrl && (
                  <a
                    href={performanceDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs text-blue-600 hover:underline"
                  >
                    View Performance Doc
                  </a>
                )}
              </div>

              {/* Patents Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-gray-400 text-sm mb-4">Patents</h3>
                <div className="text-4xl font-bold mb-4">{patents.length}</div>
                <div className="space-y-3">
                  {patents.slice(0, 2).map((patent, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-gray-700 text-sm font-medium">{patent.title}</p>
                      <div>{getStatusBadge(patent.status)}</div>
                    </div>
                  ))}
                  {patents.length === 0 && (
                    <p className="text-gray-400 text-sm">No patents yet</p>
                  )}
                </div>
              </div>

              {/* Thesis Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-gray-400 text-sm mb-4">Thesis</h3>
                <div className="text-4xl font-bold mb-4">{thesis.length}</div>
                <div className="space-y-3">
                  {thesis.slice(0, 2).map((t, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-gray-700 text-sm font-medium">{t.title}</p>
                      <div>{getStatusBadge(t.status)}</div>
                    </div>
                  ))}
                  {thesis.length === 0 && (
                    <p className="text-gray-400 text-sm">No thesis yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminHome;