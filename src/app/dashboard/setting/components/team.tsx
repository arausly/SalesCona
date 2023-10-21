"use client";
import { Table } from "@components/Table/Table";
import {
    PencilIcon,
    TrashIcon,
    UserGroupIcon
} from "@heroicons/react/24/outline";
import { useGetUser } from "@hooks/useGetUser";
import { excludeKeysFromObj } from "@lib/common.utils";
import { supabaseTables } from "@lib/constants";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import React from "react";
import { AddNewMember } from "./sheets/add-new-member";
import { MerchantUser, Permission, Role } from "../../typing";

const headers = [
    { id: "firstname", label: "Firstname" },
    { id: "lastname", label: "Lastname" },
    { id: "email", label: "email" },
    { id: "role", label: "Role" },
    { id: "created_at", label: "Date added" },
    { id: "last_active", label: "Last active" },
    { id: "actions", label: "Actions" }
];

const pagination = {
    finalPage: 50,
    totalItemsCount: 500,
    pageItemCount: 10
};

interface TeamProps {
    roles: Role[];
    permissions: Permission[];
}

export const Team: React.FC<TeamProps> = ({ roles, permissions }) => {
    const { user } = useGetUser();
    const [members, setMembers] = React.useState<MerchantUser[]>([]);
    const { supabase } = useBrowserSupabase();
    const sheetTriggerRef = React.useRef();

    React.useEffect(() => {
        (async () => {
            if (user) {
                const { data, error } = await supabase
                    .from(supabaseTables.merchants)
                    .select()
                    .eq("owner_id", user.id)
                    .returns<MerchantUser[]>();
                if (data && !error) {
                    setMembers(data);
                }
            }
        })();
    }, [user]);

    const rows = React.useMemo(
        () =>
            members.map((m) => ({
                ...excludeKeysFromObj(m, ["owner_id"]),
                role: m.role.label,
                actions: (
                    <dd className="flex items-center">
                        <span className="mr-4">
                            <TrashIcon />
                        </span>
                        <span className="">
                            <PencilIcon />
                        </span>
                    </dd>
                )
            })),
        [members]
    );

    return (
        <>
            <AddNewMember
                roles={roles}
                permissions={permissions}
                ref={sheetTriggerRef}
            />
            <div className="flex flex-col w-full items-center justify-center px-0 md:px-6 mt-16 lg:px-8">
                <Table
                    title="Members"
                    headers={headers}
                    onSearch={() => {}}
                    onPaginate={() => {}}
                    pagination={pagination}
                    rows={rows}
                    noDataMsg="No members added to your account yet"
                    noDataAltAction={
                        <button
                            onClick={() => {
                                const trigger = sheetTriggerRef?.current as any;
                                if (trigger) {
                                    trigger.click();
                                }
                            }}
                            className="w-48 h-10 mt-4 rounded-lg primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                        >
                            <UserGroupIcon className="h-5 w-5 text-white mr-2" />
                            <p className="text-white text-sm">Add new member</p>
                        </button>
                    }
                />
            </div>
        </>
    );
};
