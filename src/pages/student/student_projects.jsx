import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import StudentSidebar from './student_sidebar';
import AddProjectModal from '../../components/modals/AddProjectModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const Projects = () => {
  const [yourProjects, setYourProjects] = useState([]);
  const [professorProjects, setProfessorProjects] = useState([]);
  const [studentProjects, setStudentProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllYourProjects, setShowAllYourProjects] = useState(false);
  const [showAllProfessorProjects, setShowAllProfessorProjects] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const profileResp = await axios.get(API_ENDPOINTS.USER, { headers });
      setUserProfile(profileResp.data);

      try {
        const projectsResp = await axios.get(API_ENDPOINTS.PROJECTS, { headers });
        setYourProjects(projectsResp.data.projects || []);
      } catch (err) {
        console.log('No projects found');
      }

      // Fetch professor's projects (admin opportunities)
      try {
        const profProjectsResp = await axios.get(API_ENDPOINTS.STUDENT_OPPORTUNITIES.PROJECTS, { headers });
        setProfessorProjects(profProjectsResp.data.projects || []);
      } catch (err) {
        console.log('No professor projects found');
        setProfessorProjects([]);
      }

      setStudentProjects([]);

    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load projects');
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      setError(''); // Clear any previous errors
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const formattedData = {
        title: projectData.projectName,
        githubLink: projectData.githubLink || '',
        websiteLink: projectData.websiteLink || '',
        techStack: projectData.skills || []
      };

      let response;
      if (editingProject && editingProject.id) {
        // Update existing project
        console.log('Updating project:', editingProject.id, formattedData);
        response = await axios.put(
          `${API_ENDPOINTS.PROJECTS}/${editingProject.id}`, 
          formattedData, 
          { headers }
        );
        console.log('Project updated successfully:', response.data);
      } else {
        // Add new project
        console.log('Adding new project:', formattedData);
        response = await axios.post(API_ENDPOINTS.PROJECTS, formattedData, { headers });
        console.log('Project added successfully:', response.data);
      }
      
      await fetchAllData();
      setIsModalOpen(false);
      setEditingProject(null);
      setError(''); // Clear error on success
    } catch (err) {
      console.error('Failed to save project:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to save project. Please try again.');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      console.log('Deleting project:', projectId);
      await axios.delete(`${API_ENDPOINTS.PROJECTS}/${projectId}`, { headers });
      
      // Refresh projects list
      await fetchAllData();
      alert('Project deleted successfully!');
    } catch (err) {
      console.error('Failed to delete project:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to delete project: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleApplyToProject = (project) => {
    if (project.googleFormLink) {
      window.open(project.googleFormLink, '_blank');
    } else {
      alert('Application link not available for this project');
    }
  };

  // Filter projects based on search query
  const filterProjects = (projects) => {
    if (!searchQuery) return projects;
    return projects.filter(project =>
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredYourProjects = filterProjects(yourProjects);
  const filteredProfessorProjects = filterProjects(professorProjects);

  const displayedYourProjects = showAllYourProjects ? filteredYourProjects : filteredYourProjects.slice(0, 4);
  const displayedProfessorProjects = showAllProfessorProjects ? filteredProfessorProjects : filteredProfessorProjects.slice(0, 4);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8 ml-64">
        {/* Header with Search */}
        <header className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-800 hover:text-red-900 text-xl">×</button>
          </div>
        )}

        <>
          {/* Your Projects */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Projects</h2>
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus size={18} />
                  Add Project
                </button>
                {yourProjects.length > 4 && (
                  <button 
                    onClick={() => setShowAllYourProjects(!showAllYourProjects)}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    {showAllYourProjects ? 'Show less' : 'View all'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-6">Find your all projects here</p>
            
            {yourProjects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-4">No projects yet. Add your first project!</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus size={18} />
                  Add Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {displayedYourProjects.map((project, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative">
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="absolute top-2 left-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setIsModalOpen(true);
                      }}
                      className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      title="Edit project"
                    >
                      <Pencil size={16} className="text-gray-700" />
                    </button>
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4 flex flex-col">
                      <h3 className="font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">Your Project</p>
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {project.techStack.slice(0, 3).join(', ')}
                        </div>
                      )}
                      {project.githubLink && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          GitHub Link
                        </div>
                      )}
                      <div className="flex-grow"></div>
                      <button className="w-full mt-3 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Professor's Projects */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Professor's Projects</h2>
              {filteredProfessorProjects.length > 4 && (
                <button 
                  onClick={() => setShowAllProfessorProjects(!showAllProfessorProjects)}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  {showAllProfessorProjects ? 'Show less' : 'View all'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-gray-600 mb-6">Find all professor's projects here</p>
            
            {professorProjects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No professor projects available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {displayedProfessorProjects.map((project, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{project.professorName || 'Professor'}</p>
                      {project.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {project.category}
                        </div>
                      )}
                      {project.description && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {project.description.substring(0, 30)}...
                        </div>
                      )}
                      <button 
                        onClick={() => handleApplyToProject(project)}
                        className="w-full mt-3 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      </main>

      {/* Add/Edit Project Modal */}
      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleAddProject}
        editingProject={editingProject}
      />
    </div>
  );
};

export default Projects;