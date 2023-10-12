import React, { FormEvent } from "react";
import { useBrowserSupabase } from "@lib/supabaseBrowser";

//images
import { Button } from "@components/Button";
import { inputClasses } from "@components/Input/input";
import { toast } from "react-toastify";

export const ChangePassword = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [formState, setFormState] = React.useState<{
        password: string;
        confirmed: string;
    }>({ password: "", confirmed: "" });
    const [errMsg, setErrMsg] = React.useState<string>("");
    const { supabase } = useBrowserSupabase();

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormState((prev) => {
                if (name === "confirmed" && prev.password !== value) {
                    setErrMsg("Password mismatch");
                } else {
                    setErrMsg("");
                }
                return { ...prev, [name]: value };
            });
        },
        []
    );

    const changePassword = React.useCallback(
        async (e: FormEvent) => {
            try {
                e.preventDefault();
                if (!formState.password.length) return;
                setLoading(true);
                const { error } = await supabase.auth.updateUser({
                    password: formState.password
                });
                if (!error) {
                    toast(
                        <p className="text-sm">Password change successfully</p>,
                        {
                            type: "success"
                        }
                    );
                } else {
                    toast(
                        <p className="text-sm">Failed to change password</p>,
                        {
                            type: "error"
                        }
                    );
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        },
        [formState, supabase]
    );

    const isDisabled = !!(
        loading ||
        !formState.password ||
        !formState.confirmed ||
        errMsg
    );

    return (
        <div className="flex flex-col w-full items-center justify-center px-6 mt-20 lg:px-8">
            <p className="text-lg mb-4">Change Password</p>
            <form
                className="space-y-9 w-full md:w-2/4"
                onSubmit={changePassword}
            >
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        New Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="password"
                            type="password"
                            placeholder="new secret"
                            required
                            name="password"
                            value={formState.password}
                            onChange={handleChange}
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
                        Confirm Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="confirm new secret"
                            required
                            name="confirmed"
                            value={formState.confirmed}
                            onChange={handleChange}
                            className={inputClasses({
                                mode: errMsg ? "error" : "default"
                            })}
                        />
                    </div>
                    <p className="text-sm my-2 text-red-500">{errMsg}</p>
                </div>
                <div>
                    <Button
                        loading={loading}
                        loadingText="Changing..."
                        text="Change Password"
                        type="submit"
                        disabled={isDisabled}
                        className={`${
                            isDisabled
                                ? "bg-[#6d67e47f]"
                                : "primary-bg hover:bg-indigo-500"
                        } flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    />
                </div>
            </form>
        </div>
    );
};
