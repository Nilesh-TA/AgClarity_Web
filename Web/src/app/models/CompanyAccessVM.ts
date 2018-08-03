export class CompanyAccessVM{
    ID_company_access: number;    
    contactProfileID?: number;
    company?: number;
    company_name: string;
}

export class SearchCompanyAccessVM{
    TotalRows: number;
    ID_company_access: number;    
    contactProfileID?: number;
    company?: number;
    company_name: string;
}

export class PayLoadCompanyAccess{
    add?: CompanyAccessVM[];
    update: {
        old: CompanyAccessVM[],
        new: CompanyAccessVM[]
    }
    delete?: number[];
    microapp_name: string;
    userid: number;
}