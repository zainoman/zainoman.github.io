import { Platform } from 'react-native';

const BASE_URL = 'https://odoosahab-al-zain-realestate-stage-18771559.dev.odoo.com';

export const getImageUrl = (base64String: string): string => {
  try {
    // Handle empty or invalid input
    if (!base64String || typeof base64String !== 'string') {
      return '';
    }

    // If already a valid URL or data URL, return as is
    if (base64String.startsWith('http') || base64String.startsWith('data:image/')) {
      return base64String;
    }

    // Clean the base64 string
    const cleanBase64 = base64String.replace(/^data:image\/\w+;base64,/, '');

    // Platform specific handling
    if (Platform.OS === 'web') {
      return `data:image/jpeg;base64,${cleanBase64}`;
    } else {
      // For React Native mobile platforms
      const decodedData = atob(cleanBase64);
      const bytes = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        bytes[i] = decodedData.charCodeAt(i);
      }

      let mimeType = 'image/jpeg';
      if (bytes[0] === 0x89 && bytes[1] === 0x50) mimeType = 'image/png';
      if (bytes[0] === 0x47 && bytes[1] === 0x49) mimeType = 'image/gif';

      return `data:${mimeType};base64,${cleanBase64}`;
    }
  } catch (error) {
    console.error('Error processing image:', error);
    return '';
  }
};

const processImages = (data: any): any => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => processImages(item));
  }
  
  if (typeof data === 'object') {
    const processed = { ...data };
    for (const key in processed) {
      if (typeof processed[key] === 'string' && processed[key].includes('base64')) {
        processed[key] = getImageUrl(processed[key]);
      } else if (typeof processed[key] === 'object') {
        processed[key] = processImages(processed[key]);
      }
    }
    return processed;
  }
  
  return data;
};

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
    return processImages(data);
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
