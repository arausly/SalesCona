"use client";
import React from "react";
import { toast } from "react-toastify";

//components
import { Table } from "@components/Table/Table";
import {
    BuildingStorefrontIcon,
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

//utils
import { excludeKeysFromObj } from "@lib/common.utils";

//db
import { tables } from "@db/tables.db";

//typing
import { listenToChangesIn } from "@services/subscriptions.service";
import { SettingContext } from "../contexts/setting.context";
import { updateStaff } from "@services/staff/staff.service";
import { getRoleById } from "@services/roles/roles.services";
import { MerchantStaffRolePopulated } from "@db/typing/merchantStaff.typing";
import { StoreDropdown } from "@components/shared/StoreDropdown";
import Link from "next/link";
import { NoData } from "@components/NoData";

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

export const Team = () => {
    const [openDeletePrompt, setOpenDeletePrompt] =
        React.useState<boolean>(false);
    const [openSuspendPrompt, setOpenSuspendPrompt] =
        React.useState<boolean>(false);
    const [editingMember, setEditingMember] = React.useState<boolean>(false); //for remove & suspend
    const [selectedMemberStaff, setSelectedMemberStaff] =
        React.useState<MerchantStaffRolePopulated>();
    const [] = React.useState<boolean>();
    const sheetTriggerRef = React.useRef();

    const {
        loading,
        actions,
        roles,
        selectStore,
        stores,
        setStaffsByStore,
        currentStore,
        staffsByStore
    } = React.useContext(SettingContext);

    React.useEffect(() => {
        if (!currentStore) return () => {}; // do nothing
        const subscription = listenToChangesIn(
            tables.merchantStaffs,
            "*",
            async (payload) => {
                switch (payload.eventType) {
                    case "INSERT":
                        setStaffsByStore((prev) => ({
                            ...prev,
                            [currentStore.id]: [
                                ...prev[currentStore.id],
                                payload.new
                            ]
                        }));
                        break;
                    case "DELETE":
                        setStaffsByStore((prev) => ({
                            ...prev,
                            [currentStore.id]: prev[currentStore.id].filter(
                                (oldMember) => oldMember.id !== payload.old.id
                            )
                        }));
                        break;
                    case "UPDATE":
                        let memberPayload = payload.new;
                        const { data, error } = await getRoleById(
                            memberPayload.role
                        );

                        if (data?.length && !error) {
                            memberPayload.role = data[0];
                        }
                        setStaffsByStore((prev) => ({
                            ...prev,
                            [currentStore.id]: prev[currentStore.id].map(
                                (oldMember) => {
                                    if (oldMember.id === memberPayload.id) {
                                        return memberPayload;
                                    }
                                    return oldMember;
                                }
                            )
                        }));
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [currentStore]);

    const openMemberCreationSheet = React.useCallback(() => {
        const trigger = sheetTriggerRef?.current as any;
        if (trigger) {
            trigger.click();
        }
    }, [sheetTriggerRef]);

    const MemberActions = ({
        member
    }: {
        member: MerchantStaffRolePopulated;
    }) => {
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

    const members = staffsByStore[currentStore?.id ?? ""] ?? [];
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
                const { error } = await updateStaff(
                    selectedMemberStaff.id,
                    payload
                );
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

    if (!stores.length)
        return (
            <div className="flex flex-col items-center justify-center">
                <NoData msg="You have to create stores first to add your staff" />
                <Link
                    href="/dashboard/stores/create"
                    className="w-48 h-10 mt-4 rounded-lg primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                >
                    <BuildingStorefrontIcon className="h-5 w-5 text-white mr-2" />
                    <p className="text-white text-sm">Create store</p>
                </Link>
            </div>
        );

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
                permissions={actions}
                ref={sheetTriggerRef}
                currentMember={selectedMemberStaff}
            />
            <div className="flex flex-col w-full items-center justify-center px-0 md:px-6 mt-16 lg:px-8">
                <div className="mb-4">
                    <StoreDropdown
                        stores={stores}
                        handleSelection={selectStore}
                    />
                </div>
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
                    loading={loading}
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
