import React, { useState } from 'react';
import { Search, Settings, Bell, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlacementSidebar from './placement_sidebar';

const PlacementRecordsStudent = ({ userName = "Prashant.S.Rana" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');

  const students = [
    { id: 1, name: 'Harshit Dua', branch: 'RAI', company: 'Mckinsey', progress: 'Placed', cgpa: 7.00 },
    { id: 2, name: 'Durvish Khurana', branch: 'ENC', company: 'Zomato', progress: 'In Progress', cgpa: 6.00 }
  ];

  const handleViewChange = (newView) => {
    if (newView === 'company') {
      navigate('/placement-cell/records/companies');
    } else {
      setActiveTab(newView);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PlacementSidebar />
      
      <div className="flex-1 bg-white ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search anything"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
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
                <ChevronDown size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {/* Title and Tabs */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Placements 2025</h2>
              <p className="text-sm text-gray-500 mt-1">Last Updated: 7 Nov 2025</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewChange('company')}
                className={`px-6 py-2 rounded-lg font-medium ${
                  activeTab === 'company' ? 'bg-white text-gray-900' : 'text-gray-600'
                }`}
              >
                Company Wise
              </button>
              <button
                onClick={() => handleViewChange('student')}
                className={`px-6 py-2 rounded-lg font-medium ${
                  activeTab === 'student' ? 'bg-gray-900 text-white' : 'text-gray-600'
                }`}
              >
                Student Wise
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-6 mb-8 mt-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Unique Companies</div>
              <div className="text-4xl font-bold text-gray-900">140</div>
              <div className="text-xs text-gray-500 mt-2">On-Campus: 129</div>
              <div className="text-xs text-gray-500">PPO: 18</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Average Stipend Secured</div>
              <div className="text-4xl font-bold text-gray-900">₹50,203</div>
              <div className="text-xs text-gray-500 mt-2">Uses Weighted Averages</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Average CTC Offered</div>
              <div className="text-4xl font-bold text-gray-900">₹14,85,630</div>
              <div className="text-xs text-gray-500 mt-2">Uses Non-Weighted Average</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Average Package Secured</div>
              <div className="text-4xl font-bold text-gray-900">₹14,45,809</div>
              <div className="text-xs text-gray-500 mt-2">Uses Weighted Averages</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Median Package Secured</div>
              <div className="text-4xl font-bold text-gray-900">₹14,00,000</div>
              <div className="text-xs text-gray-500 mt-2">Uses Weighted Averages</div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <div className="text-sm text-gray-600 mb-1">Students Selected</div>
              <div className="text-4xl font-bold text-gray-900">740</div>
              <div className="text-xs text-gray-500 mt-2">May Include Multiple offers to same person</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-3">Distribution (Students)</div>
              <div className="flex gap-8">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Intern</div>
                  <div className="text-3xl font-bold text-gray-900">261</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">FTE</div>
                  <div className="text-3xl font-bold text-gray-900">261</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Intern+FTE</div>
                  <div className="text-3xl font-bold text-gray-900">261</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-3">Intern+FTE(Subject to Performance) are considered as Intern Only offers</div>
            </div>
          </div>

          {/* Placements Data Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Placements Data</h3>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
                  Edit +
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Choose Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="">— None —</option>
                    <option value="RAI">RAI</option>
                    <option value="ENC">ENC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Search company</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">CGPA (≤)</label>
                  <input
                    type="text"
                    placeholder="e.g., 8.0"
                    value={cgpaFilter}
                    onChange={(e) => setCgpaFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Student Name ⇅</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Branch ⇅</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Company Name ⇅</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Progress ⇅</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">CGPA ⇅</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">{idx + 1}</span>
                          <span className="font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{student.branch}</td>
                      <td className="px-6 py-4 text-gray-900">{student.company}</td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 flex items-center gap-1">
                          View Profile ⚲
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          student.progress === 'Placed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {student.progress}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{student.cgpa.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlacementRecordsStudent;