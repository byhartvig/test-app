import Image from "next/image";
import Link from "next/link";
import { getUserWithProfile } from "@/utils/auth";
import UserProfile from "@/components/UserProfile";
export default async function Home() {
  const { user, profile } = await getUserWithProfile();

  return (
    <div className="min-h-screen min-w-screen flex items-center flex-col justify-center">
      <h1 className="text-3xl font-bold">Intercepting routes</h1>
      {user ? (
        <div className="flex flex-col items-center">
          <UserProfile />
          <Link
            className="bg-neutral-50 text-sm font-medium mt-4 px-4 py-2 rounded text-neutral-950"
            href="/account"
          >
            Go to account
          </Link>
        </div>
      ) : (
        <Link
          className="bg-neutral-50 text-sm font-medium mt-4 px-4 py-2 rounded text-neutral-950"
          href="/login"
        >
          Register today
        </Link>
      )}
    </div>
  );
}
