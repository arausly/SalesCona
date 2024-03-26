import { Bank, SupportedCountry } from "./typing";

/**
 * Countries that paystack supports transfers to
 * @returns
 */
export const getSupportedCountries = async (): Promise<SupportedCountry[]> =>
    (
        (await (await fetch("https://api.paystack.co/country")).json()).data ??
        []
    ).map((c: SupportedCountry) => ({ ...c, label: c.name }));

/**
 * Get all the banks for a country
 * @param country  e.g nigeria | ghana
 * @returns
 */
export const getBanks = async (country: string): Promise<Bank[]> => {
    let ngBanks: Bank[] = [];
    const pkBanks = (
        await (
            await fetch(`https://api.paystack.co/bank?country=${country}`)
        ).json()
    ).data as Bank[];

    if (country === "nigeria") {
        ngBanks = (await (
            await fetch("https://nigerianbanks.xyz")
        ).json()) as Bank[];
    }

    return pkBanks.map((pkBank) => {
        const logo = ngBanks.find((nb) => nb.code === pkBank.code)?.logo ?? "";
        return {
            ...pkBank,
            value: pkBank.name,
            label: pkBank.name,
            logo
        };
    });
};
