"use client";
import { Breadcrumb } from "@components/Breadcrumb";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import { convertPathToSpaceSeparatedStr } from "@lib/format-utils";
import { usePathname } from "next/navigation";

interface ProductFormProps {
    isEditForm: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ isEditForm }) => {
    const pathname = usePathname();
    const [, , , storePath, , productPath] = pathname.split("/");

    const editFormCrumbs = [
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: storePath.split("-").join(" "),
            link: `dashboard/stores/${storePath}`
        },
        {
            name: productPath.split("-").join(" ")
        }
    ];

    const createFormCrumbs = [
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: storePath.split("-").join(" "),
            link: `dashboard/stores/${storePath}`
        },
        {
            name: "New Product"
        }
    ];

    return (
        <section className="p-6 flex flex-col w-full h-full dashboard-screen-height overflow-auto">
            <div className="flex flex-col pb-6 border-b border-slate-200 w-full">
                <Breadcrumb
                    crumbs={isEditForm ? editFormCrumbs : createFormCrumbs}
                />
                <div className="flex flex-col md:flex-row items-center justify-between mt-6">
                    <div className="flex items-center self-start">
                        <h3 className="text-lg font-base mr-3 capitalize">
                            {isEditForm
                                ? convertPathToSpaceSeparatedStr(productPath)
                                      .fmt
                                : "New Product"}
                        </h3>
                        <span className="inline-block bg-slate-200 text-xs flex text-slate-700 items-center justify-center rounded-full w-10 h-5">
                            Draft
                        </span>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0">
                        <button className="w-28 h-10 rounded-full bg-white hover:bg-slate-100 transition mr-4 border border-slate-200 shadow-md flex justify-center items-center">
                            <PencilIcon className="h-4 w-4 mr-2 text-gray-700" />
                            <p className="text-gray-700 text-sm">Save draft</p>
                        </button>
                        <button className="w-28 h-10 rounded-full primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center">
                            <CheckIcon className="h-5 w-5 text-white mr-2" />
                            <p className="text-white text-sm">Publish</p>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
