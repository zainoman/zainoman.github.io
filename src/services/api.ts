import axios from 'axios';
import { Project, ProjectDetails, Property, Location, ProjectPropertiesResponse } from '../types/api';

const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? '' // Empty base URL will use the proxy in development
  : 'https://odoosahab-al-zain-realestate-stage-18771559.dev.odoo.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // Increased timeout to 15 seconds
  withCredentials: true, // Important for CORS with credentials
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    if (error.response.status === 404) {
      throw new Error('Resource not found.');
    }
    if (error.response.status === 403) {
      throw new Error('Access denied. Please check your permissions.');
    }
    if (error.response.status === 401) {
      throw new Error('Unauthorized. Please authenticate.');
    }
    throw new Error(error.response?.data?.error || 'An unexpected error occurred.');
  }
);

// Add request interceptor to handle errors before they occur
api.interceptors.request.use(
  config => {
    // Ensure headers are properly set
    config.headers = {
      ...config.headers,
      'X-Requested-With': 'XMLHttpRequest',
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const projectsApi = {
  // Get all projects with optional search
  getAllProjects: async (searchQuery?: string): Promise<Project[]> => {
    try {
      const response = await api.get('/api/projects', {
        params: searchQuery ? { search_query: searchQuery } : undefined,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch projects');
    }
  },

  // Get project details by ID
  getProjectDetails: async (projectId: number): Promise<ProjectDetails> => {
    try {
      const response = await api.get(`/api/project/${projectId}/details`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch project details');
    }
  },

  // Get property by ID
  getProperty: async (propertyId: number): Promise<Property> => {
    try {
      const response = await api.get(`/api/property/${propertyId}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch property');
    }
  },

  // Get project location
  getProjectLocation: async (projectId: number): Promise<Location> => {
    try {
      const response = await api.get(`/api/project/${projectId}/location`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch project location');
    }
  },

  // Get project properties with optional filters
  getProjectProperties: async (
    projectId: number,
    filters?: {
      search_name?: string;
      min_price?: number;
      max_price?: number;
      property_for?: string;
    }
  ): Promise<ProjectPropertiesResponse> => {
    try {
      const response = await api.get(`/api/project/${projectId}/properties`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch project properties');
    }
  },
};