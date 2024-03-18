import { Bank, SupportedCountry } from "./typing";

/**
 * Get supported countries that transfers can be made to from **paystack
 * @returns
 */
export const getSupportedCountries = async (): Promise<SupportedCountry[]> =>
    (await (await fetch("https://api.paystack.co/country")).json()).data;

/**
 * get all the banks in the a country
 * @param country nigeria | ghana ...
 * @returns
 */
export const getBanks = async (country: string): Promise<Bank[]> =>
    (
        await (
            await fetch(`https://api.paystack.co/bank?country=${country}`)
        ).json()
    ).data;
