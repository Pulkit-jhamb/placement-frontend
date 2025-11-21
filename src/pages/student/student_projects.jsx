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

  const palette = ['bg-[#d7efff]', 'bg-[#fbd4d3]', 'bg-[#fdecc8]', 'bg-[#d6f5d6]'];

  const renderProjectCard = (project, idx, variant = 'student') => {
    const bgColor = palette[idx % palette.length];
    const isStudent = variant === 'student';

    return (
      <div key={project.id || idx} className="rounded-[24px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow flex flex-col">
        <div className={`${bgColor} h-28 rounded-t-[24px] relative`}>
          {isStudent ? (
            <div className="absolute inset-x-4 top-4 flex justify-between">
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-red-50"
                title="Delete project"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
              <button
                onClick={() => {
                  setEditingProject(project);
                  setIsModalOpen(true);
                }}
                className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-gray-100"
                title="Edit project"
              >
                <Pencil size={16} className="text-gray-700" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleApplyToProject(project)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-gray-100"
              title="Apply"
            >
              <Plus size={16} className="text-gray-700" />
            </button>
          )}
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">{isStudent ? 'ML Project' : 'Professor Project'}</p>
            <h3 className="text-lg font-semibold text-gray-900 leading-snug">{project.title}</h3>
          </div>

          {isStudent ? (
            <p className="text-sm text-gray-500">ML, Python</p>
          ) : (
            <p className="text-sm text-gray-500">{project.professorName || 'Prof. Prashant Singh Rana'}</p>
          )}

          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-900"></span>
              <span>
                {project.techStack?.length
                  ? project.techStack.slice(0, 3).join(', ')
                  : project.category || 'Machine Learning'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-900"></span>
              <span>{project.githubLink || project.websiteLink || 'www.xyz.com'}</span>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={() => (isStudent ? setIsModalOpen(true) : handleApplyToProject(project))}
              className={`${isStudent ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-900 text-white'} w-full py-2.5 rounded-full font-semibold hover:opacity-90 transition`}
            >
              {isStudent ? 'View' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    );
  };

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

      <main className="flex-1 ml-64 bg-[#f6f6f6]">
        <div className="px-6 sm:px-10 py-10 w-full">

          <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Ongoing Projects</h1>
              <p className="text-gray-500">Find all your projects here</p>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-800 hover:text-red-900 text-xl">×</button>
            </div>
          )}

          <section className="mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Your Projects</h2>
                <p className="text-gray-500">Find all your projects here</p>
              </div>
              <div className="flex items-center gap-4">
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                >
                  <Plus size={16} /> Add Project
                </button>
              </div>
            </div>

            {yourProjects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">No projects yet. Add your first project!</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800"
                >
                  <Plus size={18} /> Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayedYourProjects.map((project, idx) => renderProjectCard(project, idx, 'student'))}
              </div>
            )}
          </section>

          {/* <section>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Professor's Projects</h2>
                <p className="text-gray-500">Find all professor's projects here</p>
              </div>
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

            {professorProjects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-300">
                <p className="text-gray-500">No professor projects available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayedProfessorProjects.map((project, idx) => renderProjectCard(project, idx, 'professor'))}
              </div>
            )}
          </section> */}
        </div>
      </main>

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