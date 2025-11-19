import React, { useState, useEffect } from 'react';
import { Search, Settings, Bell, ChevronDown, Trash2, ArrowLeft, Bookmark } from 'lucide-react';
import AdminSidebar from './admin_sidebar';

const SavedPage = () => {
  const [saveFolders, setSaveFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewMode, setViewMode] = useState('folders'); // 'folders' or 'students'

  // Load folders from localStorage
  useEffect(() => {
    const savedFolders = localStorage.getItem('saveFolders');
    if (savedFolders) {
      setSaveFolders(JSON.parse(savedFolders));
    } else {
      const defaultFolders = [
        { id: '1', name: 'Saved', students: [] },
        { id: '2', name: 'Google', students: [] },
        { id: '3', name: 'Zomato', students: [] }
      ];
      setSaveFolders(defaultFolders);
      localStorage.setItem('saveFolders', JSON.stringify(defaultFolders));
    }
  }, []);

  const handleDeleteFolder = (folderId) => {
    const updatedFolders = saveFolders.filter(folder => folder.id !== folderId);
    setSaveFolders(updatedFolders);
    localStorage.setItem('saveFolders', JSON.stringify(updatedFolders));
  };

  const handleOpenFolder = (folder) => {
    setSelectedFolder(folder);
    setViewMode('students');
  };

  const handleBackToFolders = () => {
    setViewMode('folders');
    setSelectedFolder(null);
  };

  const handleRemoveStudent = (studentId) => {
    if (!selectedFolder) return;
    
    const updatedFolders = saveFolders.map(folder => {
      if (folder.id === selectedFolder.id) {
        return {
          ...folder,
          students: folder.students.filter(s => s.id !== studentId)
        };
      }
      return folder;
    });
    
    setSaveFolders(updatedFolders);
    localStorage.setItem('saveFolders', JSON.stringify(updatedFolders));
    
    // Update selected folder
    const updatedSelectedFolder = updatedFolders.find(f => f.id === selectedFolder.id);
    setSelectedFolder(updatedSelectedFolder);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-0 py-4">
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
        </div>

        {/* Content */}
        <div className="p-6">
          {viewMode === 'folders' ? (
            // Folders Grid View
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Folders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {saveFolders.map((folder) => (
                  <div key={folder.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Card Content Area */}
                    <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
                      <Bookmark size={48} className="text-gray-400 mb-2" />
                      <span className="text-2xl font-semibold text-gray-900">{folder.name}</span>
                      <span className="text-sm text-gray-500 mt-1">{folder.students.length} student{folder.students.length !== 1 ? 's' : ''}</span>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="p-4 flex items-center justify-between border-t border-gray-200">
                      <button 
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} className="text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleOpenFolder(folder)}
                        className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Students List View
            <>
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleBackToFolders}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedFolder?.name}</h2>
                  <p className="text-sm text-gray-500">{selectedFolder?.students.length} student{selectedFolder?.students.length !== 1 ? 's' : ''} saved</p>
                </div>
              </div>

              {selectedFolder?.students.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                  <Bookmark size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No students saved in this folder</p>
                  <p className="text-gray-500 text-sm mt-2">Go to Students page to add students to this folder</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedFolder?.students.map((student) => (
                    <div key={student.id} className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{student.name} <span className="text-sm font-normal text-gray-600">• {student.year} • {student.branch}</span></h3>
                          <p className="text-gray-600">{student.skills}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleRemoveStudent(student.id)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Bookmark size={18} className="fill-current text-gray-900" />
                          <span className="text-sm font-medium">Saved</span>
                        </button>
                        <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                          View Profile
                        </button>
                        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPage;