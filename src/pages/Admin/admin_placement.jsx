import React, { useState } from 'react';
import AdminSidebar from './admin_sidebar';

const AdminPlacement = () => {
  const [viewMode, setViewMode] = useState('student'); // 'student' or 'company'
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <input type="text" placeholder="Search anything" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200" />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg">
              <span className="font-medium text-gray-900">Prashant.S.Rana</span>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Placements 2025</h1>
              <p className="text-gray-600">Last Updated: 7 Nov 2025</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setViewMode('company')} className={`px-6 py-2 rounded-lg ${viewMode === 'company' ? 'bg-black text-white' : 'bg-white border border-gray-300'}`}>
                Company Wise
              </button>
              <button onClick={() => setViewMode('student')} className={`px-6 py-2 rounded-lg ${viewMode === 'student' ? 'bg-black text-white' : 'bg-white border border-gray-300'}`}>
                Student Wise
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Total Unique Companies</p>
              <p className="text-4xl font-bold mb-2">140</p>
              <p className="text-xs text-gray-500">On-Campus: 129</p>
              <p className="text-xs text-gray-500">PPO: 18</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Average Stipend Secured</p>
              <p className="text-4xl font-bold mb-2">₹50,203</p>
              <p className="text-xs text-gray-500">Uses Weighted Averages</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Average CTC Offered</p>
              <p className="text-4xl font-bold mb-2">₹14,85,630</p>
              <p className="text-xs text-gray-500">Uses Non-Weighted Average</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Average Package Secured</p>
              <p className="text-4xl font-bold mb-2">₹14,45,809</p>
              <p className="text-xs text-gray-500">Uses Weighted Averages</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Median Package Secured</p>
              <p className="text-4xl font-bold mb-2">₹14,00,000</p>
              <p className="text-xs text-gray-500">Uses Weighted Averages</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Students Selected</p>
              <p className="text-4xl font-bold mb-2">740</p>
              <p className="text-xs text-gray-500">May include Multiple offers to same person</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-4">Distribution (Students)</p>
              <div className="flex gap-8">
                <div><p className="text-xs text-gray-500 mb-1">Intern</p><p className="text-2xl font-bold">261</p></div>
                <div><p className="text-xs text-gray-500 mb-1">FTE</p><p className="text-2xl font-bold">261</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Intern+FTE</p><p className="text-2xl font-bold">261</p></div>
              </div>
            </div>
          </div>

          {viewMode === 'student' ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6">Placements Data</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">Choose Branch</option>
                    <option value="RAI">RAI</option>
                    <option value="ENC">ENC</option>
                  </select>
                </div>
                <div className="flex-1">
                  <input type="text" value={cgpaFilter} onChange={(e) => setCgpaFilter(e.target.value)} placeholder="CGPA (≤)" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="flex-1">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search company" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Student Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Branch</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Company Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Profile</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Progress</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Harshit Dua</td>
                    <td className="py-4 px-4">RAI</td>
                    <td className="py-4 px-4">Mckinsey</td>
                    <td className="py-4 px-4"><button className="px-4 py-1 bg-black text-white rounded-full text-sm">View Profile 👁</button></td>
                    <td className="py-4 px-4"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Placed</span></td>
                    <td className="py-4 px-4">7.00</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Durvish Khurana</td>
                    <td className="py-4 px-4">ENC</td>
                    <td className="py-4 px-4">Zomato</td>
                    <td className="py-4 px-4"><button className="px-4 py-1 bg-black text-white rounded-full text-sm">View Profile 👁</button></td>
                    <td className="py-4 px-4"><span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">In Progress</span></td>
                    <td className="py-4 px-4">6.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6">Placements Data</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Notification Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Company Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Type of Offer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Branches Allowed</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Eligibility CGPA</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Job Roles</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">CTC/Stipend</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Students Selected</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">07/11/2025</td>
                    <td className="py-4 px-4">ZS Associates</td>
                    <td className="py-4 px-4">PPO<br/><span className="text-xs">(Summer Intern)</span></td>
                    <td className="py-4 px-4">Not Applicable</td>
                    <td className="py-4 px-4">N.A.<br/><span className="text-xs">(via Campus Beats 25)</span></td>
                    <td className="py-4 px-4">Decision Analytics</td>
                    <td className="py-4 px-4">CTC: ₹14,15,600</td>
                    <td className="py-4 px-4 text-center">3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPlacement;