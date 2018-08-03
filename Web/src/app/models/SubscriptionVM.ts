export class SubscriptionVM{
    ID_subscription: number;
    micro_app_name: string;
    app_level: string;
    app_version: string;
    start_date?: Date;
    expire_date?: Date;    
    company: number;
}

export class SearchSubscriptionVM{
    TotalRows: number;
    ID_subscription: number;
    micro_app_name: string;
    app_level: string;
    app_version: string;
    start_date?: Date;
    expire_date?: Date;    
    company: number;
}

export class PayLoadSubscription{
    add?: SubscriptionVM[];
    update: {
        old: SubscriptionVM[],
        new: SubscriptionVM[]
    }
    delete?: number[];
    microapp_name: string;
    userid: number;
}