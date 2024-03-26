import React from "react";
import { v4 as uuidv4 } from "uuid";
import { UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";

//components
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
import { inputClasses } from "@components/Input/input";
import Dropdown from "@components/Menudropdown";
import { CreateNewRole } from "./create-new-role";
import { Prompt } from "@components/Dialog/Prompt";

//hooks
import { useGetUser } from "@hooks/useGetUser";
import { useBrowserSupabase } from "@lib/supabaseBrowser";

//db
import { tables } from "@db/tables.db";
import { Action } from "@db/typing/action.typing";
import { MerchantStaffRolePopulated } from "@db/typing/merchantStaff.typing";
import { Role, RoleTable } from "@db/typing/role.typing";

interface AddNewMemberProps {
    roles: Array<RoleTable>;
    permissions: Action[];
    currentMember?: MerchantStaffRolePopulated;
}

interface MemberPayload {
    firstname: string;
    lastname: string;
    email: string;
}

const initialPayload = {
    email: "",
    firstname: "",
    lastname: ""
};

export const AddNewMember = React.forwardRef(
    ({ roles, permissions, currentMember }: AddNewMemberProps, ref: any) => {
        const [open, setOpen] = React.useState<boolean>(false);
        const [addingMember, setAddingMember] = React.useState<boolean>(false);
        const [showPassword, setShowPassword] = React.useState<boolean>(false);
        const [selectedRole, setSelectedRole] = React.useState<Role>();
        const [formState, setFormState] = React.useState<MemberPayload>({
            firstname: currentMember?.firstname ?? "",
            lastname: currentMember?.lastname ?? "",
            email: currentMember?.email ?? ""
        });
        const [formStateCopy, setFormStateCopy] = React.useState<MemberPayload>(
            {
                firstname: currentMember?.firstname ?? "",
                lastname: currentMember?.lastname ?? "",
                email: currentMember?.email ?? ""
            }
        );
        const [addingErrorMsg, setAddingErrorMsg] = React.useState<string>(""); //errors occurring when adding new members
        const createRoleRef = React.useRef<HTMLButtonElement | null>(null);
        const [errorState, setErrorState] = React.useState<
            Partial<MemberPayload>
        >({
            email: "",
            firstname: "",
            lastname: ""
        });
        const [isCancelPromptOpen, setIsCancelPromptOpen] =
            React.useState<boolean>(false);
        const { user } = useGetUser();
        const { supabase } = useBrowserSupabase();

        React.useEffect(() => {
            const initialPayload = {
                firstname: currentMember?.firstname ?? "",
                lastname: currentMember?.lastname ?? "",
                email: currentMember?.email ?? ""
            };
            setFormState({ ...initialPayload });
            setFormStateCopy({ ...initialPayload });
            setSelectedRole(currentMember?.role ?? undefined);
        }, [currentMember]);

        /** toggle cancel prompt */
        const toggleModal = React.useCallback(
            () => setIsCancelPromptOpen((o) => !o),
            []
        );

        const isFormNotValid = React.useCallback(() => {
            const err = {
                firstname: !formState.firstname.length
                    ? "please provide firstname"
                    : undefined,
                lastname: !formState.lastname.length
                    ? "please provide lastname"
                    : undefined,
                email: !formState.email.length
                    ? "please provide email"
                    : undefined
                // password: !formState.password.length
                //     ? "please provide password"
                //     : undefined
            };
            setErrorState(err as MemberPayload);
            return Object.values(err).find((v) => !!v);
        }, [formState]);

        const addNewMember = React.useCallback(async () => {
            //create new supabase user
            if (!user) return;

            if (isFormNotValid()) return;

            if (!selectedRole) {
                setAddingErrorMsg("Select role for this user");
                return;
            }

            try {
                setAddingMember(true);
                const { error: merchantError } = await supabase
                    .from(tables.merchantStaffs)
                    .upsert(
                        {
                            ...formState,
                            owner: user.id,
                            role: selectedRole.id,
                            id: currentMember?.id ?? uuidv4()
                        },
                        { onConflict: "id" }
                    );

                if (!merchantError) {
                    setOpen(false);
                }
            } catch (err) {
                setAddingErrorMsg("Couldn't add new member, please try again");
            } finally {
                setAddingMember(false);
                setAddingErrorMsg("");
            }
            //create new merchant user
        }, [formState, user, selectedRole, currentMember]);

        const handleAddMemberFormClose = (open: boolean) => {
            const thereIsChange =
                formState.firstname !== formStateCopy.firstname ||
                formState.lastname !== formStateCopy.lastname ||
                formState.email !== formStateCopy.email;

            if (thereIsChange && !open) {
                //there is a change made and form wants to close
                setIsCancelPromptOpen(true);
            } else {
                setOpen(open);
            }
        };

        const closePromptAndMemberForm = React.useCallback(() => {
            setIsCancelPromptOpen(false);
            setOpen(false);
            setFormState({ ...initialPayload });
            setFormStateCopy({ ...initialPayload });
        }, []);

        const handleFormChange = React.useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = event.target;
                setFormState((prev) => ({
                    ...prev,
                    [name]: value.toLowerCase()
                }));
                setErrorState((prev) => ({
                    ...prev,
                    [name]: value.length ? undefined : `please provide ${name}`
                }));
            },
            []
        );

        // const handleGeneratePassword = React.useCallback(() => {
        //     setFormState((prev) => ({ ...prev, password: nanoid() }));
        //     setErrorState({ password: undefined });
        // }, []);

        const handleRoleSelection = React.useCallback(
            (role: Role) => {
                if (role.id === "creation") {
                    //open another sheet
                    createRoleRef.current?.click();
                } else {
                    setSelectedRole(role);
                    setAddingErrorMsg(role ? "" : "Select role for this user");
                }
            },
            [createRoleRef]
        );

        return (
            <>
                <Prompt
                    isOpen={isCancelPromptOpen}
                    toggleModal={toggleModal}
                    action={closePromptAndMemberForm}
                    title="Unsaved Changes"
                    contentMsg="Closing this form would erase any progress made, are you sure you want to close?"
                    actionMsg="close"
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
                                            mode: errorState.firstname
                                                ? "error"
                                                : "default"
                                        })}
                                    />
                                </div>
                                <p className="text-sm my-2 text-red-500">
                                    {errorState.firstname}
                                </p>
                            </div>
                            <div>
                                <label
                                    htmlFor="lastname"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Lastname
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
                                            mode: errorState.lastname
                                                ? "error"
                                                : "default"
                                        })}
                                    />
                                </div>
                                <p className="text-sm my-2 text-red-500">
                                    {errorState.lastname}
                                </p>
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
                                <p className="text-sm my-2 text-red-500">
                                    {errorState.email}
                                </p>
                            </div>
                            {/* <div>
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
                                    <p className="text-sm my-2 text-red-500">
                                        {errorState.password}
                                    </p>
                                </div>
                            </div> */}
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
                                            } as any,
                                            ...roles
                                        ]}
                                        initiallySelectedOption={
                                            selectedRole?.label
                                        }
                                        onSelectItem={handleRoleSelection}
                                    />
                                    <p className="text-sm my-2 text-red-500">
                                        {addingErrorMsg}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <SheetFooter className="mt-8">
                            <Button
                                type="submit"
                                loadingText={
                                    currentMember ? "Updating" : "Adding"
                                }
                                text={
                                    currentMember
                                        ? "Update member"
                                        : "Add member"
                                }
                                loading={addingMember}
                                className="text-white w-36 h-10 rounded-lg primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                                onClick={addNewMember}
                            />
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
);
