"use client";

import { Compass, MailCheck } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-180px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <Compass className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Thank you for signing up!</h1>
          <p className="text-sm opacity-60">Check your email to get started</p>
        </header>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <MailCheck className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              You&apos;ve successfully signed up. Please check your email to
              confirm your account before signing in.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-yellow-600 dark:text-yellow-400 font-medium hover:underline"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
