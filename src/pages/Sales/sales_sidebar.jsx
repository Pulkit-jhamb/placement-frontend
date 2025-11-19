import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import { 
  Bot,
  Users,
  Menu,
  X,
  LogOut
} from 'lucide-react';

import { handleLogout } from '../../utils/authHelpers';

const SalesSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [helpTitle, setHelpTitle] = useState('');
  const [helpDescription, setHelpDescription] = useState('');
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpError, setHelpError] = useState(null);

  const menuItems = [
    { icon: Bot, label: 'AI', path: '/sales/ai' },
    { icon: Users, label: 'Students', path: '/sales/students' },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Collapsible */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          ${isOpen ? 'w-44' : 'w-16'}
          bg-gray-50 border-r border-gray-200
          transform transition-all duration-300 ease-in-out z-40
          ${!isOpen && 'lg:translate-x-0'}
          ${!isOpen && 'max-lg:-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="px-4 py-6 flex items-center justify-between">
          {isOpen ? (
            <h1 className="text-xl font-bold text-gray-800">Carevo</h1>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-200 rounded-lg mx-auto"
            >
              <Menu size={20} className="text-gray-700" />
            </button>
          )}
          {isOpen && (
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-200 rounded-lg hidden lg:block"
            >
              <Menu size={18} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-colors duration-150 group
                      ${
                        isActive(item.path)
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                      ${!isOpen && 'justify-center'}
                    `}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon 
                      size={18} 
                      className={`
                        ${isActive(item.path) ? 'text-gray-700' : 'text-gray-500 group-hover:text-gray-700'}
                        flex-shrink-0
                      `}
                    />
                    {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section at Bottom */}
        <div className="px-3 py-4 border-t border-gray-200">
          {isOpen ? (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-700">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Prashant.S.Rana</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">P</span>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setShowHelp(true)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg 
              text-gray-700 hover:bg-gray-100 transition-colors duration-150 group
              ${!isOpen && 'justify-center'}
            `}
            title={!isOpen ? 'Help' : ''}
          >
            <Bot size={18} className="text-gray-500 group-hover:text-gray-700 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Help</span>}
          </button>

          <button
            onClick={() => {
              if (window.innerWidth < 1024) setIsOpen(false);
              handleLogout(navigate);
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
              text-red-600 hover:bg-red-50 transition-colors duration-150 group
              ${!isOpen && 'justify-center'}
            `}
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut size={18} className="text-red-500 group-hover:text-red-600 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

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
    </>
  );
};

export default SalesSidebar;