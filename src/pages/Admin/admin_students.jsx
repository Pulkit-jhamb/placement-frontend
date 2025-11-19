import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import axios from 'axios';
import AdminSidebar from './admin_sidebar';
import { API_ENDPOINTS } from '../../config';

const AdminStudents = () => {
  console.log('🎯 AdminStudents component rendering...');
  console.log('📍 API_ENDPOINTS.STUDENTS:', API_ENDPOINTS.STUDENTS);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      console.log('🔍 Fetching students from:', API_ENDPOINTS.STUDENTS);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(API_ENDPOINTS.STUDENTS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Students response:', response.data);
      setStudents(response.data.students || []);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to fetch students:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchQuery === '' || 
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = branchFilter === '' || student.field?.includes(branchFilter);
    
    let matchesCgpa = true;
    if (cgpaFilter === '9+') matchesCgpa = student.cgpa >= 9;
    else if (cgpaFilter === '8+') matchesCgpa = student.cgpa >= 8;
    else if (cgpaFilter === '7+') matchesCgpa = student.cgpa >= 7;
    
    const matchesYear = yearFilter === '' || student.year?.includes(yearFilter);
    
    return matchesSearch && matchesBranch && matchesCgpa && matchesYear;
  });

  const getSkillColor = (skill) => {
    const skillLower = skill?.toLowerCase() || '';
    if (skillLower.includes('ai') || skillLower.includes('artificial')) return 'bg-yellow-200 text-yellow-800';
    if (skillLower.includes('python')) return 'bg-orange-200 text-orange-800';
    if (skillLower.includes('ml') || skillLower.includes('machine')) return 'bg-green-200 text-green-800';
    if (skillLower.includes('ui') || skillLower.includes('ux') || skillLower.includes('design')) return 'bg-purple-200 text-purple-800';
    if (skillLower.includes('cloud')) return 'bg-blue-200 text-blue-800';
    return 'bg-gray-200 text-gray-800';
  };

  const extractBranchCode = (field) => {
    if (!field) return 'N/A';
    if (field.includes('RAI')) return 'RAI';
    if (field.includes('CSE') || field.includes('Computer')) return 'CSE';
    if (field.includes('ECE') || field.includes('Electronics')) return 'ECE';
    if (field.includes('ME') || field.includes('Mechanical')) return 'ME';
    if (field.includes('CE') || field.includes('Civil')) return 'CE';
    return field.substring(0, 3).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{students.length}</span> students
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or roll number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 bg-white"
            >
              <option value="">All Branches</option>
              <option value="Computer Science & Engineering (COPC/COSE/COE)">Computer Science & Engineering</option>
              <option value="Computer Science and Business Systems (COBS)">CS and Business Systems</option>
              <option value="Electrical and Computer Engineering (EEC)">Electrical and Computer</option>
              <option value="Electronics and Computer Engineering (ENC)">Electronics and Computer</option>
              <option value="Artificial Intelligence and Machine Learning (AIML)">AI and ML</option>
              <option value="Robotics and Artificial Intelligence (RAI)">Robotics and AI</option>
              <option value="Civil Engineering with Computer Applications (CCA)">Civil with Computer</option>
              <option value="Electronics & Communication Engineering (ECE)">Electronics & Communication</option>
              <option value="Electrical Engineering (ELE)">Electrical Engineering</option>
              <option value="Electronics (Instrumentation & Control) Engineering (EIC)">Electronics (I&C)</option>
              <option value="Electronics Engineering (VLSI Design and Technology) (EVD)">Electronics (VLSI)</option>
              <option value="Mechanical Engineering (MEE)">Mechanical Engineering</option>
              <option value="Mechatronics (MEC)">Mechatronics</option>
              <option value="Civil Engineering (CIE)">Civil Engineering</option>
              <option value="Chemical Engineering (CHE)">Chemical Engineering</option>
              <option value="Biotechnology (BT)">Biotechnology</option>
              <option value="Biomedical Engineering (BME)">Biomedical Engineering</option>
            </select>
            
            <select
              value={cgpaFilter}
              onChange={(e) => setCgpaFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 bg-white"
            >
              <option value="">All CGPA</option>
              <option value="9+">9+</option>
              <option value="8+">8+</option>
              <option value="7+">7+</option>
            </select>
            
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 bg-white"
            >
              <option value="">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button 
                  onClick={fetchStudents}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">No students found</p>
                <p className="text-sm">
                  {searchQuery || branchFilter || cgpaFilter || yearFilter ? 'Try adjusting your filters' : 'No students have registered yet'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CGPA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skills
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projects
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{student.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {extractBranchCode(student.field)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-800 font-bold">
                            {student.cgpa ? student.cgpa.toFixed(1) : '0.0'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
                              student.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-1 rounded text-xs font-medium ${getSkillColor(skill)}`}
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">No skills</span>
                            )}
                            {student.skills && student.skills.length > 3 && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700">
                                +{student.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {student.projects && Array.isArray(student.projects) && student.projects.length > 0 ? (
                              <>
                                {student.projects.slice(0, 2).map((project, idx) => (
                                  <span key={idx} className="text-sm text-gray-700">
                                    • {typeof project === 'string' ? project : project.title || project.name || 'Project'}
                                  </span>
                                ))}
                                {student.projects.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{student.projects.length - 2} more
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm">No projects</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {student.experiences && Array.isArray(student.experiences) && student.experiences.length > 0 ? (
                              <>
                                {student.experiences.slice(0, 2).map((exp, idx) => (
                                  <span key={idx} className="text-sm text-gray-700">
                                    • {typeof exp === 'string' ? exp : exp.company || exp.title || 'Experience'}
                                  </span>
                                ))}
                                {student.experiences.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{student.experiences.length - 2} more
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm">No experience</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => navigate(`/admin/students/${student.id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
