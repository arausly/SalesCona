import Link from "next/link";
import React from "react";
interface BreadcrumbProps {
    crumbs: {
        name: string;
        link?: string;
    }[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
    return (
        <div className="flex items-center">
            {crumbs.map((crumb, i) => (
                <React.Fragment key={crumb.name}>
                    {crumb.link ? (
                        <Link
                            href={crumb.link}
                            className="capitalize text-gray-700 text-sm font-medium hover:text-[#6d67e4] text-ellipsis overflow-hidden"
                        >
                            {crumb.name}
                        </Link>
                    ) : (
                        <p className="capitalize text-gray-400 text-sm font-normal text-ellipsis overflow-hidden">
                            {crumb.name}
                        </p>
                    )}
                    {i !== crumbs.length - 1 ? (
                        <span className="text-gray-400 mr-2 ml-2">/</span>
                    ) : null}
                </React.Fragment>
            ))}
        </div>
    );
};
