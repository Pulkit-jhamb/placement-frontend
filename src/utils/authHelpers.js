/**
 * Logout utility function
 * Clears all authentication data and redirects to login page
 */
export const handleLogout = (navigate) => {
  // Clear all localStorage items
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userType');
  localStorage.removeItem('profileCompleted');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  console.log('🚪 User logged out successfully');
  
  // Force a full page reload to clear all cached state and axios interceptors
  // This ensures no old tokens or state persist
  window.location.href = '/login';
};