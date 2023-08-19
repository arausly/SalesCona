"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@components/Button";
import { inputClasses } from "@components/Input/input";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { baseURL } from "@lib/constants";

//images
import logo from "@assets/images/kolony-logo.webp";

export default function ChangePassword() {
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>("");
    const [errMsg, setErrMsg] = React.useState<string>("");
    const { supabase } = useBrowserSupabase();

    const handleForgotPassword = React.useCallback(
        async (e: FormEvent) => {
            try {
                e.preventDefault();
                if (!email.length) return;
                setLoading(true);
                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(
                        email,
                        {
                            redirectTo: `${baseURL}/verify`
                        }
                    );
                    if (!error) {
                        router.replace("/verify");
                    } else {
                        setErrMsg(
                            "Something went wrong, please try again later"
                        );
                    }
                } catch (err) {
                } finally {
                    setLoading(false);
                }
            } catch (err) {}
        },
        [email, supabase]
    );

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    className="mx-auto h-10 w-auto"
                    src={logo}
                    alt="company logo"
                    placeholder="blur"
                />
                <h2 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
                    Forgot password
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleForgotPassword}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Your account email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                placeholder="boyega-ads@gmail.com"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClasses({
                                    mode: "default"
                                })}
                            />
                        </div>
                    </div>
                    <p className="text-sm my-2 text-red-500">{errMsg}</p>
                    <div>
                        <Button
                            loading={loading}
                            loadingText="Sending..."
                            text="Send reset instructions"
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center h-12 rounded-md primary-bg px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#393053] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                    </div>
                </form>
                <p className="mt-10 text-center text-sm text-gray-500">
                    Go back to{" "}
                    <Link
                        href="/login"
                        className="font-semibold leading-6 primary-color hover:text-[#635985]"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
