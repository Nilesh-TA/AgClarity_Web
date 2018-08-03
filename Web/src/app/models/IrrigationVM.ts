export class IrrigationVM {
    ID_irrigation: number;
    name: string;
    type: string;
    description: string;
    volume_rating: string;    
    location?: number;    
    company?: number;
} 

export class SearchIrrigationVM {
    TotalRows: number;
    ID_irrigation: number;
    name: string;
    type: string;
    description: string;
    volume_rating: string;   
    locations: string; 
    location?: number;    
    company?: number;
}