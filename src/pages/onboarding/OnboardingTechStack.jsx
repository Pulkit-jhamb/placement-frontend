import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function OnboardingTechStack() {
  const [selectedTech, setSelectedTech] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const techStack = [
    { id: "javascript", name: "JavaScript", icon: "JS" },
    { id: "react", name: "React", icon: "⚛️" },
    { id: "angular", name: "Angular", icon: "A" },
    { id: "python", name: "Python", icon: "🐍" },
    { id: "nodejs", name: "Node.js", icon: "node" },
    { id: "django", name: "Django", icon: "django" },
    { id: "express", name: "Express.js", icon: "ex" },
    { id: "restful", name: "RESTful APIs", icon: "API" },
    { id: "git", name: "Git / Version Control", icon: "📁" },
    { id: "cicd", name: "CI/CD", icon: "🔄" },
    { id: "docker", name: "Docker / Containerization", icon: "🐳" },
    { id: "cloud", name: "Cloud Platforms", icon: "☁️" },
    { id: "java", name: "Java", icon: "☕" },
    { id: "cpp", name: "C++", icon: "C++" },
  ];

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_techstack");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert tech names back to IDs
        if (parsedData.techStack && Array.isArray(parsedData.techStack)) {
          const techIds = parsedData.techStack.map(techName => 
            techStack.find(tech => tech.name === techName)?.id
          ).filter(Boolean);
          setSelectedTech(techIds);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever selectedTech changes
  useEffect(() => {
    const selectedNames = selectedTech.map(id => 
      techStack.find(tech => tech.id === id)?.name
    ).filter(Boolean);
    if (selectedNames.length > 0) {
      localStorage.setItem("onboarding_techstack", JSON.stringify({
        techStack: selectedNames
      }));
    }
  }, [selectedTech]);

  const toggleTech = (techId) => {
    setSelectedTech(prev => 
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  const handleNext = async () => {
    if (selectedTech.length === 0) {
      setError("Please select at least one technology");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const selectedNames = selectedTech.map(id => 
        techStack.find(tech => tech.id === id)?.name
      );
      
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        {
          step: "tech_stack",
          data: {
            techStack: selectedNames,
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("onboarding_step6", JSON.stringify({ techStack: selectedNames }));
      navigate("/onboarding/ai-tools");
    } catch (error) {
      console.error("Error saving tech stack:", error);
      setError(error.response?.data?.message || "Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/onboarding/skills");
  };

  const handleSkip = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        { completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("onboardingCompleted", "true");
      navigate("/student/home", { replace: true });
    } catch (err) {
      console.error("Error skipping onboarding:", err);
      setError(err.response?.data?.message || "Failed to skip onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programming Languages & Tools</h1>
          <p className="text-gray-600">Select all languages and technologies you have experience with</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {techStack.map((tech) => (
            <button
              key={tech.id}
              type="button"
              onClick={() => toggleTech(tech.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedTech.includes(tech.id)
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="text-3xl mb-2">{tech.icon}</div>
              <div className="text-sm font-medium text-gray-900">{tech.name}</div>
            </button>
          ))}
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
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
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
