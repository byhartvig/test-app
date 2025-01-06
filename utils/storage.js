import { createClient } from "@/utils/supabase/client";

export async function downloadImage(path) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);

    if (error) {
      throw error;
    }

    const url = URL.createObjectURL(data);
    return { url, error: null };
  } catch (error) {
    console.error("Error downloading image:", error);
    return { url: null, error };
  }
}

// Cleanup function to prevent memory leaks
export function revokeImageUrl(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}
