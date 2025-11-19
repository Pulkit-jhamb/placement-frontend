import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import AddProjectModal from "../../components/modals/AddProjectModal";

export default function OnboardingProjects() {
  const [projects, setProjects] = useState([]);
  const [githubProfile, setGithubProfile] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isInitialMount = useRef(true);
  const navigate = useNavigate();

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_step5");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setProjects(parsedData.projects || []);
        setGithubProfile(parsedData.githubProfile || "");
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever projects or githubProfile changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    localStorage.setItem("onboarding_step5", JSON.stringify({
      projects,
      githubProfile
    }));
  }, [projects, githubProfile]);

  const handleAddProject = (projectData) => {
    const updatedProjects = [...projects, projectData];
    setProjects(updatedProjects);
    // Save immediately to localStorage
    localStorage.setItem("onboarding_step5", JSON.stringify({
      projects: updatedProjects,
      githubProfile
    }));
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    // Save immediately to localStorage
    localStorage.setItem("onboarding_step5", JSON.stringify({
      projects: updatedProjects,
      githubProfile
    }));
  };

  const handleNext = async () => {
    // Validate GitHub URL only if provided
    if (githubProfile.trim()) {
      const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
      if (!githubRegex.test(githubProfile.trim())) {
        setError("Please enter a valid GitHub profile URL (e.g., https://github.com/username)");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        {
          step: "projects",
          data: {
            projects: projects,
            githubProfile: githubProfile,
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("onboarding_step5", JSON.stringify({
        projects,
        githubProfile
      }));
      
      navigate("/onboarding/skills");
    } catch (error) {
      console.error("Error saving projects:", error);
      setError(error.response?.data?.message || "Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleBack = () => {
    navigate("/onboarding/certifications");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About The Work You've Done</h1>
          <p className="text-gray-600">Share your projects and contributions</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <div className="space-y-6">
          {/* Projects List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Your Projects
            </label>
            
            {projects.length > 0 ? (
              <div className="space-y-3 mb-4">
                {projects.map((project, index) => (
                  <div key={index} className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{project.projectName}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    {project.githubLink && (
                      <p className="text-sm text-blue-600 mb-1">
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          GitHub →
                        </a>
                      </p>
                    )}
                    {project.websiteLink && (
                      <p className="text-sm text-blue-600 mb-2">
                        <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Live Demo →
                        </a>
                      </p>
                    )}
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No projects added yet. Click below to add your first project.</p>
            )}
            
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add project
            </button>
          </div>

          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
              Share your GitHub profile link (optional)
            </label>
            <input
              id="github"
              type="url"
              value={githubProfile}
              onChange={(e) => setGithubProfile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="https://github.com/yourusername"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProject}
      />
    </div>
  );
}
