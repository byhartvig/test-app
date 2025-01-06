"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(formData) {
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").upsert({
    id: formData.id,
    avatar_url: formData.avatar_url,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;

  // Revalidate all pages that use the user data
  revalidatePath("/", "layout");
}
