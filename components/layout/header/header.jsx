"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { UserNav } from "./user-nav";
import { useUser } from "@/components/providers/user-provider";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Settings", href: "/settings" },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Logo</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  pathname === item.href
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary hover:border-b-2 hover:border-primary/40"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserNav />
            ) : (
              <Button asChild variant="default">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
