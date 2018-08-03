export class IrrigationLocationVM{
    ID_irrigation_location: number;    
    irrigation?: number;
    location?: number;
    location_name: string;
}

export class SearchIrrigationLocationVM{
    TotalRows: number;
    ID_irrigation_location: number;    
    irrigation?: number;
    location?: number;
    location_name: string;
}

export class PayLoadIrrigationLocation{
    add?: IrrigationLocationVM[];
    update: {
        old: IrrigationLocationVM[],
        new: IrrigationLocationVM[]
    }
    delete?: number[];
    microapp_name: string;
    userid: number;
}