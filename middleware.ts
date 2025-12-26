import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		// RBAC Logic can go here if needed, or in the page itself
		// For now, we trust access control in UI and API
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
		pages: {
			signIn: "/login",
		},
	}
);

export const config = {
	matcher: ["/dashboard/:path*"],
};
