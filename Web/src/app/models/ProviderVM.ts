export class ProviderVM {
    ID_provider: number;
    name: string;
    metric_imperial: string;
    locationID: string;
    addressID: string;
    related_to: string;
    type: string;
    company: number;
}

export class SearchProviderVM {
    TotalRows: number;
    ID_provider: number;
    name: string;
    metric_imperial: string;
    related_to?: number;
    related_to_name?: string;
    locationID?: number;
    addressID?: number;
    address: string;
    city: string;
    state: string;
    country: string;    
    type: string;
    company: number;
}