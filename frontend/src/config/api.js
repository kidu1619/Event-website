// Centralized API configuration for desktop and mobile network accessibility

export const getApiBase = () => {
  // If explicitly set via environment variable
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // When accessed via browser:
  // Using relative '/api' leverages Vite's dev server proxy to localhost:5000.
  // This allows mobile devices connected to http://<LAN-IP>:5173 to seamlessly
  // communicate with the backend without CORS or loopback (127.0.0.1) mismatch errors!
  return '/api';
};

export const API_BASE = getApiBase();
export default API_BASE;
