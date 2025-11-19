import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function OnboardingAITools() {
  const [selectedTools, setSelectedTools] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const aiTools = [
    { id: "chatgpt", name: "ChatGPT", icon: "💬" },
    { id: "claude", name: "Claude", icon: "✨" },
    { id: "gemini", name: "Gemini", icon: "💎" },
    { id: "cursor", name: "Cursor", icon: "🖱️" },
    { id: "windsurf", name: "Windsurf", icon: "🏄" },
    { id: "lovable", name: "Lovable", icon: "❤️" },
    { id: "v0", name: "v0 by Vercel", icon: "v0" },
    { id: "copilot", name: "Copilot", icon: "🤖" },
    { id: "perplexity", name: "Perplexity AI", icon: "🔍" },
    { id: "huggingface", name: "Hugging Face Models", icon: "🤗" },
  ];

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_aitools");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert tool names back to IDs
        if (parsedData.aiTools && Array.isArray(parsedData.aiTools)) {
          const toolIds = parsedData.aiTools.map(toolName => 
            aiTools.find(tool => tool.name === toolName)?.id
          ).filter(Boolean);
          setSelectedTools(toolIds);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever selectedTools changes
  useEffect(() => {
    const selectedNames = selectedTools.map(id => 
      aiTools.find(tool => tool.id === id)?.name
    ).filter(Boolean);
    if (selectedNames.length > 0) {
      localStorage.setItem("onboarding_aitools", JSON.stringify({
        aiTools: selectedNames
      }));
    }
  }, [selectedTools]);

  const toggleTool = (toolId) => {
    setSelectedTools(prev => 
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const selectedNames = selectedTools.map(id => 
        aiTools.find(tool => tool.id === id)?.name
      );
      
      // Final onboarding call to mark as complete
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        {
          step: "ai_tools",
          data: {
            aiTools: selectedNames,
          },
          completed: true  // Mark onboarding as completed
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("onboarding_step7", JSON.stringify({ aiTools: selectedNames }));
      localStorage.setItem("onboardingCompleted", "true");
      
      // Clear temporary onboarding data
      for (let i = 1; i <= 7; i++) {
        localStorage.removeItem(`onboarding_step${i}`);
      }

      navigate("/student/home");
    } catch (error) {
      console.error("Error saving AI tools:", error);
      setError(error.response?.data?.message || "Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/onboarding/tech-stack");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tools You've Worked With</h1>
          <p className="text-gray-600">Select all AI tools you have experience with</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 mb-6">
          {aiTools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => toggleTool(tool.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedTools.includes(tool.id)
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="text-3xl mb-2">{tool.icon}</div>
              <div className="text-sm font-medium text-gray-900">{tool.name}</div>
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
            onClick={handleFinish}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Finishing..." : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
}
