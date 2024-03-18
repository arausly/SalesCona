import { IPLocation } from "./typing";

/**
 * gets the country and location information
 * per ip address and updates merchant records
 * @param merchantId
 */
export const getLocationFromIP = async () => {
    try {
        const data = (await (
            await fetch("https://ipapi.co/json")
        ).json()) as IPLocation;
        return data;
    } catch (err) {}
};
