"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import logo from "@assets/images/kolony-logo.webp";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { inputClasses } from "../../../../components/Input/input";
import { useRouter } from "next/navigation";
import { useBrowserSupabase } from "@lib/supabaseBrowser";

interface RegisterFormValues {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

export default function Register() {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<RegisterFormValues>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const router = useRouter();
    const { supabase } = useBrowserSupabase();

    const handleRegisterFormSubmission = React.useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            return handleSubmit(async (values) => {
                try {
                    setLoading(true);
                    const { data, error } = await supabase.auth.signUp({
                        ...values,
                        options: {
                            emailRedirectTo: `${window.location.protocol}//${window.location.hostname}:3000/verify`,
                            data: {
                                firstname: values.firstname,
                                lastname: values.lastname
                            }
                        }
                    });
                    if (error) throw error;
                    toast.success("Successfully registered");
                    router.replace("/verify");
                } catch (err) {
                    toast.error("Failed to register");
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
                    Register your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    className="space-y-6"
                    onSubmit={handleRegisterFormSubmission}
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
                                {...register("email", { required: true })}
                                className={inputClasses({
                                    mode: errors.email ? "error" : "default"
                                })}
                            />
                        </div>
                    </div>
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
                                autoComplete="firstname"
                                required
                                {...register("firstname", { required: true })}
                                className={inputClasses({
                                    mode: errors.firstname ? "error" : "default"
                                })}
                            />
                        </div>
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
                                autoComplete="lastname"
                                required
                                {...register("lastname", { required: true })}
                                className={inputClasses({
                                    mode: errors.lastname ? "error" : "default"
                                })}
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
                                {...register("password", {
                                    required: true,
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters"
                                    }
                                })}
                                className={inputClasses({
                                    mode: errors.password ? "error" : "default"
                                })}
                            />
                            {errors.password ? (
                                <p className="mt-2 text-red-600">
                                    {errors.password?.message}
                                </p>
                            ) : (
                                <p className="mt-2 text-sm text-gray-500">
                                    Password must at least be 6 characters long
                                </p>
                            )}
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
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                        Login
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
