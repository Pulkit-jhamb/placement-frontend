import React, { useState, useEffect } from 'react';

const AddProjectModal = ({ isOpen, onClose, onSubmit, editingProject }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    githubLink: '',
    websiteLink: '',
    skills: []
  });

  // Populate form when editing a project
  useEffect(() => {
    if (editingProject) {
      setFormData({
        projectName: editingProject.title || '',
        githubLink: editingProject.githubLink || '',
        websiteLink: editingProject.websiteLink || '',
        skills: editingProject.techStack || []
      });
    } else {
      // Reset form when not editing
      setFormData({
        projectName: '',
        githubLink: '',
        websiteLink: '',
        skills: []
      });
    }
  }, [editingProject, isOpen]);

  const techStackOptions = [
    "JavaScript", "React", "Angular", "Python", "Node.js", 
    "Django", "Express.js", "RESTful APIs", "Git / Version Control",
    "CI/CD", "Docker / Containerization", "Cloud Platforms",
    "Java", "C++"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleSkill = (skill) => {
    setFormData(prev => {
      const isSelected = prev.skills.includes(skill);
      if (isSelected) {
        return {
          ...prev,
          skills: prev.skills.filter(s => s !== skill)
        };
      } else if (prev.skills.length < 3) {
        return {
          ...prev,
          skills: [...prev.skills, skill]
        };
      }
      return prev;
    });
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate GitHub URL only if provided
    if (formData.githubLink.trim()) {
      const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/;
      if (!githubRegex.test(formData.githubLink.trim())) {
        setError("Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)");
        return;
      }
    }

    onSubmit(formData);
    // Reset form
    setFormData({
      projectName: '',
      githubLink: '',
      websiteLink: '',
      skills: []
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{editingProject ? 'Edit project' : 'Add project'}</h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-6">* Indicates required</p>

          {/* Project Name */}
          <div className="mb-6">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project name*
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* GitHub Link */}
          <div className="mb-6">
            <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-2">
              GitHub link (optional)
            </label>
            <input
              type="url"
              id="githubLink"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Website/Deployed Link */}
          <div className="mb-6">
            <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-700 mb-2">
              Website (deployed link)
            </label>
            <input
              type="url"
              id="websiteLink"
              name="websiteLink"
              value={formData.websiteLink}
              onChange={handleChange}
              placeholder="https://your-project.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Skills</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select your top 3 skills used in this project from your tech stack.
            </p>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {techStackOptions.map((tech) => {
                const isSelected = formData.skills.includes(tech);
                const isDisabled = !isSelected && formData.skills.length >= 3;
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleToggleSkill(tech)}
                    disabled={isDisabled}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>

            {formData.skills.length > 0 && (
              <p className="text-sm text-gray-500">
                {formData.skills.length} of 3 skills selected
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
              {error}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
