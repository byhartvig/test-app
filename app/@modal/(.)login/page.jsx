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
import { useRouter } from "next/navigation";

import React from "react";

const LoginModal = () => {
  const router = useRouter();
  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Please fill in the form to create an account
          </DialogDescription>
        </DialogHeader>
        <LoginForm hideCardStyle />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
