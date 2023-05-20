"use client";
import React, { FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@assets/images/kolony-logo.webp";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { inputClasses } from "../../../../components/Input/input";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { useRouter } from "next/navigation";

interface LoginFormValues {
    email: string;
    password: string;
}

export default function Login() {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<LoginFormValues>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const { supabase } = useBrowserSupabase();
    const router = useRouter();

    const handleLoginFormSubmission = React.useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            return handleSubmit(async (values) => {
                try {
                    setLoading(true);
                    const { data, error } =
                        await supabase.auth.signInWithPassword(values);
                    if (error) throw error;
                    toast.success("Successful login");
                    router.replace("/dashboard");
                } catch (err) {
                    toast.error("Failed to login");
                } finally {
                    setLoading(false);
                }
            })();
        },
        [handleSubmit, router, supabase.auth]
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
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Login to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    className="space-y-6"
                    onSubmit={handleLoginFormSubmission}
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={inputClasses({
                                    mode: errors.email ? "error" : "default"
                                })}
                                {...register("email", { required: true })}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className={inputClasses({
                                    mode: errors.password ? "error" : "default"
                                })}
                                {...register("password", { required: true })}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
                                        viewBox="0 0 24 24"
                                    ></svg>
                                    Signing in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{" "}
                    <Link
                        href="/register"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                        Register
                    </Link>
                </p>
            </div>

            <div className="flex items-center mb-4 mt-8">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="mx-4 text-black text-sm">Continue with</div>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="flex justify-center space-x-4">
                <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-8 rounded flex">
                    Facebook
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded">
                    Google
                </button>
            </div>
        </div>
    );
}
