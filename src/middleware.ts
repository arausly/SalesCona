import { baseURL } from "@lib/constants";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const { pathname, href } = req.nextUrl;

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (
        session &&
        (pathname.startsWith("/login") ||
            pathname.startsWith("/register") ||
            pathname.startsWith("/verify"))
    ) {
        req.nextUrl.pathname = "/dashboard";
        return NextResponse.redirect(req.nextUrl);
    }

    if (
        !session &&
        (pathname.startsWith("/_next") ||
            pathname.startsWith("/api") ||
            pathname.startsWith("/static") ||
            pathname.startsWith("/login") ||
            pathname.startsWith("/register") ||
            pathname.startsWith("/verify") ||
            pathname.startsWith("/favicon.ico") ||
            pathname.startsWith("/forgot-password") ||
            pathname.startsWith("/shop") ||
            href === `${baseURL}/`)
    ) {
        return NextResponse.next();
    }

    if (!session) {
        req.nextUrl.pathname = "/login";
        return NextResponse.redirect(req.nextUrl);
    }

    return res;
}
