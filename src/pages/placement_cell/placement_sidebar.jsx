import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Briefcase, Users, Bot, LogOut } from 'lucide-react';
import { handleLogout } from '../../utils/authHelpers';

const PlacementSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/placement-cell/home' },
    { id: 'chat', icon: MessageSquare, label: 'Chat', path: '/placement-cell/chat' },
    { id: 'placement', icon: Briefcase, label: 'Placement', path: '/placement-cell/records/companies' },
    { id: 'students', icon: Users, label: 'Students', path: '/placement-cell/student-database' },
    { id: 'ai', icon: Bot, label: 'AI', path: '/placement-cell/ai' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => navigate('/placement-cell/home')}>
          Carevo
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => handleLogout(navigate)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default PlacementSidebar;