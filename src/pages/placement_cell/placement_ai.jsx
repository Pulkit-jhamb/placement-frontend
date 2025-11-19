import React, { useState } from 'react';
import { Search, Settings, Bell, ArrowRight } from 'lucide-react';
import Placement from '../student/student_placement';   
import PlacementSidebar from './placement_sidebar';

const AIPage = ({ userName = "Prashant.S.Rana" }) => {
  const [query, setQuery] = useState('');

  const suggestions = [
    {
      title: 'Enhance Your Skills',
      description: 'Get personalized suggestion on skills and activities to excel in based on your college profile and achievements.',
    },
    {
      title: 'Career Guidance',
      description: 'Get personalized Guidance Based on your major, interests and personal goals.',
    },
    {
      title: 'Felling Stresses?',
      description: 'Get support for managing college stress, placement anxiety, and maintaining mental well-being.',
    },
  ];

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
      <main className="p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl w-full">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Hi Sir, how can I help you?
            </h1>
            <p className="text-lg text-gray-500">
              I,m here to assist you with students information, careers and more.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask or find anything from your workspace...."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <ArrowRight size={24} />
              </button>
            </div>
          </div>

          {/* Suggestion Cards */}
          <div className="grid grid-cols-3 gap-6">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="p-6 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {suggestion.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {suggestion.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default AIPage;
