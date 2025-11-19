// API Configuration
// const API_BASE_URL = 'https://carevo-backend.onrender.com';
// const API_BASE_URL = 'https://carevo-backend-8vv2.onrender.com/';

const API_BASE_URL = 'http://localhost:5001';

// API Configuration
export const API_ENDPOINTS = {
  // ==================== AUTHENTICATION ====================
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  AUTH_STATUS: `${API_BASE_URL}/api/auth/status`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // ==================== USER PROFILE ====================
  USER: `${API_BASE_URL}/api/user`,
  
  // ==================== AI ====================
  AI: `${API_BASE_URL}/ai`,
  
  // ==================== HEALTH CHECK ====================
  HEALTH: `${API_BASE_URL}/health`,
  
  // ==================== ATS RESUME UPLOAD ====================
  ATS_UPLOAD: `${API_BASE_URL}/api/ats/upload`,
  ATS_FROM_SAVED_RESUME: `${API_BASE_URL}/api/ats/from_saved_resume`,
  
  // ==================== HELP / SUPPORT ====================
  HELP_REPORTS: `${API_BASE_URL}/api/help/reports`,
  
  // ==================== STUDENT'S PERSONAL DATA ====================
  // Student's own projects (GitHub repos, personal projects)
  PROJECTS: `${API_BASE_URL}/api/user/projects`,
  PATENTS: `${API_BASE_URL}/api/user/patents`,
  WORK_EXPERIENCE: `${API_BASE_URL}/api/user/work-experience`,
  EVENTS: `${API_BASE_URL}/api/user/events`,
  SEMESTERS: `${API_BASE_URL}/api/user/semesters`,
  CURRENT_DATE: `${API_BASE_URL}/api/current-date`,
  
  // ==================== ADMIN ====================
  STUDENTS: `${API_BASE_URL}/api/admin/students`,
  PROFESSORS: `${API_BASE_URL}/api/admin/professors`,
  
  // ==================== ONBOARDING ====================
  ONBOARDING: `${API_BASE_URL}/api/onboarding`,
  ONBOARDING_STATUS: `${API_BASE_URL}/api/onboarding/status`,
  
  // ==================== ADMIN OPPORTUNITIES (NEW) ====================
  // Admin creates these opportunities for students to apply to
  ADMIN_PROJECTS: `${API_BASE_URL}/api/user/admin/projects`,
  ADMIN_RESEARCH: `${API_BASE_URL}/api/user/admin/research`,
  ADMIN_PATENTS: `${API_BASE_URL}/api/user/admin/patents`,
  
  // ==================== STUDENT VIEW OPPORTUNITIES (NEW) ====================
  // Students browse and view opportunities to apply to
  STUDENT_OPPORTUNITIES: {
    PROJECTS: `${API_BASE_URL}/api/student/opportunities/projects`,
    RESEARCH: `${API_BASE_URL}/api/student/opportunities/research`,
    PATENTS: `${API_BASE_URL}/api/student/opportunities/patents`,
  },
  
  // ==================== STUDENT APPLICATIONS (NEW) ====================
  // Students submit applications with resume + submission links
  STUDENT_APPLICATIONS: `${API_BASE_URL}/api/student/applications`,
  
  // ==================== ADMIN APPLICATION MANAGEMENT (NEW) ====================
  // Admin views and manages student applications
  ADMIN_APPLICATIONS: `${API_BASE_URL}/api/admin/applications`,
  ADMIN_APPLICATIONS_EXPORT: `${API_BASE_URL}/api/admin/applications/export`,
  ADMIN_OPPORTUNITIES_APPLICATIONS: (opportunityId, type) => 
    `${API_BASE_URL}/api/admin/opportunities/${opportunityId}/applications?type=${type}`,
};

export default API_ENDPOINTS;