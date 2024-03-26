export interface Bank {
    id: number;
    name: string;
    label: string; //not from API, populated after formatting
    value: string; //not from API, populated after formatting
    code: string;
    supports_transfer: boolean;
    logo?: string;
    slug: string;
    currency: string;
}

export interface SupportedCountry {
    id: number;
    name: string;
    label: string; //not from API, populated after formatting
    iso_code: string;
    default_currency_code: string;
}
