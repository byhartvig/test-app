import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { logServerEvent } from "@/utils/server-logger";

export async function POST(req) {
  const supabase = await createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Log before signing out so we still have the user info
    await logServerEvent("auth", "sign_out", user.id, {
      email: user.email,
    });

    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/login", req.url), {
    status: 302,
  });
}
