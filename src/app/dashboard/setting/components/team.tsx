"use client";
import React from "react";
import { toast } from "react-toastify";

//components
import { Table } from "@components/Table/Table";
import {
    EllipsisHorizontalIcon,
    UserGroupIcon,
    UserPlusIcon
} from "@heroicons/react/24/outline";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@components/ui/dropdown-menu";
import { Prompt } from "@components/Dialog/Prompt";
import { AddNewMember } from "./sheets/add-new-member";

//hooks
import { useGetUser } from "@hooks/useGetUser";

//utils
import { excludeKeysFromObj } from "@lib/common.utils";
import { useBrowserSupabase } from "@lib/supabaseBrowser";

//db
import { tables } from "@db/tables.db";

//typing
import { MerchantStaff, Permission, Role } from "../../typing";

const headers = [
    { id: "firstname", label: "Firstname" },
    { id: "lastname", label: "Lastname" },
    { id: "email", label: "email" },
    { id: "role", label: "Role" },
    { id: "created_at", label: "Date added" },
    { id: "last_active", label: "Last Login" },
    { id: "status", label: "Status" },
    { id: "actions", label: "" }
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
    const [members, setMembers] = React.useState<MerchantStaff[]>([]);
    const [fetchingMembers, setFetchingMembers] =
        React.useState<boolean>(false);
    const [openDeletePrompt, setOpenDeletePrompt] =
        React.useState<boolean>(false);
    const [openSuspendPrompt, setOpenSuspendPrompt] =
        React.useState<boolean>(false);
    const [editingMember, setEditingMember] = React.useState<boolean>(false); //for remove & suspend
    const [selectedMemberStaff, setSelectedMemberStaff] =
        React.useState<MerchantStaff>();
    const [] = React.useState<boolean>();
    const { supabase } = useBrowserSupabase();
    const sheetTriggerRef = React.useRef();

    React.useEffect(() => {
        const subscription = supabase
            .channel(tables.merchantStaffs)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: tables.merchantStaffs
                },

                async (payload) => {
                    let memberPayload = payload.new as MerchantStaff;
                    const { data, error } = await supabase
                        .from(tables.roles)
                        .select()
                        .eq("id", memberPayload.role);

                    if (data?.length && !error) {
                        memberPayload.role = data[0] as Role;
                    }

                    switch (payload.eventType) {
                        case "INSERT":
                            setMembers((prev) => [
                                ...prev,
                                payload.new as MerchantStaff
                            ]);
                            break;
                        case "DELETE":
                            setMembers((prev) => [
                                ...prev.filter(
                                    (oldMember) =>
                                        oldMember.id !== payload.old.id
                                )
                            ]);
                            break;
                        case "UPDATE":
                            setMembers((prev) =>
                                prev.map((oldMember) => {
                                    if (oldMember.id === memberPayload.id) {
                                        return memberPayload;
                                    }
                                    return oldMember;
                                })
                            );
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        (async () => {
            if (user) {
                try {
                    setFetchingMembers(true);
                    const { data, error } = await supabase
                        .from(tables.merchantStaffs)
                        .select("*,role(*)")
                        .eq("owner", user.id)
                        .returns<MerchantStaff[]>();
                    if (data && !error) {
                        setMembers(data);
                    }
                } catch (err) {
                } finally {
                    setFetchingMembers(false);
                }
            }
        })();
    }, [user]);

    const openMemberCreationSheet = React.useCallback(() => {
        const trigger = sheetTriggerRef?.current as any;
        if (trigger) {
            trigger.click();
        }
    }, [sheetTriggerRef]);

    const MemberActions = ({ member }: { member: MerchantStaff }) => {
        const handleEdit = () => {
            setSelectedMemberStaff(member);
            openMemberCreationSheet();
        };

        const handleSuspendUser = () => {
            setSelectedMemberStaff(member);
            setOpenSuspendPrompt(true);
        };

        const handleRemoveUser = () => {
            setSelectedMemberStaff(member);
            setOpenDeletePrompt(true);
        };

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button>
                        <EllipsisHorizontalIcon className="h-8 w-10 primary-color" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleEdit}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleSuspendUser}
                        >
                            {member.suspended ? "Reactivate" : "Suspend"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleRemoveUser}
                        >
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const rows = React.useMemo(
        () =>
            members.reduce((acc, m) => {
                if (!m.is_deleted) {
                    acc.push({
                        ...excludeKeysFromObj(m, [
                            "owner",
                            "suspended",
                            "is_deleted"
                        ]),
                        created_at: new Date(m.created_at).toLocaleDateString(),
                        role: m.role.label,
                        last_active: m.last_active ?? "Never",
                        actions: <MemberActions member={m} />,
                        status: (
                            <span
                                className={`inline-flex items-center rounded-md ${
                                    m.suspended
                                        ? "bg-pink-50 text-pink-700 ring-pink-700/10"
                                        : "bg-green-50 text-green-700 ring-green-600/20"
                                }  px-2 py-1 text-xs font-medium ring-1 ring-inset `}
                            >
                                {m.suspended ? "Suspended" : "Active"}
                            </span>
                        )
                    });
                }
                return acc;
            }, [] as any[]),
        [members]
    );

    const promptAction = React.useCallback(
        async (prompt: "suspend" | "delete") => {
            if (!selectedMemberStaff) return;
            try {
                const payload =
                    prompt === "delete"
                        ? { is_deleted: true }
                        : { suspended: !selectedMemberStaff.suspended };

                setEditingMember(true);
                const { error } = await supabase
                    .from(tables.merchantStaffs)
                    .update(payload)
                    .eq("id", selectedMemberStaff.id);
                if (!error) {
                    toast(
                        <p className="text-sm">Removed staff successfully</p>,
                        {
                            type: "success"
                        }
                    );
                } else {
                    toast(<p className="text-sm">Failed to remove staff</p>, {
                        type: "error"
                    });
                }
            } catch (err) {
            } finally {
                setEditingMember(false);
                setOpenDeletePrompt(false);
                setOpenSuspendPrompt(false);
            }
        },
        [selectedMemberStaff]
    );

    const handleOpenNewMemberSheet = React.useCallback(() => {
        setSelectedMemberStaff(undefined);
        openMemberCreationSheet();
    }, []);

    return (
        <>
            <Prompt
                isOpen={openDeletePrompt}
                action={() => promptAction("delete")}
                actionMsg="remove user"
                contentMsg={`Are you sure you want to remove "${selectedMemberStaff?.firstname}" from your staff list?`}
                title="Remove user"
                toggleModal={() => setOpenDeletePrompt((o) => !o)}
                actionWorking={editingMember}
            />
            <Prompt
                isOpen={openSuspendPrompt}
                action={() => promptAction("suspend")}
                actionMsg={`${
                    selectedMemberStaff?.suspended ? "reactivate" : "suspend"
                } user`}
                contentMsg={`Are you sure you want to ${
                    selectedMemberStaff?.suspended ? "reactivate" : "suspend"
                } "${selectedMemberStaff?.firstname}" from your staff list?`}
                title="Suspend user"
                toggleModal={() => setOpenSuspendPrompt((o) => !o)}
                actionWorking={editingMember}
            />
            <AddNewMember
                roles={roles}
                permissions={permissions}
                ref={sheetTriggerRef}
                currentMember={selectedMemberStaff}
            />
            <div className="flex flex-col w-full items-center justify-center px-0 md:px-6 mt-16 lg:px-8">
                {(rows.length && (
                    <button
                        onClick={handleOpenNewMemberSheet}
                        className="w-48 h-10 mb-4 rounded-lg self-end primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                    >
                        <UserPlusIcon className="h-5 w-5 text-white mr-2" />
                        <p className="text-white text-sm">Add new member</p>
                    </button>
                )) ||
                    null}
                <Table
                    title="Members"
                    headers={headers}
                    onSearch={() => {}}
                    loading={fetchingMembers}
                    onPaginate={() => {}}
                    pagination={pagination}
                    rows={rows}
                    noDataMsg="No members added to your account yet"
                    noDataAltAction={
                        <button
                            onClick={handleOpenNewMemberSheet}
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
