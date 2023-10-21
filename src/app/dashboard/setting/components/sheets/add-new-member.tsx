import React from "react";
import { nanoid } from "nanoid";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/sheet";
import { Button } from "@components/Button";
import { Modal } from "@components/Dialog/Dialog";
import { inputClasses } from "@components/Input/input";
import {
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    UserPlusIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import { Tooltip } from "@components/Tooltip";
import Dropdown from "@components/Menudropdown";
import { Permission, Role } from "../../../typing";
import { CreateNewRole } from "./create-new-role";

const CancelRequestPrompt = ({
    toggleModal,
    isOpen,
    closeForm
}: {
    isOpen: boolean;
    toggleModal: () => void;
    closeForm: () => void;
}) => {
    return (
        <Modal
            dialogClassName="z-50"
            title="Unsaved changes"
            isOpen={isOpen}
            toggleModal={toggleModal}
        >
            <div className="flex flex-col w-full mt-2">
                <p className="mb-2 text-sm font-light">
                    Closing this form would erase any progress made, are you
                    sure you want to close?
                </p>
            </div>
            <div className="mt-4 flex items-center justify-end">
                <button
                    type="button"
                    className="mr-3 inline-flex justify-center shadow-md rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none ease-in-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={toggleModal}
                >
                    No, take me back
                </button>
                <button
                    type="button"
                    className="mr-3 z-50 inline-flex justify-center shadow-md rounded-md border border-transparent bg-[#D83F31] hover:bg-[#C70039] px-4 py-2 text-sm font-medium text-white focus:outline-none ease-in-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeForm}
                >
                    Yes, close
                </button>
            </div>
        </Modal>
    );
};

interface AddNewMemberProps {
    roles: Array<Role>;
    permissions: Permission[];
}

interface MemberPayload {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export const AddNewMember = React.forwardRef(
    ({ roles, permissions }: AddNewMemberProps, ref: any) => {
        const [open, setOpen] = React.useState<boolean>(false);
        const [addingMember, setAddingMember] = React.useState<boolean>(false);
        const [showPassword, setShowPassword] = React.useState<boolean>(false);
        const [selectedRole, setSelectedRole] = React.useState<Role>();
        const [formState, setFormState] = React.useState<MemberPayload>({
            firstname: "",
            lastname: "",
            email: "",
            password: ""
        });
        const createRoleRef = React.useRef<HTMLButtonElement | null>(null);
        const [errorState, setErrorState] = React.useState<
            Pick<MemberPayload, "password" | "email">
        >({
            password: "",
            email: ""
        });
        const [isCancelPromptOpen, setIsCancelPromptOpen] =
            React.useState<boolean>(false);

        /** toggle cancel prompt */
        const toggleModal = React.useCallback(
            () => setIsCancelPromptOpen((o) => !o),
            []
        );

        const addNewMember = React.useCallback(() => {}, []);

        const handleAddMemberFormClose = (open: boolean) => {
            if (true && !open) {
                //there is a change made and form wants to close
                setIsCancelPromptOpen(true);
            } else {
                setOpen(open);
            }
        };

        const closePromptAndMemberForm = React.useCallback(() => {
            setIsCancelPromptOpen(false);
            setOpen(false);
        }, []);

        const handleFormChange = React.useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = event.target;
                setFormState((prev) => ({ ...prev, [name]: value }));
            },
            []
        );

        const handleGeneratePassword = React.useCallback(() => {
            setFormState((prev) => ({ ...prev, password: nanoid() }));
        }, []);

        const handleRoleSelection = React.useCallback(
            (role: Role) => {
                if (role.id === "creation") {
                    //open another sheet
                    createRoleRef.current?.click();
                } else {
                    setSelectedRole(role);
                }
            },
            [createRoleRef]
        );

        return (
            <>
                <CancelRequestPrompt
                    isOpen={isCancelPromptOpen}
                    toggleModal={toggleModal}
                    closeForm={closePromptAndMemberForm}
                />
                <CreateNewRole ref={createRoleRef} permissions={permissions} />
                <Sheet
                    open={open}
                    onOpenChange={handleAddMemberFormClose}
                    modal={!isCancelPromptOpen}
                >
                    <SheetTrigger asChild>
                        <button ref={ref} onClick={() => setOpen(true)} />
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add new member</SheetTitle>
                            <SheetDescription>
                                You can add new members to your team by filling
                                the information below.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-6 mt-8">
                            <div>
                                <label
                                    htmlFor="firstname"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Firstname
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="firstname"
                                        type="text"
                                        placeholder="John"
                                        required
                                        name="firstname"
                                        value={formState.firstname}
                                        onChange={handleFormChange}
                                        className={inputClasses({
                                            mode: "default"
                                        })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="lastname"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Firstname
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="lastname"
                                        type="text"
                                        placeholder="Doe"
                                        required
                                        name="lastname"
                                        value={formState.lastname}
                                        onChange={handleFormChange}
                                        className={inputClasses({
                                            mode: "default"
                                        })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@anymail.com"
                                        required
                                        name="email"
                                        value={formState.email}
                                        onChange={handleFormChange}
                                        className={inputClasses({
                                            mode: errorState.email
                                                ? "error"
                                                : "default"
                                        })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Password
                                </label>
                                <div className="mt-2 relative">
                                    <Tooltip
                                        message="Click to generate password"
                                        tooltipContentClasses="bg-[#3C4048] text-white"
                                    >
                                        <button
                                            className="absolute h-7 w-12 cursor-pointer top-1 border-0 left-1 rounded-l-md bg-gray-100 flex items-center justify-center"
                                            onClick={handleGeneratePassword}
                                        >
                                            <KeyIcon className="h-5 w-5 h-gray-500" />
                                        </button>
                                    </Tooltip>

                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="supersecret"
                                        required
                                        name="password"
                                        value={formState.password}
                                        onChange={handleFormChange}
                                        className={inputClasses({
                                            mode: errorState.password
                                                ? "error"
                                                : "defaultMoreLeftPadding"
                                        })}
                                    />
                                    <div
                                        className="h-9 w-9 flex items-center justify-center absolute right-0 top-0"
                                        onClick={() =>
                                            setShowPassword((s) => !s)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="h-5 w-5 cursor-pointer" />
                                        ) : (
                                            <EyeSlashIcon className="h-5 w-5 cursor-pointer" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Role
                                </label>
                                <div className="mt-2">
                                    <Dropdown<Role>
                                        wrapperClasses="md:w-full"
                                        title="Assign a role to member"
                                        titleIcon={
                                            <UsersIcon
                                                className="ml-2 -mr-1 h-5 w-5 text-black mr-2"
                                                aria-hidden="true"
                                            />
                                        }
                                        items={[
                                            {
                                                label: "Create new role",
                                                id: "creation",
                                                icon: UserPlusIcon,
                                                decoy: true
                                            },
                                            ...roles
                                        ]}
                                        onSelectItem={handleRoleSelection}
                                    />
                                </div>
                            </div>
                        </div>
                        <SheetFooter className="mt-8">
                            <Button
                                type="submit"
                                loadingText="Adding"
                                text="Add Member"
                                className="text-white w-32 h-10 rounded-lg primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                                onClick={addNewMember}
                            />
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
);
