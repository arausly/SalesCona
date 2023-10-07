import React, { FormEvent } from "react";
import { useBrowserSupabase } from "@lib/supabaseBrowser";

//images
import { Button } from "@components/Button";
import { inputClasses } from "@components/Input/input";
import { toast } from "react-toastify";

export const ChangePassword = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>("");
    const { supabase } = useBrowserSupabase();

    const handleChangePassword = React.useCallback(
        async (e: FormEvent) => {
            try {
                e.preventDefault();
                if (!password.length) return;
                setLoading(true);
                const { error } = await supabase.auth.updateUser({ password });
                if (!error) {
                    toast(
                        <p className="text-sm">Password change successful</p>,
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
        [password, supabase]
    );

    const isDisabled = loading;

    return (
        <div className="flex flex-col w-full items-center justify-center px-6 mt-20 lg:px-8">
            <p className="text-lg mb-4">Change Password</p>
            <form
                className="space-y-6 w-full md:w-2/4"
                onSubmit={handleChangePassword}
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
                            placeholder="newsecret"
                            autoComplete="email"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            placeholder="confirmed newsecret"
                            autoComplete="email"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClasses({
                                mode: "default"
                            })}
                        />
                    </div>
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
