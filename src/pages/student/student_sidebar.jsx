import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import { 
  Home,
  Bot,
  FolderKanban,
  FlaskConical,
  Lightbulb,
  FileText,
  Brain,
  X,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { handleLogout } from '../../utils/authHelpers';

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [helpTitle, setHelpTitle] = useState('');
  const [helpDescription, setHelpDescription] = useState('');
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpError, setHelpError] = useState(null);

  const menuItems = [
    {
      name: 'Home',
      path: '/student/home',
      icon: <Home size={20} />
    },
    {
      name: 'Projects',
      path: '/student/projects',
      icon: <FolderKanban size={20} />
    },
    {
      name: 'Research Paper',
      path: '/student/research',
      icon: <FlaskConical size={20} />
    },
    {
      name: 'Patent',
      path: '/student/patent',
      icon: <Lightbulb size={20} />
    },
    // {
    //   name: 'Psychometric',
    //   path: '/student/psychometric',
    //   icon: <Brain size={20} />
    // }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    if (!helpTitle.trim() || !helpDescription.trim()) {
      setHelpError('Please fill in both title and description');
      return;
    }

    try {
      setHelpLoading(true);
      setHelpError(null);
      const token = localStorage.getItem('authToken');
      await axios.post(
        API_ENDPOINTS.HELP_REPORTS,
        { title: helpTitle.trim(), description: helpDescription.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHelpTitle('');
      setHelpDescription('');
      setShowHelp(false);
      alert('Help request submitted successfully');
    } catch (err) {
      console.error('Failed to submit help request:', err);
      const msg = err.response?.data?.message || 'Failed to submit help request';
      setHelpError(msg);
    } finally {
      setHelpLoading(false);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0 fixed top-0 left-0 h-screen overflow-y-auto z-40 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 cursor-pointer" onClick={() => navigate('/student/home')}>
        Carevo
      </h1>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Help & Logout */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={() => setShowHelp(true)}
          className="w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <HelpCircle size={20} />
          <span>Help</span>
        </button>
        <button
          onClick={() => handleLogout(navigate)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-sm font-semibold text-gray-900">Need Help?</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleHelpSubmit} className="px-4 py-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={helpTitle}
                  onChange={(e) => setHelpTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  placeholder="Short summary of your issue"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={helpDescription}
                  onChange={(e) => setHelpDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                  placeholder="Describe the problem or request in detail"
                />
              </div>
              {helpError && (
                <p className="text-xs text-red-600">{helpError}</p>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={helpLoading}
                  className="px-3 py-1.5 text-xs rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {helpLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};

export default StudentSidebar;