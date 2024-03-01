"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Pacifico } from "next/font/google";

//images
import { useBrowserSupabase } from "@lib/supabaseBrowser";

import styles from "./sidebar.module.css";
import { ProfileAvatar } from "@components/Avatar/ProfileAvatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger
} from "@components/ui/sheet";
import {
    ArrowLeftOnRectangleIcon,
    BanknotesIcon,
    Bars3Icon,
    BookOpenIcon,
    BuildingStorefrontIcon,
    ChatBubbleBottomCenterTextIcon,
    HomeModernIcon,
    LinkIcon,
    TicketIcon,
    UserIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import { storageKeys } from "@lib/constants";
import { toast } from "react-toastify";
import { Spinner } from "@components/Spinner";
import { Tooltip } from "@components/Tooltip";

const links = [
    {
        pathname: "/dashboard",
        title: "Home",
        message: "Go to dashboard",
        icon: HomeModernIcon
    },
    {
        pathname: "/dashboard/stores",
        title: "Stores",
        message: "View your stores",
        icon: BuildingStorefrontIcon
    },
    {
        pathname: "/dashboard/customers",
        title: "Customers",
        message: "Customer management",
        icon: UsersIcon
    },
    {
        pathname: "/dashboard/messages",
        icon: ChatBubbleBottomCenterTextIcon,
        message: "View all your messages",
        title: "Messages"
    },

    {
        pathname: "/dashboard/affiliate-links",
        icon: LinkIcon,
        message: "Manage affiliate links & coupons",
        title: "Coupons"
    },
    {
        pathname: "/dashboard/sales",
        icon: BookOpenIcon,
        message: "Manage your sales and orders",
        title: "Sales"
    },
    {
        pathname: "/dashboard/transactions",
        icon: BookOpenIcon,
        message: "Monitor transactions",
        title: "Transactions"
    },
    {
        pathname: "/dashboard/setting",
        icon: UserIcon,
        message: "Account settings",
        title: "Settings"
    }
];

const pacifico = Pacifico({
    weight: "400",
    subsets: ["latin"]
});

export default function Sidebar() {
    const [open, setOpen] = React.useState<boolean>(false);
    const pathname = usePathname();
    const { supabase } = useBrowserSupabase();
    const [signingOut, setSigningOut] = React.useState<boolean>(false);
    const router = useRouter();

    const handleSignOut = React.useCallback(async () => {
        try {
            setSigningOut(true);
            const { error } = await supabase.auth.signOut();
            sessionStorage.removeItem(storageKeys.user);
            if (!error) {
                router.push("/login");
            } else {
                toast("Couldn't logout, check your internet connection", {
                    type: "warning"
                });
            }
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        } finally {
            setSigningOut(false);
        }
    }, [supabase.auth]);

    const navLinks = (
        <div className="w-full h-full flex flex-col flex-1 mt-8 md:mt-4">
            {links.map((link, i) => (
                <Link
                    key={link.title}
                    href={link.pathname}
                    className={`flex items-center text-[rgb(2 6 23)] no-underline cursor-pointer transition mb-8 md:mb-10 ${
                        (!i && pathname === link.pathname) ||
                        (i && pathname.indexOf(link.pathname) > -1)
                            ? styles.sidebarActiveLinkItem
                            : ""
                    }`}
                    onClick={() => setOpen(false)}
                >
                    <link.icon className="h-5 w-5" />
                    <Tooltip
                        message={link.message}
                        side="right"
                        tooltipContentClasses="bg-[#3C4048] text-white w-fit ml-0 pl-4"
                    >
                        <p className="text-sm md:text-base ml-6">
                            {link.title}
                        </p>
                    </Tooltip>
                    {link.title === "Messages" && (
                        <div className="ml-auto w-7 h-5 flex flex-row items-center justify-center text-white rounded-full primary-bg ml-2 text-xs">
                            10
                        </div>
                    )}
                </Link>
            ))}
            <div
                className="items-center cursor-pointer flex mt-auto mb-4"
                onClick={handleSignOut}
            >
                {signingOut ? (
                    <Spinner size="tiny" />
                ) : (
                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                )}
                <p className="text-sm md:text-lg ml-4">Logout</p>
            </div>
        </div>
    );

    return (
        <nav className={styles.wrapper}>
            <div className="flex md:pb-4 items-center justify-between md:border-b border-[#ececed]">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            className={styles.sidebarToggler}
                            onClick={() => setOpen(true)}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="w-2/4"
                        onInteractOutside={() => setOpen(false)}
                    >
                        <SheetHeader className="border-b items-start border-slate-100 pb-5">
                            <p className={`${pacifico.className} text-4xl`}>
                                SalesCona
                            </p>
                        </SheetHeader>
                        <div className="h-[90%]">{navLinks}</div>
                    </SheetContent>
                </Sheet>
                <p
                    className={`${pacifico.className} ${styles.sidebarBrandName}`}
                >
                    SalesCona
                </p>
                <p className={styles.sideMobileOnly}>
                    {links.find((l) => l.pathname === pathname)?.title}
                </p>
                <ProfileAvatar />
            </div>
            <div className="hidden md:block h-full">{navLinks}</div>
        </nav>
    );
}
