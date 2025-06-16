"use client";

import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
