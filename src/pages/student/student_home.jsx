import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Pencil, X } from 'lucide-react';
import axios from 'axios';
import StudentSidebar from './student_sidebar';
import { API_ENDPOINTS } from '../../config';
import AddExperienceModal from '../../components/modals/AddExperienceModal';
import AddResumeModal from '../../components/modals/AddResumeModal';
import AddCertificationModal from '../../components/modals/AddCertificationModal';
import EditCGPAModal from '../../components/modals/EditCGPAModal';

const StudentHome = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [patents, setPatents] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumePreview, setResumePreview] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSkillType, setShowSkillType] = useState('expertise');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showWorkExpModal, setShowWorkExpModal] = useState(false);
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [editingExperiences, setEditingExperiences] = useState([]);
  const [editingCertifications, setEditingCertifications] = useState([]);
  const [editingCertification, setEditingCertification] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [showCGPAModal, setShowCGPAModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [editingCGPA, setEditingCGPA] = useState(0);
  const [atsScore, setAtsScore] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user profile
        const profileResp = await axios.get(API_ENDPOINTS.USER, { headers });
        const userData = profileResp.data;
        setUserProfile(userData);
        setResumeUrl(userData.resumeUrl || '');
        
        // Set work experience from user profile (onboarding data)
        if (userData.experiences && Array.isArray(userData.experiences)) {
          setWorkExperience(userData.experiences);
          setEditingExperiences(userData.experiences);
        }
        
        // Set certifications from user profile (onboarding data)
        if (userData.certifications && Array.isArray(userData.certifications)) {
          setCertifications(userData.certifications);
          setEditingCertifications(userData.certifications);
        }
        
        // Area of expertise and tech stack are already in userData.skills and userData.techStack
        // These come from onboarding and are stored in the user profile

        // Fetch projects
        try {
          const projectsResp = await axios.get(API_ENDPOINTS.PROJECTS, { headers });
          const projectsList = projectsResp.data.projects || [];
          setProjects(projectsList);
          
          // Calculate top 3 skills from projects
          const skillCount = {};
          projectsList.forEach(project => {
            if (project.techStack && Array.isArray(project.techStack)) {
              project.techStack.forEach(skill => {
                skillCount[skill] = (skillCount[skill] || 0) + 1;
              });
            }
          });
          
          const sortedSkills = Object.entries(skillCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([skill]) => skill);
          setTopSkills(sortedSkills);
        } catch (err) {
          console.log('No projects found:', err.message);
          setTopSkills([]);
        }

        // Fetch patents
        try {
          const patentsResp = await axios.get(API_ENDPOINTS.PATENTS, { headers });
          setPatents(patentsResp.data.patents || []);
        } catch (err) {
          console.log('No patents found:', err.message);
          setPatents([]);
        }

        // Work experience is now loaded from user profile above

        // Certifications already loaded above

      } catch (err) {
        console.error('Failed to fetch data:', err);
        console.error('Error response:', err.response?.data);
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleResumeUpload = () => {
    setShowResumeModal(true);
  };

  const handleResumeLinkSubmit = async (resumeLink) => {
    setUploadingResume(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Convert Google Drive link to preview format
      let previewLink = resumeLink;
      if (resumeLink.includes('drive.google.com/file/d/')) {
        const fileId = resumeLink.match(/\/d\/([^\/]+)/);
        if (fileId && fileId[1]) {
          previewLink = `https://drive.google.com/file/d/${fileId[1]}/preview`;
        }
      }
      
      console.log('Uploading resume with URL:', previewLink);
      
      await axios.put(
        API_ENDPOINTS.USER,
        { resumeUrl: previewLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResumeUrl(previewLink);
      setShowResumeModal(false);
      alert('Resume link uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload resume:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to upload resume: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveWorkExperience = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Saving work experience:', editingExperiences);
      
      await axios.put(
        API_ENDPOINTS.USER,
        { experiences: editingExperiences },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkExperience(editingExperiences);
      setShowWorkExpModal(false);
      alert('Work experience updated successfully!');
    } catch (err) {
      console.error('Failed to update work experience:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to update work experience: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleAddExperience = (experienceData) => {
    setEditingExperiences([...editingExperiences, experienceData]);
  };

  const handleRemoveExperience = (index) => {
    setEditingExperiences(editingExperiences.filter((_, i) => i !== index));
  };

  const handleSaveCertifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Saving certifications:', editingCertifications);
      
      await axios.put(
        API_ENDPOINTS.USER,
        { certifications: editingCertifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertifications(editingCertifications);
      setShowCertModal(false);
      alert('Certifications updated successfully!');
    } catch (err) {
      console.error('Failed to update certifications:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to update certifications: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleAddCertification = (certData) => {
    setEditingCertifications([...editingCertifications, certData]);
  };

  const handleEditCertification = (cert, index) => {
    setEditingCertification({ ...cert, index });
    setShowAddCertModal(true);
  };

  const handleUpdateCertification = (certData) => {
    const updatedCerts = [...editingCertifications];
    updatedCerts[editingCertification.index] = certData;
    setEditingCertifications(updatedCerts);
    setEditingCertification(null);
  };

  const handleRemoveCertification = (index) => {
    setEditingCertifications(editingCertifications.filter((_, i) => i !== index));
  };

  const handleSaveCGPA = async (cgpaValue) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Saving CGPA:', cgpaValue);
      
      await axios.put(
        API_ENDPOINTS.USER,
        { cgpa: cgpaValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserProfile({ ...userProfile, cgpa: cgpaValue });
      setShowCGPAModal(false);
      alert('CGPA updated successfully!');
    } catch (err) {
      console.error('Failed to update CGPA:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to update CGPA: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleProjectsClick = () => {
    navigate('/student/projects');
  };

  const handlePatentsClick = () => {
    navigate('/student/patent');
  };

  const handleResumeClick = () => {
    navigate('/student/resume');
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <StudentSidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <StudentSidebar />
      
      {/* Main content with left margin to avoid sidebar overlap */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-8 bg-white">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            {/* About Card */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-sm text-gray-500 mb-3">About</h2>
              <h3 className="text-2xl font-bold mb-3">{userProfile?.name || 'Student'}</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Branch:</span> <span className="font-medium">{extractBranchCode(userProfile?.field) || 'CSE'}</span></p>
                <p><span className="text-gray-500">Year:</span> <span className="font-medium">{userProfile?.year?.replace(' Year', '') || '3rd'}</span></p>
              </div>
            </div>

            {/* Resume Card */}
            <div className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={handleResumeClick}>
              <h2 className="text-sm text-gray-500 mb-3">Resume</h2>
              <h3 className="text-5xl font-bold mb-1">{atsScore ? `${atsScore.percentage}%` : '—'}</h3>
              <p className="text-sm text-gray-600">
                {atsScore ? `ATS Score - ${atsScore.rating}` : 'Upload resume below to get ATS score'}
              </p>
            </div>

            {/* Projects Card */}
            <div className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={handleProjectsClick}>
              <h2 className="text-sm text-gray-500 mb-3">Projects</h2>
              <h3 className="text-5xl font-bold mb-1">{projects.length}</h3>
              <p className="text-sm text-gray-600">{projects[0]?.title || 'AI Chatbot'}</p>
            </div>

            {/* Work Experience Card */}
            <div className="bg-white rounded-xl p-6 relative">
              <button 
                onClick={() => {
                  setEditingExperiences([...workExperience]);
                  setShowWorkExpModal(true);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={16} />
              </button>
              <h2 className="text-sm text-gray-500 mb-3">Work Experience</h2>
              <h3 className="text-5xl font-bold mb-1">{workExperience.length}</h3>
              <p className="text-sm text-gray-600">
                {workExperience[0] ? `${workExperience[0].title} at ${workExperience[0].company}` : 'Intern at Google'}
              </p>
            </div>

            {/* Patents Card */}
            <div className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={handlePatentsClick}>
              <h2 className="text-sm text-gray-500 mb-3">Patents</h2>
              <h3 className="text-5xl font-bold mb-1">{patents.length}</h3>
              <p className="text-sm text-gray-600">{patents[0]?.title || 'Quantum Chip'}</p>
            </div>
          </div>

          {/* Main 3-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Academic Performance */}
            <div className="bg-white rounded-xl p-6 relative">
              <button 
                onClick={() => setShowCGPAModal(true)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={16} />
              </button>
              <h2 className="text-xl font-bold mb-6">Academic Performance</h2>
              
              <div className="flex flex-col items-center justify-center h-full py-8">
                {/* CGPA Circle */}
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="20"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - (userProfile?.cgpa || 0) / 10)}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base text-gray-500 mb-2">CGPA</span>
                    <span className="text-5xl font-bold">{(userProfile?.cgpa || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Certifications & Achievements */}
            <div className="bg-white rounded-xl p-6 relative">
              <button 
                onClick={() => {
                  setEditingCertifications([...certifications]);
                  setShowCertModal(true);
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={16} />
              </button>
              <h2 className="text-xl font-bold mb-6">Certifications & Achievements</h2>
              
              <div className="space-y-4">
                {certifications.length > 0 ? certifications.slice(0, 3).map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-base">{cert.name || cert.title}</h3>
                      <p className="text-sm text-gray-600">{cert.date || cert.issuedDate || 'N/A'}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No certifications added yet
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Resume */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Resume</h2>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8 min-h-[250px] flex items-center justify-center mb-4 relative">
                {resumeUrl ? (
                  <div className="text-center">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900 mb-1">Resume Uploaded</p>
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      View Resume
                    </a>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs text-gray-500">No resume uploaded</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleResumeUpload}
                disabled={uploadingResume}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Upload size={18} />
                {uploadingResume ? 'Uploading...' : 'Upload +'}
              </button>
              <div className="mt-4">
                <button
                  onClick={handleAtsAnalyzeFromDrive}
                  disabled={atsLoading}
                  className={`w-full px-4 py-2 rounded-lg text-xs font-medium border ${
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
            </div>
          </div>

          {/* Bottom 2-column layout - Psychometric & Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Psychometric Results */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Psychometric Results</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                This College student interested in UI/UX design typically exhibit high openness to experience, 
                strong aesthetic sensitivity, empathy for users.
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
              
              {/* Area of Expertise / Tech Stack Toggle */}
              <div className="flex gap-2 mb-6">
                <button 
                  onClick={() => setShowSkillType('expertise')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showSkillType === 'expertise' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Area of Expertise
                </button>
                <button 
                  onClick={() => setShowSkillType('techstack')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showSkillType === 'techstack' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tech Stack
                </button>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {showSkillType === 'expertise' ? (
                  userProfile?.skills && userProfile.skills.length > 0 ? (
                    userProfile.skills.slice(0, 3).map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <span className="text-base font-medium text-gray-900">{skill}</span>
                        <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No area of expertise added</p>
                  )
                ) : (
                  userProfile?.techStack && userProfile.techStack.length > 0 ? (
                    userProfile.techStack.map((tech, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <span className="text-base font-medium text-gray-900">{tech}</span>
                        <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                      </div>
                    ))
                  ) : topSkills.length > 0 ? (
                    topSkills.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <span className="text-base font-medium text-gray-900">{skill}</span>
                        <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No tech stack added</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Resume Upload Modal */}
      <AddResumeModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        onSubmit={handleResumeLinkSubmit}
        currentResumeUrl={resumeUrl}
      />

      {/* Work Experience Edit Modal */}
      {showWorkExpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Edit Work Experience</h2>
              <button onClick={() => setShowWorkExpModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-4">
                {editingExperiences.map((exp, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                    </div>
                    <button onClick={() => handleRemoveExperience(index)} className="text-red-600 hover:text-red-800">
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAddExpModal(true)} className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                + Add Experience
              </button>
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowWorkExpModal(false)} className="flex-1 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSaveWorkExperience} className="flex-1 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      <AddExperienceModal
        isOpen={showAddExpModal}
        onClose={() => setShowAddExpModal(false)}
        onSubmit={handleAddExperience}
      />

      {/* Certifications List Modal - Shows list with add/remove */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Edit Certifications</h2>
              <button onClick={() => setShowCertModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-4">
                {editingCertifications.map((cert, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.name || cert.title}</h3>
                      <p className="text-sm text-gray-600">{cert.date || cert.issuedDate}</p>
                    </div>
                    <button onClick={() => handleRemoveCertification(index)} className="text-red-600 hover:text-red-800">
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAddCertModal(true)} className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                + Add Certification
              </button>
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowCertModal(false)} className="flex-1 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSaveCertifications} className="flex-1 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      <AddCertificationModal
        isOpen={showAddCertModal}
        onClose={() => {
          setShowAddCertModal(false);
          setEditingCertification(null);
        }}
        onSubmit={editingCertification ? handleUpdateCertification : handleAddCertification}
        editingCertification={editingCertification}
      />

      {/* Edit CGPA Modal */}
      <EditCGPAModal
        isOpen={showCGPAModal}
        onClose={() => setShowCGPAModal(false)}
        onSubmit={handleSaveCGPA}
        currentCGPA={userProfile?.cgpa || 0}
      />
    </div>
  );
};

// Helper functions
function formatField(field) {
  if (!field) return '';
  return field.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractBranchCode(field) {
  if (!field) return '';
  
  // Extract capital letters or letters in parentheses
  // Example: "Computer Science (CSE)" -> "CSE"
  // Example: "Information Technology (IT)" -> "IT"
  const bracketMatch = field.match(/\(([A-Z]{2,5})\)/);
  if (bracketMatch) {
    return bracketMatch[1];
  }
  
  // If no brackets, extract capital letters
  const capitals = field.match(/[A-Z]/g);
  if (capitals && capitals.length >= 2) {
    return capitals.join('').substring(0, 5);
  }
  
  // Fallback to first 3 characters
  return field.substring(0, 3).toUpperCase();
}

function formatYear(year) {
  if (!year) return '';
  const n = Number(year);
  if (!n) return year;
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${(s[(v - 20) % 10] || s[v] || s[0])}`;
}

export default StudentHome;