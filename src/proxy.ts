import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isApiRoute = req.nextUrl.pathname.startsWith("/api/admin");

  if (!isLoggedIn && !isLoginPage) {
    if (isApiRoute) {
      return new Response("Unauthorized", { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
