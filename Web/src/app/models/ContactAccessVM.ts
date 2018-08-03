export class ContactAccessVM {
    id_contact_access: number;
    contactprofileid?: number;
    company?: number;
    micro_apps: string;
    company_name: string;
}

export class SearchContactAccessVM {
    TotalRows: number;
    id_contact_access: number;
    contactprofileid?: number;
    company?: number;
    micro_apps: string;
}

export class ContactAccessDataVM {
    ID_company: number;
    companyName: string;
    old_contactaccess: ContactAccessVM[];
    selectedMicroApps: any[];
}

export class PayloadContactAccessDataVM {
    data: ContactAccessDataVM[];
}

export class PayLoadContactAccess {
    add?: ContactAccessVM[];
    update: {
        old: ContactAccessVM[],
        new: ContactAccessVM[]
    }
    delete?: number[];
    microapp_name: string;
    userid: number;
}

export class ViewContactAccessDataVM {    
    ID_company: number;
    companyName: string;    
    micro_apps: string[];
}