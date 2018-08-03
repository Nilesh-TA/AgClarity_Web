export class PhoneVM {
    ID_phone: number;
    number: string;
    contact?: number;
    type?: number;
}

export class SearchPhoneVM {
    TotalRows: number;
    ID_phone: number;
    number: string;
    contact?: number;
    type?: number;
}

export class PayLoadPhone {
    add?: PhoneVM[];
    update: {
        old: PhoneVM[],
        new: PhoneVM[]
    }
    delete?: number[];
    microapp_name: string;
    userid: number;
}