export class LocationVM {
    ID_location: number;
    name: string;
    type: string;
    description: string;
    address: string;
    longitude?: string;
    latitude?: string;
    polygon_data: string;
    size?: number;
    slope: string;
    aspect: string;
    elevation?: number;
    soil_texture?: number;
    soil_depth?: number;
    water_depth?: number;
    field_capacity?: number;
    mdp?: number;
    company?: number;
    related_to?: number;
}

export class SearchLocationVM {
    TotalRows: number;
    ID_location: number;
    name: string;
    type: string;
    description: string;
    address: string;
    longitude?: string;
    latitude?: string;
    polygon_data: string;
    size?: number;
    slope: string;
    aspect: string;
    elevation?: number;
    soil_texture?: number;
    soil_depth?: number;
    water_depth?: number;
    field_capacity?: number;
    mdp?: number;
    company?: number;
    related_to?: number;
}