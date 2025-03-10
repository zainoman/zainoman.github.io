export interface Project {
  id: number;
  project_name: string;
  description: string;
  image: string | null; // Base64 encoded image string
  location_id: number;
  status: string;
}

export interface ProjectDetails {
  id: number;
  project_name: string;
  description: string;
  image: string | null;
  location: Location;
  properties: Property[];
}

export interface Property {
  id: number;
  name: string;
  description: string;
  unit_price: number;
  property_for: string;
  project_id: number;
  images: string[]; // Array of Base64 encoded image strings
}

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface ProjectPropertiesResponse {
  properties: Property[];
  total: number;
}