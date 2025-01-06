import { updateSession } from "@/utils/supabase/middleware";
import { logger } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const start = Date.now();

  try {
    // Update user's auth session
    const response = await updateSession(request);

    // Log the request
    const duration = Date.now() - start;
    await logger.logAPI(
      request.method,
      request.nextUrl.pathname,
      response.status,
      duration,
      {
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
      }
    );

    return response;
  } catch (error) {
    await logger.logError(error, {
      path: request.nextUrl.pathname,
      method: request.method,
    });
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
