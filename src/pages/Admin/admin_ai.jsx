import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Download } from 'lucide-react';
import AdminSidebar from './admin_sidebar';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../../config';

const AdminAI = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    { title: 'Show Blockchain students', prompt: 'Show me students with Blockchain skills' },
    { title: 'Show AI/ML students', prompt: 'Show me students with AI and ML skills' },
    { title: 'Show UI/UX students', prompt: 'Show me students with UI/UX design skills' },
    { title: 'Show MERN students', prompt: 'Show me students with MERN stack skills' },
    { title: 'Show Fullstack developers', prompt: 'Show me fullstack developers' },
    { title: 'Show React developers', prompt: 'Show me React developers' },
    { title: 'Show DevOps students', prompt: 'Show me students with DevOps skills' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = message) => {
    if (!messageText.trim() || loading) return;

    const userMessage = messageText.trim();
    setMessage('');

    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      // FIXED: Corrected API endpoint
      const response = await axios.post(
        `${API_BASE_URL}/api/ai/admin/chat`,
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { response: aiResponse, students } = response.data;
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: aiResponse,
        data: students || []
      }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExportToExcel = async (students) => {
    if (!students || students.length === 0) {
      alert('No students to export');
      return;
    }

    try {
      setExporting(true);
      
      // Create Excel file data in CSV format for simplicity, or use a library
      // We'll use the backend to create proper Excel
      const token = localStorage.getItem('authToken');
      
      // Send the filtered students data to backend for Excel generation
      const response = await axios.post(
        `${API_BASE_URL}/api/ai/admin/export-filtered-students`,
        { students: students },
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create blob URL and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_filtered_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Export successful');
    } catch (err) {
      console.error('❌ Export failed:', err);
      alert('Failed to export students to Excel');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <main className="flex-1 flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
              <div className="max-w-3xl w-full">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold mb-2 text-gray-900">Good Morning, Sir</h1>
                </div>

                {/* Search Input */}
                <div className="mb-6">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="How can I help you today?"
                      className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                      disabled={loading}
                    />
                    <button 
                      onClick={() => handleSendMessage()}
                      disabled={!message.trim() || loading}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                    <span>Start by asking for skills, students, or profiles</span>
                    <button className="p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Get Started Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm text-gray-600">Get started</h2>
                    <button className="text-gray-400 text-xs">×</button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx} 
                        onClick={() => handleSuggestionClick(suggestion.prompt)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors text-left"
                        disabled={loading}
                      >
                        <p className="text-xs text-gray-700">{suggestion.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl px-4 py-3 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">
                        {msg.content}
                      </div>
                      {msg.data && msg.data.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium">Quick Actions:</p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleExportToExcel(msg.data)}
                                disabled={exporting}
                                className="px-3 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <Download size={12} />
                                {exporting ? 'Exporting...' : 'Export to sheets'}
                              </button>
                              <button 
                                onClick={() => navigate('/admin/students')}
                                className="px-3 py-1 bg-white border border-gray-300 text-gray-900 text-xs rounded hover:bg-gray-50"
                              >
                                View Profiles
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Bottom Input */}
          {messages.length > 0 && (
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Reply..."
                    className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm pr-12"
                    disabled={loading}
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim() || loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAI;