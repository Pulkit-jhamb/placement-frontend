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
  const [showSkillType, setShowSkillType] = useState('tech');
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
      <div className="flex min-h-screen bg-[#f5f8fa]">
        <StudentSidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-[#636363]">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f8fa]">
      <StudentSidebar />
      
      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[#636363] text-base mb-1">Welcome,</p>
            <div className="flex justify-between items-start">
              <h1 className="text-[48px] font-bold text-[#181818] leading-tight">{userProfile?.name || 'Student'}</h1>
              <div className="text-right">
                <p className="text-[#636363] text-base leading-relaxed">
                  Branch: <span className="text-[#b6b6b6]">{extractBranchCode(userProfile?.field) || 'RAI'}</span>
                </p>
                <p className="text-[#636363] text-base leading-relaxed">
                  Year: <span className="text-[#181818]">{userProfile?.year?.replace(' Year', '') || '3rd'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Two-Row Grid Layout */}
          <div className="space-y-6">
            {/* First Row */}
            <div className="flex gap-6">
              {/* Academic Performance */}
              <div className="bg-[#d8eefc] rounded-[12px] p-6 relative flex-shrink-0" style={{ width: '380px', height: '220px' }}>
                <button 
                  onClick={() => setShowCGPAModal(true)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <h2 className="text-[20px] font-bold text-[#181818] mb-4">
                  Academic Performance
                </h2>
                <div className="flex justify-center items-center">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="#e0e7ff"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="#4298c7"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${((userProfile?.cgpa || 0) / 10) * 376.99} 376.99`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xs text-[#636363]">CGPA</p>
                      <p className="text-[32px] font-bold text-[#181818] leading-none">{(userProfile?.cgpa || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-[#e3e5e9] rounded-[12px] p-6 flex-shrink-0" style={{ width: '286px', height: '220px' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-bold text-[#181818]">Skills</h2>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setShowSkillType('tech')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        showSkillType === 'tech' 
                          ? 'bg-[#181818] text-white' 
                          : 'bg-transparent text-[#181818]'
                      }`}
                    >
                      Tech
                    </button>
                    <button 
                      onClick={() => setShowSkillType('nontech')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        showSkillType === 'nontech' 
                          ? 'bg-[#181818] text-white' 
                          : 'bg-transparent text-[#181818]'
                      }`}
                    >
                      Non-Tech
                    </button>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {showSkillType === 'tech' ? (
                    userProfile?.techStack && userProfile.techStack.length > 0 ? (
                      userProfile.techStack.slice(0, 3).map((tech, idx) => {
                        const colors = ['#d9f0db', '#fce7d6', '#f4d9da'];
                        return (
                          <div 
                            key={idx} 
                            className="rounded-[16px] px-4 py-2 flex justify-between items-center"
                            style={{ backgroundColor: colors[idx % 3], height: '32px' }}
                          >
                            <span className="text-[#181818] font-medium text-sm">{tech}</span>
                            <span className="w-2 h-2 bg-[#181818] rounded-full"></span>
                          </div>
                        );
                      })
                    ) : topSkills.length > 0 ? (
                      topSkills.map((skill, idx) => {
                        const colors = ['#d9f0db', '#fce7d6', '#f4d9da'];
                        return (
                          <div 
                            key={idx} 
                            className="rounded-[16px] px-4 py-2 flex justify-between items-center"
                            style={{ backgroundColor: colors[idx % 3], height: '32px' }}
                          >
                            <span className="text-[#181818] font-medium text-sm">{skill}</span>
                            <span className="w-2 h-2 bg-[#181818] rounded-full"></span>
                          </div>
                        );
                      })
                    ) : (
                      <div 
                        className="rounded-[16px] px-4 py-2 flex justify-between items-center"
                        style={{ backgroundColor: '#d9f0db', height: '32px' }}
                      >
                        <span className="text-[#181818] font-medium text-sm">Python</span>
                        <span className="w-2 h-2 bg-[#181818] rounded-full"></span>
                      </div>
                    )
                  ) : (
                    userProfile?.skills && userProfile.skills.length > 0 ? (
                      userProfile.skills.slice(0, 3).map((skill, idx) => {
                        const colors = ['#d9f0db', '#fce7d6', '#f4d9da'];
                        return (
                          <div 
                            key={idx} 
                            className="rounded-[16px] px-4 py-2 flex justify-between items-center"
                            style={{ backgroundColor: colors[idx % 3], height: '32px' }}
                          >
                            <span className="text-[#181818] font-medium text-sm">{skill}</span>
                            <span className="w-2 h-2 bg-[#181818] rounded-full"></span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[#636363] text-center py-4 text-sm">No non-tech skills added</p>
                    )
                  )}
                </div>
              </div>

              {/* Patents */}
              <div 
                className="bg-[#f7d7d6] rounded-[12px] p-6 cursor-pointer hover:shadow-md transition-shadow flex-shrink-0" 
                onClick={handlePatentsClick}
                style={{ width: '260px', height: '220px' }}
              >
                <h2 className="text-[20px] font-bold text-[#181818] mb-3">Patents</h2>
                <p className="text-[72px] font-bold text-[#181818] leading-none mb-2">{patents.length}</p>
                <p className="text-[#636363] text-sm">{patents[0]?.title || 'Quantum Chip'}</p>
              </div>

              {/* Work Experience */}
              <div className="bg-[#d7efd8] rounded-[12px] p-6 relative flex-shrink-0" style={{ width: '260px', height: '220px' }}>
                <button 
                  onClick={() => {
                    setEditingExperiences([...workExperience]);
                    setShowWorkExpModal(true);
                  }}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <h2 className="text-[20px] font-bold text-[#181818] mb-3">
                  Work Experience
                </h2>
                <p className="text-[72px] font-bold text-[#181818] leading-none mb-2">{workExperience.length}</p>
                <p className="text-[#636363] text-sm">
                  {workExperience[0] ? `${workExperience[0].title} at ${workExperience[0].company}` : 'Intern at Google'}
                </p>
              </div>
            </div>

            {/* Second Row */}
            <div className="flex gap-6">
              {/* Certifications & Achievements */}
              <div className="bg-[#e3e5e9] rounded-[12px] p-6 relative flex-shrink-0" style={{ width: '380px', height: '440px' }}>
                <button 
                  onClick={() => {
                    setEditingCertifications([...certifications]);
                    setShowCertModal(true);
                  }}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <h2 className="text-[20px] font-bold text-[#181818] mb-4">
                  Certifications & Achievements
                </h2>
                <div className="space-y-3">
                  {certifications.length > 0 ? certifications.slice(0, 3).map((cert, idx) => (
                    <div key={idx}>
                      <p className="text-[#181818] font-bold text-[15px]">
                        {cert.name || cert.title || 'Smart India Hackathon'}
                      </p>
                      <p className="text-[#636363] text-xs">{cert.date || cert.issuedDate || 'Jan 2026'}</p>
                    </div>
                  )) : (
                    <>
                      <div>
                        <p className="text-[#181818] font-bold text-[15px]">Smart India Hackathon</p>
                        <p className="text-[#636363] text-xs">Jan 2026</p>
                      </div>
                      <div>
                        <p className="text-[#181818] font-bold text-[15px]">Smart India Hackathon</p>
                        <p className="text-[#636363] text-xs">Jan 2026</p>
                      </div>
                      <div>
                        <p className="text-[#181818] font-bold text-[15px]">Smart India Hackathon</p>
                        <p className="text-[#636363] text-xs">Jan 2026</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-[#d9dadf] rounded-[12px] p-6 flex flex-col shadow-sm flex-shrink-0" style={{ width: '286px', height: '440px' }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[20px] font-bold text-[#181818]">Resume</h2>
                  <svg
                    className="w-5 h-5 text-[#636363]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <button
                    onClick={handleResumeUpload}
                    disabled={uploadingResume}
                    className="px-6 py-2 bg-[#181818] text-white rounded-full text-sm font-medium hover:bg-[#2c2c2c] transition-colors disabled:opacity-50"
                  >
                    {uploadingResume ? 'Uploading...' : 'Upload +'}
                  </button>
                </div>
              </div>

              {/* Projects */}
              <div 
                className="bg-[#fde3cd] rounded-[12px] p-6 cursor-pointer hover:shadow-md transition-shadow flex-shrink-0" 
                onClick={handleProjectsClick}
                style={{ width: '260px', height: '220px' }}
              >
                <h2 className="text-[20px] font-bold text-[#181818] mb-3">Projects</h2>
                <p className="text-[72px] font-bold text-[#181818] leading-none mb-2">{projects.length}</p>
                <p className="text-[#636363] text-sm">{projects[0]?.title || 'AI Chatbot'}</p>
              </div>

              {/* Resume ATS Score */}
              <div 
                className="bg-[#d6e8f8] rounded-[12px] p-6 cursor-pointer hover:shadow-md transition-shadow flex-shrink-0" 
                onClick={handleResumeClick}
                style={{ width: '260px', height: '220px' }}
              >
                <h2 className="text-[20px] font-bold text-[#181818] mb-3">Resume</h2>
                <p className="text-[72px] font-bold text-[#181818] leading-none mb-2">{atsScore ? `${atsScore.percentage}%` : '88%'}</p>
                <p className="text-[#636363] text-sm">ATS Score</p>
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

      {/* Certifications List Modal */}
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

// Helper function
function extractBranchCode(field) {
  if (!field) return '';
  
  const bracketMatch = field.match(/\(([A-Z]{2,5})\)/);
  if (bracketMatch) {
    return bracketMatch[1];
  }
  
  const capitals = field.match(/[A-Z]/g);
  if (capitals && capitals.length >= 2) {
    return capitals.join('').substring(0, 5);
  }
  
  return field.substring(0, 3).toUpperCase();
}

export default StudentHome;