/**
 * Intercepts and prevents unauthorized API calls
 * Prevents 401 errors on page load for non-authenticated users
 */

export const setupAuthInterceptor = async () => {
  if (typeof window === 'undefined') return;

  // Check if user is authenticated before making sensitive calls
  const isAuthenticated = async () => {
    try {
      const result = await base44.auth.isAuthenticated();
      return result;
    } catch (e) {
      return false;
    }
  };

  // Cache auth status
  const authStatus = await isAuthenticated();
  window.__authStatus = authStatus;

  // Only fetch user data if authenticated
  if (authStatus) {
    try {
      const user = await base44.auth.me();
      window.__currentUser = user;
    } catch (e) {
      console.warn('Could not fetch user data');
    }
  }
};

// Call this in main.jsx before rendering
export default setupAuthInterceptor;