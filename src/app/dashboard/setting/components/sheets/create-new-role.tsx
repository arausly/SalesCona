"use client";

import React from "react";

//components
import { Button } from "@components/Button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/sheet";
import { inputClasses } from "@components/Input/input";
import { Switch } from "@components/ui/switch";

//typing
import { Permission, Role } from "../../../typing";

//hooks
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { useGetUser } from "@hooks/useGetUser";

//db
import { tables } from "@db/tables.db";

interface CreateNewRoleProps {
    permissions: Permission[];
}

export const CreateNewRole = React.forwardRef(
    ({ permissions }: CreateNewRoleProps, ref: any) => {
        const [saving, setSaving] = React.useState<boolean>(false);
        const [open, setOpen] = React.useState<boolean>(false);
        const [roleLabel, setRoleLabel] = React.useState<string>("");
        const [errorMsg, setErrorMsg] = React.useState<string>("");
        const [selectedPermissions, setSelectedPermissions] = React.useState<{
            [key: string]: boolean;
        }>({});
        const { supabase } = useBrowserSupabase();
        const { user } = useGetUser();

        //add role
        const createRole = React.useCallback(async () => {
            try {
                if (!user || !roleLabel.length) return;
                const permissions = Object.keys(selectedPermissions);
                if (!permissions.length) {
                    setErrorMsg(
                        `Please select the permissions associated with the role ${roleLabel}`
                    );
                    return;
                }
                setSaving(true);
                //create role entry in role db
                const { data, error } = await supabase
                    .from(tables.roles)
                    .insert<{ label: string; merchant: string }>({
                        label: roleLabel.trim(),
                        merchant: user.id
                    })
                    .select()
                    .returns<Role[]>();

                if (data?.length && !error) {
                    const permissionsForRoles = permissions.map(
                        (permission) => ({
                            permission,
                            role: data[0].id
                        })
                    );

                    const { error: err } = await supabase
                        .from(tables.actionsForRoles)
                        .insert(permissionsForRoles);

                    if (!err) {
                        setRoleLabel("");
                        setOpen(false);
                    } else {
                    }
                }
            } catch (err) {
            } finally {
                setSaving(false);
            }
        }, [user, roleLabel, selectedPermissions]);

        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <button ref={ref} onClick={() => setOpen(true)} />
                </SheetTrigger>
                <SheetContent className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>Create new role</SheetTitle>
                        <SheetDescription>
                            Select permissions that best fit the role, you can
                            always edit this later
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-8">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Staff LvL 1"
                                    required
                                    name="title"
                                    value={roleLabel}
                                    onChange={(e) =>
                                        setRoleLabel(e.target.value)
                                    }
                                    className={inputClasses({
                                        mode: "default"
                                    })}
                                />
                            </div>
                        </div>
                        <div className="mt-8">
                            <p>Permissions</p>
                            {permissions.map((permission) => (
                                <label
                                    htmlFor={`${permission.id}`}
                                    className="border border-gray-100 rounded-sm cursor-pointer shadow-sm flex items-center justify-between p-3 mt-6"
                                    key={permission.id}
                                >
                                    <div className="mr-1">
                                        <h3 className="text-base">
                                            {permission.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 font-light">
                                            {permission.description}
                                        </p>
                                    </div>
                                    <Switch
                                        id={`${permission.id}`}
                                        onCheckedChange={(checked) =>
                                            setSelectedPermissions((prev) => ({
                                                ...prev,
                                                [permission.id]: checked
                                            }))
                                        }
                                    />
                                </label>
                            ))}
                        </div>
                        {errorMsg && (
                            <p className="text-sm my-2 text-red-500">
                                {errorMsg}
                            </p>
                        )}
                    </div>
                    <SheetFooter className="mt-8">
                        <Button
                            type="submit"
                            loadingText="Saving"
                            loading={saving}
                            text="Save changes"
                            onClick={createRole}
                            className="text-white w-32 h-10 rounded-lg primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                        />
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    }
);
