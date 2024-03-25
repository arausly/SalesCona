import React from "react";

//hooks
import { useGetUser } from "./useGetUser";

//services
import { getLocationFromIP } from "@services/ip/ip.services";
import { formatPriceBasedOnCurrency } from "@lib/format-utils";
import { updateUser } from "@services/merchant/merchant.services";

interface CatType {
    nigeria: boolean;
    international: boolean;
}

export const useGetLocationCategory = (): {
    category: CatType;
    ifNG: (c1: number, c2: number) => string;
} => {
    const [category, setCategory] = React.useState<CatType>({
        nigeria: false,
        international: false
    });
    const { user, triggerUpdate } = useGetUser();

    React.useEffect(() => {
        if (!user || !user.country) {
            getLocationFromIP().then(async (location) => {
                const isNigeria =
                    location?.country === "NG" &&
                    location?.country_name === "Nigeria";
                setCategory({ nigeria: isNigeria, international: !isNigeria });

                if (user) {
                    await updateUser(user)(user.id, {
                        country: location?.country_name,
                        lng_lat: `${location?.longitude}_${location?.latitude}`
                    });

                    //for auth session
                    triggerUpdate();
                }
            });
        } else {
            const isNigeria = user.country === "Nigeria";
            setCategory({
                nigeria: isNigeria,
                international: !isNigeria
            });
        }
    }, [user?.id]);

    //return first choice if location is Nigeria
    const ifNG = React.useCallback(
        (choice1: number, choice2: number) =>
            category.nigeria
                ? formatPriceBasedOnCurrency(choice1, true)
                : formatPriceBasedOnCurrency(choice2, false),
        [category]
    );

    return { category, ifNG };
};
