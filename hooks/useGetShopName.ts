import { usePathname } from "next/navigation";

//for customer view only
export const useGetShopName = () => {
    const pathname = usePathname();
    const [, , shopName] = pathname.split("/");
    return shopName;
};
