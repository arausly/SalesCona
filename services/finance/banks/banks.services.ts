import { Bank, SupportedCountry } from "./typing";

/**
 * Countries that paystack supports transfers to
 * @returns
 */
export const getSupportedCountries = async (): Promise<SupportedCountry[]> =>
    (await (await fetch("https://api.paystack.co/country")).json()).data;

/**
 * Get all the banks for a country
 * @param country  e.g nigeria | ghana
 * @returns
 */
export const getBanks = async (country: string): Promise<Bank[]> =>
    (
        await (
            await fetch(`https://api.paystack.co/bank?country=${country}`)
        ).json()
    ).data;
