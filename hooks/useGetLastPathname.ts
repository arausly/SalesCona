import { usePathname } from "next/navigation";

export const useGetLastPathname = () => {
    const pathname = usePathname();
    const [lastPathname] = pathname.split("/").slice(-1);
    return lastPathname;
};
