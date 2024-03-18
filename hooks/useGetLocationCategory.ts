import React from "react";

//hooks
import { useGetUser } from "./useGetUser";

//services
import { getLocationFromIP } from "@services/ip/ip.services";
import { formatPriceBasedOnCurrency } from "@lib/format-utils";

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
    const { user } = useGetUser();

    React.useEffect(() => {
        if (!user) {
            getLocationFromIP().then((location) => {
                const isNigeria =
                    location?.country === "NG" &&
                    location?.country_name === "Nigeria";
                setCategory({ nigeria: isNigeria, international: !isNigeria });
            });
        } else {
            const isNigeria = user.country === "Nigeria";
            setCategory({
                nigeria: isNigeria,
                international: !isNigeria
            });
        }
    }, [user]);

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
