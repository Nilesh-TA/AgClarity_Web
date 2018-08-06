export class WaterSourceLocationVM{
    ID_watersource_location: number;    
    watersource?: number;
    location?: number;
    location_name: string;
}

export class SearchWaterSourceLocationVM{
    TotalRows: number;
    ID_watersource_location: number;    
    watersource?: number;
    location?: number;
    location_name: string;
}

export class PayLoadWaterSourceLocation{
    add?: WaterSourceLocationVM[];
    update: {
        old: WaterSourceLocationVM[],
        new: WaterSourceLocationVM[]
    }
    delete?: number[];
    microapp_name: string;
    userid: number;
}