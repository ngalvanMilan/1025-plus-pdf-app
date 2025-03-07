// Configuration for the frontend application
const config = {
  // API URL from environment variable with fallback to localhost
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
};

export default config; 