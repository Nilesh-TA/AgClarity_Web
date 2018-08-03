export class CompanyVM {
    ID_company: number;
    name: string;
    metric_imperial: string;
    currency: string;    
    dunsnumber: string;
    related_to?: number;    
    rank?: number;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    water_saved?: number;
}

export class SearchCompanyVM {
    TotalRows: number;
    ID_company: number;
    name: string;
    metric_imperial: string;
    currency: string;    
    dunsnumber: string;
    related_to?: number;
    relatedcompanyname: string;
    IsRelatedWithOtherCompany: boolean;
    rank?: number;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    water_saved?: number;
}