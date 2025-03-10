import { Platform } from 'react-native';

const BASE_URL = 'https://odoosahab-al-zain-realestate-stage-18771559.dev.odoo.com';

 


async function fetchWithError(endpoint: string) {
  try {
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('Fetching:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}

export async function fetchProjects(searchQuery?: string) {
  const params = searchQuery ? `?search_query=${encodeURIComponent(searchQuery)}` : '';
  return fetchWithError(`/api/projects${params}`);
}

export async function fetchProjectDetails(projectId: number) {
  return fetchWithError(`/api/project/${projectId}/details`);
}

export async function fetchProperty(propertyId: number) {
  return fetchWithError(`/api/property/${propertyId}`);
}

export async function fetchProjectLocation(projectId: number) {
  return fetchWithError(`/api/project/${projectId}/location`);
}

export async function fetchProjectProperties(projectId: number, params?: {
  searchName?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyFor?: string;
}) {
  const url = new URL(`/api/project/${projectId}/properties`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, String(value));
    });
  }
  return fetchWithError(url.pathname + url.search);
}
