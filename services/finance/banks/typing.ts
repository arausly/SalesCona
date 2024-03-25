export interface Bank {
    id: number;
    name: string;
    code: string;
    supports_transfer: boolean;
    logo?: string;
}

export interface SupportedCountry {
    id: number;
    name: string;
    iso_code: string;
    default_currency_code: string;
}
