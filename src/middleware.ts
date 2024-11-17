import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isUserRoute = createRouteMatcher(["/user(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/signin", "/signup"]);

const signInUrl = "/signin";
const adminDefUrl = "/admin";
const userDefUrl = "/user/dashboard";

export default clerkMiddleware(async (auth, req) => {
  // console.log("auth ===>", await auth())
  // console.log("req ===>", req)

  const authData = await auth();
  const userid = authData?.sessionClaims?.sub;

  const publicMetadata: any = authData?.sessionClaims?.mda;
  const role = publicMetadata?.role;

  // console.log("mmmmm", isAuthRoute(req), isUserRoute(req), isAdminRoute(req));

  if (isAuthRoute(req) && userid) {
    const redirectUrl = role === "admin" ? adminDefUrl : userDefUrl;
    return Response.redirect(new URL(redirectUrl, req.url).toString(), 302);
  }

  // const isAdmin = user?.publicMetadata?.isAdmin;
  if (isUserRoute(req) && !userid) {
    // await auth.protect();
    // This will redirect unauthenticated users to the sign-in page
    const url = new URL(signInUrl, req.url);
    return Response.redirect(url.toString(), 302);
  }

  // Protect /admin route: requires the user to have specific permissions
  if (isAdminRoute(req) && (!userid || role !== "admin")) {
    // await auth.protect();
    const url = new URL(signInUrl, req.url);
    return Response.redirect(url.toString(), 302);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
