export interface SupportedCountry {
    id: number;
    name: "Nigeria";
    iso_code: "NG";
    default_currency_code: "NGN";
    calling_code: "+234";
}

export interface Bank {
    id: number;
    name: string;
    code: string;
    supports_transfer: boolean;
    country: string;
}
