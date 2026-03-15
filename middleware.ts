import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        if (path.startsWith("/dashboard") && token?.role !== "RESTAURANT") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if ((path.startsWith("/restaurants") || path.startsWith("/cart") || path.startsWith("/orders")) && token?.role !== "CUSTOMER") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/restaurants/:path*",
        "/cart/:path*",
        "/orders/:path*"
    ],
};