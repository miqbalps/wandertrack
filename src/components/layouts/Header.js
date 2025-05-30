"use client";

import { Compass, Sun, Moon } from "lucide-react";

const fontFamily =
  "'Gill Sans', 'Gill Sans MT', 'Century Gothic', 'Apple Gothic', sans-serif";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <>
      {/* Vibrant top border with gradient */}
      <div
        className={`fixed top- z-10 w-full max-w-[500px] ${
          darkMode ? "bg-gray-950" : "bg-white"
        }`}
      >
        <div className="h-2 bg-yellow-500 w-full sticky top-0 z-50"></div>

        {/* Simplified Header */}
        <header className="px-4 py-3 flex justify-between items-center sticky top-2 z-40">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-yellow-500 animate-spin-slow" />
            <span
              className="text-2xl font-bold text-transparent bg-clip-text bg-yellow-500"
              style={{ fontFamily: fontFamily }}
            >
              WanderTrack
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </header>
      </div>
    </>
  );
}
