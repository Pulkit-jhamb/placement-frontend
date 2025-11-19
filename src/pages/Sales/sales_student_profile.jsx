import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Settings, Bell, ChevronDown, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import SalesSidebar from './sales_sidebar';
import { API_ENDPOINTS } from '../../config';

const SalesStudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        const response = await axios.get(`${API_ENDPOINTS.STUDENTS}/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStudent(response.data);
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError('Failed to load student profile');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentProfile();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <SalesSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Loading student profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex min-h-screen bg-white">
        <SalesSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
            <button 
              onClick={() => navigate('/sales/students')}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Back to Students
            </button>
          </div>
        </main>
      </div>
    );
  }

  const semesters = [
    { name: 'Semester I', sgpa: 7.00, color: 'bg-gray-800' },
    { name: 'Semester II', sgpa: 7.00, color: 'bg-cyan-500' },
    { name: 'Semester III', sgpa: 7.00, color: 'bg-gray-300' },
    { name: 'Semester IV', sgpa: 7.00, color: 'bg-gray-300' }
  ];

  const certifications = [
    { name: 'Smart India Hackathon', date: 'Jan 2026' },
    { name: 'Smart India Hackathon', date: 'Jan 2026' },
    { name: 'Smart India Hackathon', date: 'Jan 2026' }
  ];

  const skills = {
    tech: [
      { name: 'Python', proficiency: 90 },
      { name: 'AI', proficiency: 85 },
      { name: 'ML', proficiency: 80 }
    ],
    nonTech: []
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalesSidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search anything"
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <span className="font-medium">Prashant.S.Rana</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* About Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm text-gray-500 font-medium">About</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <h3 className="text-2xl font-bold mb-3">{student.name || 'Harshit Dua'}</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-sm text-gray-500 w-16">Branch:</span>
                  <span className="text-sm font-medium text-gray-900">{student.branch || 'RAI'}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-sm text-gray-500 w-16">Year:</span>
                  <span className="text-sm font-medium text-gray-900">{student.year || '3rd'}</span>
                </div>
              </div>
              <button className="mt-4 text-gray-400 hover:text-gray-600">
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Resume Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm text-gray-500 font-medium">Resume</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <h3 className="text-5xl font-bold mb-2">88%</h3>
              <p className="text-sm text-gray-600">ATS Score</p>
            </div>

            {/* Projects Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm text-gray-500 font-medium">Projects</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <h3 className="text-5xl font-bold mb-2">{student.projects?.length || 2}</h3>
              <p className="text-sm text-gray-600">AI Chatbot</p>
            </div>

            {/* Work Experience Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm text-gray-500 font-medium">Work Experience</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <h3 className="text-5xl font-bold mb-2">{student.workExperience?.length || 3}</h3>
              <p className="text-sm text-gray-600">Intern at Google</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Academic Performance & Certifications */}
            <div className="lg:col-span-2 space-y-6">
              {/* Academic Performance */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-1">Academic Performance</h2>
                <p className="text-sm text-gray-600 mb-6">Semester wise</p>
                
                <div className="flex items-start gap-8">
                  {/* CGPA Circle */}
                  <div className="relative w-40 h-40 flex-shrink-0">
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
                        strokeDashoffset={2 * Math.PI * 70 * (1 - (student.cgpa || 6.9) / 10)}
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
                      <span className="text-xs text-gray-500 mb-1">CGPA</span>
                      <span className="text-3xl font-bold">{(student.cgpa || 6.90).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Semester List */}
                  <div className="flex-1 space-y-4">
                    {semesters.map((sem, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${sem.color}`}></div>
                          <span className="text-sm text-gray-700">{sem.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">SGPA: {sem.sgpa.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certifications & Achievements */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Certifications & Achievements</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-sm text-gray-600">{cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychometric Results */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Psychometric Results</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  This College student interested in UI/UX design typically exhibit high openness to experience, 
                  strong aesthetic sensitivity, empathy for users.
                </p>
              </div>
            </div>

            {/* Right Column - Resume & Skills */}
            <div className="space-y-6">
              {/* Resume Preview */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Resume</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ChevronDown size={20} />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[500px] flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-gray-500 mb-2">Resume Preview</p>
                    <p className="text-xs text-gray-400">JOHN DOE</p>
                    <p className="text-xs text-gray-400 mt-1">Full Stack Developer</p>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Download Resume
                </button>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Skills</h2>
                
                {/* Tech / Non-Tech Toggle */}
                <div className="flex gap-2 mb-4">
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                    Tech
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Non-Tech
                  </button>
                </div>

                {/* Skills List */}
                <div className="space-y-3">
                  {skills.tech.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                      <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesStudentProfile;