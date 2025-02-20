"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { getHashParams } from "@lib/route-utils";

/**
 *
 * if there are tokens then process them and redirect as appropriate.
 * else would state to check email for confirmation and possible resend email link.
 *
 */
export default function VerifyAccount() {
    const { supabase } = useBrowserSupabase();
    const router = useRouter();

    React.useEffect(() => {
        const { access_token, refresh_token, type } = getHashParams();
        if (access_token && refresh_token) {
            (async () => {
                const { error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token
                });

                if (!error) {
                    type === "recovery"
                        ? router.push("/change-password")
                        : router.push("/login");
                }
            })();
        }
    }, [supabase.auth]);

    return (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
            <iframe src="https://embed.lottiefiles.com/animation/74623"></iframe>
            <p className="mt-2 text-gray-700 text-xl md:text-base text-center">
                Check your email for a confirmation link
            </p>
        </div>
    );
}
