import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen min-w-screen flex items-center flex-col justify-center">
      <h1 className="text-3xl font-bold">Intercepting routes</h1>
      <Link
        className="bg-neutral-50 text-sm font-medium mt-4 px-4 py-2 rounded text-neutral-950"
        href="/login"
      >
        Register today
      </Link>
    </div>
  );
}
