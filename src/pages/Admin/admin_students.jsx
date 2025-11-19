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
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Find students"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-gray-600"
              >
                <option value="">Branch</option>
                <option value="CSE">CSE</option>
                <option value="RAI">RAI</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <select
                value={cgpaFilter}
                onChange={(e) => setCgpaFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-gray-600"
              >
                <option value="">CGPA</option>
                <option value="9+">9+</option>
                <option value="8+">8+</option>
                <option value="7+">7+</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-gray-600"
              >
                <option value="">Year</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
              <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Students</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button 
                onClick={fetchStudents}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
              <div className="mt-4 text-sm text-gray-500">
                Check browser console for more details
              </div>
            </div>
          ) : filteredStudents.length === 0 && students.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
              <div className="text-gray-600 text-lg font-semibold mb-2">No Students Found</div>
              <div className="text-gray-500">No students have registered yet.</div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-700 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left w-12"></th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>Student Name</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span>🔧</span>
                      <span>Skillset</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span>📁</span>
                      <span>Projects</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span>💼</span>
                      <span>Experience</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span>#</span>
                      <span>CGPA</span>
                      <span>⬇️</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">Branch</th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <span>👁️</span>
                      <span>View Profile</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md w-fit">
                          <span>👤</span>
                          <span>{student.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
                            student.skills.slice(0, 3).map((skill, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getSkillColor(skill)}`}
                              >
                                <span>●</span>
                                <span>{skill}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No skills listed</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {student.projects && Array.isArray(student.projects) && student.projects.length > 0 ? (
                            student.projects.slice(0, 2).map((project, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">
                                <span>{typeof project === 'string' ? project : project.title || project.name || 'Project'}</span>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No projects</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {student.experiences && Array.isArray(student.experiences) && student.experiences.length > 0 ? (
                            student.experiences.slice(0, 1).map((exp, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm w-fit">
                                <span>{typeof exp === 'string' ? exp : exp.company || exp.title || 'Experience'}</span>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No experience</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {student.cgpa ? student.cgpa.toFixed(2) : '0.00'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {extractBranchCode(student.field)}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                          className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
