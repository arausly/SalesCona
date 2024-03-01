import { updateMerchant } from "@services/merchant/merchant.services";
import { IpLocation } from "./typing";

/**
 * gets the country and location information
 * per ip address and updates merchant records
 * @param merchantId
 */
export const getAndUpdateLocationDataPerIp = async (merchantId: string) => {
    if (!merchantId) return;
    try {
        const data = (await (
            await fetch("https://ipapi.co/json")
        ).json()) as IpLocation;

        await updateMerchant(merchantId, {
            country: data?.country_name ?? "",
            lng_lat: `${data.longitude}_${data.latitude}`
        });
    } catch (err) {}
};
