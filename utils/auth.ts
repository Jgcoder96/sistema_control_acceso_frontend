// utils/auth.ts
// Simple logout utility that clears auth tokens and redirects to login page.

export function logout() {
  // Clear stored auth data
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');

  // Optionally clear other cached data here

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
