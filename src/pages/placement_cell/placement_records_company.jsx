import React, { useState } from 'react';
import { Search, Settings, Bell, ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlacementSidebar from './placement_sidebar';

const PlacementRecordsCompany = ({ userName = "Prashant.S.Rana" }) => {
  const navigate = useNavigate();
  const [view, setView] = useState('company'); // 'company' or 'student'
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');

  const placementStats = {
    totalCompanies: 140,
    avgStipend: '₹50,203',
    avgCTC: '₹14,85,630',
    avgPackage: '₹14,45,809',
    medianPackage: '₹14,00,000',
    studentsSelected: 740,
    onCampus: 129,
    ppo: 18,
    distribution: {
      intern: 261,
      fte: 261,
      internFte: 261,
    },
  };

  const companyData = [
    {
      id: 1,
      notificationDate: '07/11/2025',
      companyName: 'ZS Associates',
      typeOfOffer: 'PPO (Summer Intern/Competition)',
      branchesAllowed: 'Not Applicable',
      eligibilityCGPA: 'N.A. (via Campus Beats 25)',
      jobRoles: 'Decision Analytics',
      ctc: '₹14,15,600',
      stipend: 'Above CTC is 1st',
      studentsSelected: 3,
    },
  ];

  const studentData = [
    {
      id: 1,
      name: 'Harshit Dua',
      branch: 'RAI',
      company: 'Mckinsey',
      cgpa: 7.0,
      status: 'Placed',
    },
    {
      id: 2,
      name: 'Durvish Khurana',
      branch: 'ENC',
      company: 'Zomato',
      cgpa: 6.0,
      status: 'In Progress',
    },
  ];

  const handleViewChange = (newView) => {
    if (newView === 'student') {
      navigate('/placement-cell/records/students');
    } else {
      setView(newView);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PlacementSidebar />
      
      <div className="flex-1 bg-white ml-64">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search anything"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2">
              <span className="font-medium text-gray-700">{userName}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Title and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Placements 2025</h1>
            <p className="text-sm text-gray-500 mt-1">Last Updated: 7 Nov 2025</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handleViewChange('company')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                view === 'company'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Company Wise
            </button>
            <button
              onClick={() => handleViewChange('student')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                view === 'student'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student Wise
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Total Unique Companies</h3>
            <p className="text-3xl font-bold text-gray-900">{placementStats.totalCompanies}</p>
            <p className="text-xs text-gray-500 mt-1">On-Campus: {placementStats.onCampus}</p>
            <p className="text-xs text-gray-500">PPO: {placementStats.ppo}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Average Stipend Secured</h3>
            <p className="text-3xl font-bold text-gray-900">{placementStats.avgStipend}</p>
            <p className="text-xs text-gray-500 mt-1">Uses Weighted Averages</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Average CTC Offered</h3>
            <p className="text-3xl font-bold text-gray-900">{placementStats.avgCTC}</p>
            <p className="text-xs text-gray-500 mt-1">Uses Non-Weighted Average</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Average Package Secured</h3>
            <p className="text-3xl font-bold text-gray-900">{placementStats.avgPackage}</p>
            <p className="text-xs text-gray-500 mt-1">Uses Weighted Averages</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Median Package Secured</h3>
            <p className="text-3xl font-bold text-gray-900">{placementStats.medianPackage}</p>
            <p className="text-xs text-gray-500 mt-1">Uses Weighted Averages</p>
          </div>
        </div>

        {/* Students Selected and Distribution */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Students Selected</h3>
            <p className="text-3xl font-bold text-gray-900">{placementStats.studentsSelected}</p>
            <p className="text-xs text-gray-500 mt-1">May Include Multiple offers to same person</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Distribution (Students)</h3>
            <div className="flex items-center gap-8 mt-2">
              <div>
                <p className="text-xs text-gray-500">Intern</p>
                <p className="text-2xl font-bold text-gray-900">{placementStats.distribution.intern}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">FTE</p>
                <p className="text-2xl font-bold text-gray-900">{placementStats.distribution.fte}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Intern+FTE</p>
                <p className="text-2xl font-bold text-gray-900">{placementStats.distribution.internFte}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Intern+FTE(Subject to Performance) are considered as Intern Only offers</p>
          </div>
        </div>

        {/* Placements Data Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Placements Data</h2>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
                <span>Edit</span>
                <Plus size={16} />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>

              {view === 'company' && (
                <>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                  </select>

                  <input
                    type="text"
                    placeholder="e.g., 8.0"
                    value={cgpaFilter}
                    onChange={(e) => setCgpaFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                  />
                </>
              )}

              {view === 'student' && (
                <>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Branch</option>
                    <option value="RAI">RAI</option>
                    <option value="ENC">ENC</option>
                  </select>

                  <select
                    value={cgpaFilter}
                    onChange={(e) => setCgpaFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">CGPA</option>
                    <option value="7+">7+</option>
                    <option value="6+">6+</option>
                  </select>

                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Year</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {view === 'company' ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Notification Date
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Company Name
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Type of Offer
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Branches Allowed
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Eligibility CGPA
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Job Roles
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        CTC/Stipend
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Students Selected
                        <ChevronDown size={14} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyData.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.notificationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.companyName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {company.typeOfOffer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.branchesAllowed}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {company.eligibilityCGPA}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.jobRoles}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>CTC: {company.ctc}</div>
                        <div className="text-xs text-gray-500">{company.stipend}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.studentsSelected}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Student Name
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Branch
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Company Name
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Progress
                        <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        CGPA
                        <ChevronDown size={14} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentData.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="px-4 py-1 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
                          View Profile ⊙
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            student.status === 'Placed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.cgpa.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default PlacementRecordsCompany;