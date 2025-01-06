import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name) {
          const cookieStore = await cookies();
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        async set(name, value, options) {
          const cookieStore = await cookies();
          cookieStore.set(name, value, options);
        },
        async remove(name, options) {
          const cookieStore = await cookies();
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
};

export async function getServerUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserWithProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

export async function createServerSupabaseClient() {
  return await createClient();
}
