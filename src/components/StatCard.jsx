"use client";

import { cn } from "@/lib/utils";

export default function StatCard({ Icon, label, value, className }) {
  if (!Icon) return null;

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
