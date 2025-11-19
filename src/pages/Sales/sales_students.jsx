import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Users, Download } from 'lucide-react';
import axios from 'axios';
import SalesSidebar from './sales_sidebar';
import { API_ENDPOINTS } from '../../config';

const SalesStudents = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await axios.get(API_ENDPOINTS.STUDENTS, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const formattedStudents = response.data.students.map(student => ({
          id: student.id,
          name: student.name || 'Harshit Dua',
          branch: student.branch || student.degree || 'RAI',
          skills: Array.isArray(student.skills) 
            ? student.skills 
            : (student.skills ? student.skills.split(',').map(s => s.trim()) : ['Python', 'ML', 'AI']),
          projects: Array.isArray(student.projects)
            ? student.projects.map(p => typeof p === 'string' ? p : p.name || p.title)
            : ['Ai Chatbot', 'Medical Supply Drone'],
          experience: Array.isArray(student.workExperience)
            ? student.workExperience.map(w => typeof w === 'string' ? w : w.company || w.title)
            : ['Intern At Google'],
          cgpa: student.cgpa || 6.90
        }));
        
        setStudents(formattedStudents);
      } catch (err) {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchQuery === '' || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === '' || student.branch === branchFilter;
    let matchesCgpa = true;
    if (cgpaFilter === '9+') matchesCgpa = student.cgpa >= 9;
    else if (cgpaFilter === '8+') matchesCgpa = student.cgpa >= 8;
    else if (cgpaFilter === '7+') matchesCgpa = student.cgpa >= 7;
    return matchesSearch && matchesBranch && matchesCgpa;
  });

  const getSkillColor = (skill) => {
    const colors = {
      'Python': 'bg-red-200 text-red-800',
      'ML': 'bg-green-200 text-green-800',
      'AI': 'bg-yellow-200 text-yellow-800'
    };
    return colors[skill] || 'bg-gray-200 text-gray-800';
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(`http://localhost:5001/api/admin/export-students`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create blob URL and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Export successful');
    } catch (err) {
      console.error('❌ Export failed:', err);
      alert('Failed to export students to Excel');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SalesSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="">Branch</option>
                <option value="CSE">CSE</option>
                <option value="RAI">RAI</option>
                <option value="ECE">ECE</option>
              </select>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <select
                value={cgpaFilter}
                onChange={(e) => setCgpaFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="">CGPA</option>
                <option value="9+">9+</option>
                <option value="8+">8+</option>
                <option value="7+">7+</option>
              </select>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="">Year</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
              </select>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportToExcel}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Exporting...' : 'Export to Excel'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-700 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left w-12"></th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
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
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md w-fit">
                        <Users className="w-4 h-4" />
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {student.skills.map((skill) => (
                          <div
                            key={skill}
                            className={`flex items-center justify-between px-3 py-1 rounded-full text-sm font-medium ${getSkillColor(skill)}`}
                          >
                            <span>{skill}</span>
                            <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {student.projects.map((project, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md">
                            <span className="text-sm">{project}</span>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md w-fit">
                        <span className="text-sm">{student.experience[0]}</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{student.cgpa.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-700">{student.branch}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/sales/students/${student.id}`)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesStudents;