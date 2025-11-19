import React from 'react';
import { Search, Settings, Bell, MoreVertical, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import PlacementSidebar from './placement_sidebar';

const PlacementHome = ({ userName = "Dr. Prashant Singh Rana" }) => {
  const notifications = [
    { id: 1, title: 'DOAA', subtitle: 'Meeting tomorrow', time: 'Today', count: 6 },
    { id: 2, title: 'DOSA', subtitle: 'Deadline today', time: 'Today', count: 2 },
  ];

  const placements = [
    { company: 'TCS', date: '10th Nov 2025' },
    { company: 'Nvidia', date: '10th Nov 2025' },
    { company: 'Accenture', date: '7th Nov 2025' },
  ];

  const projects = [
    { name: 'AI Chatbot', status: 'In Progress', statusColor: 'bg-green-100 text-green-700' },
  ];

  const researchPapers = [
    { name: 'AI Chatbot', status: 'In Progress', statusColor: 'bg-green-100 text-green-700' },
    { name: 'Quantum Theory', status: 'Completed', statusColor: 'bg-red-100 text-red-700' },
  ];

  const schedule = [
    { time: '08:00AM', title: 'Infosys Interview Round', duration: '08:00 AM - 09:00 AM' },
    { time: '01:00PM', title: 'Meeting with TCS HR', duration: '01:00 PM - 03:00 PM' },
  ];

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentDay = 12;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Add the Sidebar */}
      <PlacementSidebar />

      {/* Main Content */}
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
          <div className="mb-6">
            <p className="text-gray-500 text-sm">Good Morning,</p>
            <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Projects and Research Papers */}
              <div className="grid grid-cols-2 gap-6">
                {/* Projects */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">1</div>
                  {projects.map((project, idx) => (
                    <div key={idx} className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-600">{project.name}</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${project.statusColor}`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Research Papers */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Research Papers</h2>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">2</div>
                  {researchPapers.map((paper, idx) => (
                    <div key={idx} className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-600">{paper.name}</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${paper.statusColor}`}>
                        {paper.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {notif.title.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{notif.title}</h3>
                          <p className="text-sm text-gray-500">{notif.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{notif.time}</span>
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                          {notif.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placement Update */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Placement Update</h2>
                <div className="space-y-3">
                  {placements.map((placement, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{placement.company}</h3>
                        <p className="text-sm text-gray-500">{placement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Calendar */}
            <div className="space-y-6">
              {/* Calendar */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Nov 2025</h2>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map((day) => (
                    <button
                      key={day}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                        day === currentDay
                          ? 'bg-gray-900 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Today's Schedule */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Wednesday, 12 Nov</h3>
                    <button className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {schedule.map((item, idx) => (
                      <div key={idx}>
                        <div className="text-xs text-gray-500 mb-1">{item.time}</div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlacementHome;