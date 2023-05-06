"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pacifico } from "next/font/google";

//images
import { useBrowserSupabase } from "@lib/supabaseBrowser";

import styles from "./sidebar.module.css";
import { ProfileAvatar } from "@components/Avatar/ProfileAvatar";
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    BuildingStorefrontIcon,
    ChatBubbleBottomCenterTextIcon,
    HomeModernIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

const links = [
    {
        pathname: "/dashboard",
        title: "Home",
        icon: HomeModernIcon,
    },
    {
        pathname: "/dashboard/stores",
        title: "Stores",
        icon: BuildingStorefrontIcon,
    },
    {
        pathname: "/dashboard/followers",
        title: "Followers",
        icon: UsersIcon,
    },
    {
        pathname: "/dashboard/messages",
        icon: ChatBubbleBottomCenterTextIcon,
        title: "Messages",
    },
];

const pacifico = Pacifico({
    weight: "400",
    subsets: ["latin"],
});

export default function Sidebar() {
    const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
    const pathname = usePathname();
    const { supabase } = useBrowserSupabase();

    const handleSignOut = React.useCallback(async () => {
        await supabase.auth.signOut();
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
                {links.map((link) => (
                    <Link
                        key={link.title}
                        href={link.pathname}
                        className={`${styles.sidebarNavLinkItem} ${
                            link.pathname === pathname
                                ? styles.sidebarActiveLinkItem
                                : ""
                        }`}
                    >
                        <link.icon className="h-5 w-5" />
                        <p className="text-sm md:text-base">{link.title}</p>
                        {link.title === "Messages" && (
                            <div className="ml-auto w-7 h-5 flex flex-row items-center justify-center text-white rounded-full primary-bg ml-2 text-xs">
                                10
                            </div>
                        )}
                    </Link>
                ))}
                <div
                    className={styles.sidebarNavLinkItem}
                    onClick={handleSignOut}
                >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                    <p className="text-sm md:text-lg">Logout</p>
                </div>
            </div>
        </nav>
    );
}
