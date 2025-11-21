import React, { useState } from 'react';
import axios from 'axios';
import StudentSidebar from './student_sidebar';
import { API_ENDPOINTS } from '../../config';
import { Upload } from 'lucide-react';

const Resume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setAtsResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a resume file (PDF, DOCX, or TXT)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const response = await axios.post(API_ENDPOINTS.ATS_UPLOAD, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setAtsResult(response.data);
    } catch (err) {
      console.error('ATS upload error:', err);
      const message = err.response?.data?.error || 'Failed to process resume. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 ml-64 bg-[#f6f6f6]">
        <div className="px-6 sm:px-10 py-10 max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-500">Upload your resume and get instant ATS insights</p>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search documents..."
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
              <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900 text-xl">×</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <div className="border-2 border-dashed border-gray-200 rounded-[28px] p-10 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <Upload size={28} className="text-gray-700" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">Upload Resume</h2>
                <p className="text-gray-500 mb-6">Drop your PDF, DOCX, or TXT file here or browse from device</p>
                <label className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-semibold cursor-pointer hover:bg-gray-800">
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="hidden" />
                  Choose File
                </label>
                {file && <p className="mt-3 text-sm text-gray-600">Selected: <span className="font-semibold">{file.name}</span></p>}
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className={`mt-6 w-full md:w-auto px-8 py-3 rounded-full font-semibold ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#fde3cd] text-[#181818] hover:opacity-90'
                  }`}
                >
                  {loading ? 'Analyzing...' : 'Analyze ATS Score'}
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">ATS Summary</h3>
                {atsResult?.ats_score ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Score</p>
                      <p className="text-5xl font-bold text-gray-900">{atsResult.ats_score.percentage}%</p>
                      <p className="text-sm text-gray-600">{atsResult.ats_score.rating}</p>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-gray-900" style={{ width: `${atsResult.ats_score.percentage}%` }}></div>
                    </div>
                    {atsResult.ats_score.recommendations && (
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        {atsResult.ats_score.recommendations.slice(0, 3).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    Upload a resume to view ATS feedback.
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for higher ATS</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    Keep formatting minimal—avoid complex tables or columns.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    Mirror keywords from the job description in skills/experience.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    Export to PDF for consistent parsing unless asked otherwise.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <section className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Resume Preview</h3>
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600 mb-8">
                <div>
                  <p className="text-gray-400 uppercase text-xs tracking-widest mb-2">Name</p>
                  <p className="text-2xl font-semibold text-gray-900">Admin</p>
                  <p>Computer Science Student</p>
                </div>
                <div className="space-y-2">
                  <p>admin@gmail.com</p>
                  <p>+91 98765 XXXXX</p>
                  <p>Patiala, Punjab</p>
                  <p>linkedin.com/in/admin</p>
                </div>
              </div>

              <div className="space-y-8 text-gray-700 leading-relaxed">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h4>
                  <p>Passionate Computer Science student with strong programming skills and experience in web development. Seeking opportunities to apply technical knowledge in real-world projects and contribute to innovative solutions.</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Education</h4>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">Thapar Institute of Engineering & Technology</p>
                      <p className="text-sm text-gray-500">Relevant Coursework: DSA, DBMS, Web Technologies, Software Engineering</p>
                    </div>
                    <div className="text-sm text-gray-500 mt-2 md:mt-0">2022 - 2026 • CGPA: 8.5/10</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Experience</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Software Development Intern</p>
                        <span className="text-sm text-gray-500">Jun 2024 - Aug 2024</span>
                      </div>
                      <p className="text-sm text-gray-500">Tech Solutions Pvt Ltd, Chandigarh</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Software Development Intern</p>
                        <span className="text-sm text-gray-500">Jun 2023 - Aug 2023</span>
                      </div>
                      <p className="text-sm text-gray-500">Tech Solutions Pvt Ltd, Chandigarh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Resume;
