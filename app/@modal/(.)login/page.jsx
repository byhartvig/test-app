"use client";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/loginForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

import React from "react";
import LoginFormular from "@/app/login/form";

const LoginModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setOpen(false);
      }
    };
    checkAuth();
  }, [router, supabase, searchParams]);

  return (
    <Dialog defaultOpen open={open} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Please fill in the form to create an account
          </DialogDescription>
        </DialogHeader>
        <LoginFormular />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
