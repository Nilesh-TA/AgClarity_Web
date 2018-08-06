export class WaterSourceVM {
    ID_watersource: number;
    name: string;
    type: string;
    description: string;
    volume_rating: string;    
    location?: number;   
    min_depth?: number; 
    max_depth?: number;
    company?: number;
} 

export class SearchWaterSourceVM {
    TotalRows: number;
    ID_watersource: number;
    name: string;
    type: string;
    description: string;
    volume_rating: string;    
    location?: number;   
    min_depth?: number; 
    max_depth?: number;
    company?: number;
}