"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { logServerEvent } from "@/utils/server-logger";
import { getUserWithProfile } from "@/utils/auth";

export async function login(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error, data: authData } = await supabase.auth.signInWithPassword(
    data
  );

  if (error) {
    await logServerEvent("auth", "sign_in_failed", null, {
      email: data.email,
      error: error.message,
    });
    return { success: false, error };
  }

  await logServerEvent("auth", "sign_in_success", authData.user.id, {
    email: authData.user.email,
  });

  // Get the full user data with profile
  const { user, profile } = await getUserWithProfile();
  const userData = user ? { ...user, ...profile } : null;

  revalidatePath("/", "layout");
  return { success: true, user: userData };
}

export async function signup(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error, data: authData } = await supabase.auth.signUp(data);

  if (error) {
    await logServerEvent("auth", "sign_up_failed", null, {
      email: data.email,
      error: error.message,
    });
    return { success: false, error };
  }

  await logServerEvent("auth", "sign_up_success", authData.user.id, {
    email: authData.user.email,
  });

  // Get the full user data with profile
  const { user, profile } = await getUserWithProfile();
  const userData = user ? { ...user, ...profile } : null;

  revalidatePath("/", "layout");
  return { success: true, user: userData };
}
