"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

//components
import { Button } from "@components/Button";
//hooks
import { useBrowserSupabase } from "@lib/supabaseBrowser";
//db
import { tables } from "@db/tables.db";
//types
import { Merchant, MerchantStaff } from "../../dashboard/typing";
//utils
import { extractStaffId } from "@lib/common.utils";
//images
import logo from "@assets/images/kolony-logo.webp";
//css
import { inputClasses } from "../../../../components/Input/input";
//constants
import { baseURL } from "@lib/constants";

interface RegisterFormValues {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

//
export default function Register({
    searchParams: { auth: staffAuthInfo }
}: {
    searchParams: { auth: string };
}) {
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<RegisterFormValues>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [errMsg, setErrMsg] = React.useState<string>("");
    const router = useRouter();
    const { supabase } = useBrowserSupabase();
    const [existingMerchantStaff, setExistingMerchantStaff] =
        React.useState<MerchantStaff>();

    //check for merchant staff and set defaults for inputs
    React.useEffect(() => {
        (async () => {
            if (staffAuthInfo) {
                const extractedInfo = extractStaffId(staffAuthInfo);
                if (extractedInfo) {
                    const { id } = extractedInfo;
                    //check that merchant with Id exist
                    const { data, error } = await supabase
                        .from(tables.merchant_staffs)
                        .select("*,owner(*)")
                        .eq("id", id)
                        .returns<MerchantStaff[]>();

                    if (data?.length && !error) {
                        const merchant_staff = data[0];
                        setExistingMerchantStaff(merchant_staff);
                        setValue("firstname", merchant_staff.firstname);
                        setValue("lastname", merchant_staff.lastname);
                        setValue("email", merchant_staff.email);
                    }
                }
            }
        })();
    }, [staffAuthInfo]);

    const handleRegisterFormSubmission = React.useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            return handleSubmit(async (values) => {
                try {
                    setLoading(true);
                    let merchant: Merchant | undefined = undefined;

                    //create merchant if not merchant_staff
                    if (!staffAuthInfo) {
                        const { data: merchantData, error: merchantError } =
                            await supabase
                                .from(tables.merchants)
                                .insert({
                                    email: values.email
                                })
                                .select()
                                .returns<Merchant[]>();

                        if (merchantData && !merchantError) {
                            merchant = merchantData[0];
                        }
                    }

                    //create user as either a merchant or a merchant_staff
                    const { data, error } = await supabase.auth.signUp({
                        ...values,
                        options: {
                            emailRedirectTo: `${baseURL}/verify`,
                            data: {
                                firstname: values.firstname,
                                lastname: values.lastname,
                                merchant_staff: existingMerchantStaff,
                                merchant
                            }
                        }
                    });
                    if (error) {
                        setErrMsg(
                            error?.status === 400
                                ? "You have entered either the wrong email or password"
                                : "Something unexpected happened"
                        );
                    } else if (data.user && !staffAuthInfo) {
                        //no merchant_staff markers then create as merchant
                        //todo replace with database triggers
                        await supabase.from(tables.merchants).update({
                            email: data.user.email,
                            user: data.user.id
                        });
                        router.replace("/verify");
                    }
                } catch (err) {
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
                    {staffAuthInfo
                        ? "Complete your registration"
                        : "Register your account"}
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
                                placeholder="john-doe@mail.com"
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
                                placeholder="John"
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
                                placeholder="Doe"
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
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="supersecret"
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
                    <p className="text-sm my-2 text-red-500">{errMsg}</p>
                    <div>
                        <Button
                            loading={loading}
                            loadingText="Registering"
                            text="Register"
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md primary-bg px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
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
        </div>
    );
}
