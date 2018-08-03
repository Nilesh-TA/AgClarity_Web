export class ChemicalVM{
    ID_chemical: number;
    name: string;
    description: string;
    type: string;
    severity: string;
    spread: string;
    symptoms: string;
    prevention: string;
    remedy: string;
    company: number;
}

export class SearchChemicalVM{
    TotalRows: number;
    ID_chemical: number;
    name: string;
    description: string;
    type: string;    
    company: number;
}