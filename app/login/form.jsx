"use client";
import { login, signup } from "./actions";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/components/providers/user-provider";

export default function LoginFormular() {
  const router = useRouter();
  const pathname = usePathname();
  const { updateUser } = useUser();
  const isModal = pathname.includes("(.)login");

  async function handleLogin(formData) {
    const result = await login(formData);
    if (result.success) {
      updateUser(result.user);
      router.push("/account");
      if (isModal) {
        router.back();
      }
    }
  }

  async function handleSignup(formData) {
    const result = await signup(formData);
    if (result.success) {
      updateUser(result.user);
      router.push("/account");
      if (isModal) {
        router.back();
      }
    }
  }

  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={handleLogin}>Log in</button>
      <button formAction={handleSignup}>Sign up</button>
    </form>
  );
}
