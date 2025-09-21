import axios from 'axios';

// The base URL of your running FastAPI backend
export const API_BASE_URL = "http://localhost:8000";

// Create a reusable Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;