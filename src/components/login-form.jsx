"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
// import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Compass, User, Lock, MailCheck } from "lucide-react";

function LoginForm({ className }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      window.location.href = "/profile";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <Compass className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
        <p className="text-sm opacity-60">Sign in to continue your adventure</p>
      </header>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-3">
          {/* Email Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <a
            href="/forgot-password"
            className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <span className="animate-spin">↻</span> : "Sign In"}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-6 text-center text-sm">
        <p className="opacity-60">
          Don't have an account?{" "}
          <a
            href="/sign-up"
            className="text-yellow-600 dark:text-yellow-400 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export { LoginForm };
