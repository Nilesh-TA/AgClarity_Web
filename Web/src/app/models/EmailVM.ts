export class EmailVM{
    ID_email: number;
    email: string;    
    contact?: number;
    type?: number;
}

export class SearchEmailVM{
    TotalRows: number;
    ID_email: number;
    email: string;    
    contact?: number;
    type?: number;
}

export class PayLoadEmail{
    add?: EmailVM[];
    update: {
        old: EmailVM[],
        new: EmailVM[]
    }
    delete?: number[];
    microapp_name: string;
    userid: number;
}