import { Compass, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function Page({ searchParams }) {
  const params = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-180px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <Compass className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Something went wrong</h1>
          <p className="text-sm opacity-60">We encountered an error</p>
        </header>

        {/* Error Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="text-center">
              {params?.error ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Error code: <span className="font-mono">{params.error}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  An unspecified error occurred.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-yellow-600 dark:text-yellow-400 font-medium hover:underline"
          >
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
}
