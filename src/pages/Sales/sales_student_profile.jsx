import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import axios from 'axios';
import SalesSidebar from './sales_sidebar';
import { API_ENDPOINTS } from '../../config';

const SalesStudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [showSkillType, setShowSkillType] = useState('expertise');

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        const response = await axios.get(API_ENDPOINTS.SALES_STUDENT_DETAIL(studentId), {
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

  const extractBranchCode = (field) => {
    if (!field) return '';
    const bracketMatch = field.match(/\(([A-Z]{2,5})\)/);
    if (bracketMatch) return bracketMatch[1];
    const capitals = field.match(/[A-Z]/g);
    if (capitals && capitals.length >= 2) return capitals.join('').substring(0, 5);
    return field.substring(0, 3).toUpperCase();
  };

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

  const certifications = student?.certifications || [];
  const workExperience = student?.experiences || [];
  const projects = student?.projects || [];
  const personalProjects = student?.personalProjects || [];
  const totalProjects = projects.length + personalProjects.length;

  return (
    <div className="flex min-h-screen bg-white">
      <SalesSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 bg-white">
          {/* Back Button */}
          <button
            onClick={() => navigate('/sales/students')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Students</span>
          </button>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            {/* About Card */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-sm text-gray-500 mb-3">About</h2>
              <h3 className="text-2xl font-bold mb-3">{student?.name || 'Student'}</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Branch:</span> <span className="font-medium">{extractBranchCode(student?.field) || 'CSE'}</span></p>
                <p><span className="text-gray-500">Year:</span> <span className="font-medium">{student?.year?.replace(' Year', '') || '3rd'}</span></p>
              </div>
            </div>

            {/* Resume Card */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-sm text-gray-500 mb-3">Resume</h2>
              <h3 className="text-5xl font-bold mb-1">{atsScore ? `${atsScore.percentage}%` : '—'}</h3>
              <p className="text-sm text-gray-600">
                {atsScore ? `ATS Score - ${atsScore.rating}` : 'ATS Score'}
              </p>
            </div>

            {/* Projects Card */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-sm text-gray-500 mb-3">Projects</h2>
              <h3 className="text-5xl font-bold mb-1">{totalProjects}</h3>
              <p className="text-sm text-gray-600">{projects[0]?.title || personalProjects[0]?.title || 'AI Chatbot'}</p>
            </div>

            {/* Work Experience Card */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-sm text-gray-500 mb-3">Work Experience</h2>
              <h3 className="text-5xl font-bold mb-1">{workExperience.length}</h3>
              <p className="text-sm text-gray-600">
                {workExperience[0] ? `${workExperience[0].title} at ${workExperience[0].company}` : 'Intern at Google'}
              </p>
            </div>

            {/* Patents Card */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-sm text-gray-500 mb-3">Patents</h2>
              <h3 className="text-5xl font-bold mb-1">{student?.patents?.length || 0}</h3>
              <p className="text-sm text-gray-600">{student?.patents?.[0]?.title || 'Quantum Chip'}</p>
            </div>
          </div>

          {/* Main 3-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Academic Performance */}
            <div className="bg-white rounded-xl p-6">
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
                      strokeDashoffset={2 * Math.PI * 70 * (1 - (student?.cgpa || 0) / 10)}
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
                    <span className="text-5xl font-bold">{(student?.cgpa || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Certifications & Achievements */}
            <div className="bg-white rounded-xl p-6">
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
                {student?.resumeUrl && (
                  <a
                    href={student.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Upload size={16} /> View
                  </a>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-8 min-h-[250px] flex items-center justify-center mb-4">
                {student?.resumeUrl ? (
                  <div className="text-center">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900 mb-1">Resume Uploaded</p>
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
                  student?.skills && student.skills.length > 0 ? (
                    student.skills.slice(0, 3).map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <span className="text-base font-medium text-gray-900">{skill}</span>
                        <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No area of expertise added</p>
                  )
                ) : (
                  student?.techStack && student.techStack.length > 0 ? (
                    student.techStack.map((tech, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <span className="text-base font-medium text-gray-900">{tech}</span>
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
    </div>
  );
};

export default SalesStudentProfile;