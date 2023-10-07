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
        message: "Create affiliate links",
        title: "Affiliate links"
    },
    {
        pathname: "/dashboard/coupons",
        icon: BanknotesIcon,
        message: "Create coupon codes",
        title: "Coupons"
    },
    {
        pathname: "/dashboard/sales",
        icon: BookOpenIcon,
        message: "Manage your sales",
        title: "Sales"
    },
    {
        pathname: "/dashboard/ticket",
        icon: TicketIcon,
        message: "Track your orders",
        title: "Orders"
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
    const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
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

    const handleNavToggle = React.useCallback(() => {
        setShowMobileMenu((s) => !s);
    }, []);

    return (
        <nav
            className={`${styles.wrapper} ${
                !showMobileMenu ? styles.wrapperCollapse : ""
            }`}
        >
            <div className={styles.sidebarHeaderBox}>
                <button
                    className={styles.sidebarToggler}
                    onClick={handleNavToggle}
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
                <p
                    className={`${pacifico.className} ${styles.sidebarBrandName}`}
                >
                    Friendie
                </p>
                <p className={styles.sideMobileOnly}>
                    {links.find((l) => l.pathname === pathname)?.title}
                </p>
                <ProfileAvatar />
            </div>
            <div
                className={`${styles.sidebarNavLinks} ${
                    showMobileMenu
                        ? styles.sidebarNavLinksShow
                        : styles.sidebarNavLinksHide
                }`}
            >
                {links.map((link, i) => (
                    <Link
                        key={link.title}
                        href={link.pathname}
                        className={`${styles.sidebarNavLinkItem} ${
                            (!i && pathname === link.pathname) ||
                            (i && pathname.indexOf(link.pathname) > -1)
                                ? styles.sidebarActiveLinkItem
                                : ""
                        }`}
                    >
                        <link.icon className="h-5 w-5" />
                        <Tooltip
                            message={link.message}
                            side="right"
                            tooltipContentClasses="bg-[#3C4048] text-white w-fit ml-0 pl-0"
                        >
                            <p className="text-sm md:text-base">{link.title}</p>
                        </Tooltip>
                        {link.title === "Messages" && (
                            <div className="ml-auto w-7 h-5 flex flex-row items-center justify-center text-white rounded-full primary-bg ml-2 text-xs">
                                10
                            </div>
                        )}
                    </Link>
                ))}
                <div
                    className={`${styles.sidebarNavLinkItem} items-center flex `}
                    onClick={handleSignOut}
                >
                    {signingOut ? (
                        <Spinner size="tiny" />
                    ) : (
                        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                    )}
                    <p className="text-sm md:text-lg">Logout</p>
                </div>
            </div>
        </nav>
    );
}
