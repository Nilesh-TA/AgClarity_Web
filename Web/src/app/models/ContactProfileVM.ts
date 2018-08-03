export class ContactProfileVM {
    ID_profile: number;
    first_name: string;
    last_name: string;
    title: string;    
    phone: string;
    phone_source: string;
    email: string;
    email_source: string;
    responsibility_level: string;    
    preferred_contact_method: string;
    secondary_contact_method: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    access_role: string;
    language: string;
    type?: number;
    company?: number;
    phones: string[];
    emails: string[];
}

export class SearchContactProfileVM {
    TotalRows: number;
    ID_profile: number;
    first_name: string;
    last_name: string;
    title: string;    
    phone: string;
    email: string;
    responsibility_level: string;    
    preferred_contact_method: string;
    secondary_contact_method: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    access_role: string;
    language: string;
    type?: number;
    company?: number;
}