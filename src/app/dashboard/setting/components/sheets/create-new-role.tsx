"use client";

import React from "react";
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
import { Permission } from "../../../typing";
import { Switch } from "@components/ui/switch";

interface CreateNewRoleProps {
    permissions: Permission[];
}

export const CreateNewRole = React.forwardRef(
    ({ permissions }: CreateNewRoleProps, ref: any) => {
        const [saving, setSaving] = React.useState<boolean>(false);
        const [open, setOpen] = React.useState<boolean>(false);
        const [roleLabel, setRoleLabel] = React.useState<string>("");

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
                                    <Switch id={`${permission.id}`} />
                                </label>
                            ))}
                        </div>
                    </div>
                    <SheetFooter className="mt-8">
                        <SheetClose asChild>
                            <Button
                                type="submit"
                                loadingText="Saving"
                                loading={saving}
                                text="Save changes"
                                className="text-white w-32 h-10 rounded-lg primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                            />
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    }
);
