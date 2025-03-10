export interface Project {
  id: number;
  project_name: string;
  description: string;
  image: string | null;
}

export interface ProjectDetails extends Project {
  address: string;
  start_date: string | null;
  delivery_date: string | null;
}

export interface Property {
  id: number;
  name: string;
  description: string;
  unit_price: number;
  property_for: string;
  project_id: number;
  project_name: string;
}

export interface ProjectLocation {
  id: number;
  project_name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface ProjectProperties {
  project_id: number;
  project_name: string;
  properties: {
    id: number;
    name: string;
    description: string;
    unit_price: number;
    property_for: string;
  }[];
}
