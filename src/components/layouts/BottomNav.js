"use client";

import { Home, Search, Plus, BookOpen, User } from "lucide-react";
import Link from "next/link";

export default function BottomNav({ activeTab, setActiveTab, darkMode }) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto flex justify-around items-center py-3 px-4 ${
        darkMode
          ? "bg-gray-950/95 backdrop-blur border-t border-gray-700"
          : "bg-white/95 backdrop-blur border-t border-gray-200"
      }`}
    >
      <Link
        href={"/"}
        onClick={() => setActiveTab("home")}
        className={`flex flex-col items-center p-2 relative ${
          activeTab === "home" ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            activeTab === "home" ? "bg-yellow-500/20" : ""
          }`}
        >
          <Home
            className={`w-5 h-5 transition-all ${
              activeTab === "home" ? "scale-110" : ""
            }`}
          />
        </div>
        <span className="text-xs mt-1">Home</span>
      </Link>

      <Link
        href={"/trip"}
        onClick={() => setActiveTab("explore")}
        className={`flex flex-col items-center p-2 relative ${
          activeTab === "explore" ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            activeTab === "explore" ? "bg-yellow-500/20" : ""
          }`}
        >
          <Search
            className={`w-5 h-5 transition-all ${
              activeTab === "explore" ? "scale-110" : ""
            }`}
          />
        </div>
        <span className="text-xs mt-1">Explore</span>
      </Link>

      <Link
        href={"/trip/add"}
        onClick={() => setActiveTab("create")}
        className="flex flex-col items-center p-2 relative -mt-8"
      >
        <div className="bg-yellow-500 text-black rounded-full p-3 shadow-lg transform hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </div>
        <span className="text-xs mt-2 text-yellow-500 font-bold">Create</span>
      </Link>

      <Link
        href={"/trip"}
        onClick={() => setActiveTab("plan")}
        className={`flex flex-col items-center p-2 relative ${
          activeTab === "plan" ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            activeTab === "plan" ? "bg-yellow-500/20" : ""
          }`}
        >
          <BookOpen
            className={`w-5 h-5 transition-all ${
              activeTab === "plan" ? "scale-110" : ""
            }`}
          />
        </div>
        <span className="text-xs mt-1">Plan</span>
      </Link>

      <Link
        href={"/trip"}
        onClick={() => setActiveTab("profile")}
        className={`flex flex-col items-center p-2 relative ${
          activeTab === "profile" ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            activeTab === "profile" ? "bg-yellow-500/20" : ""
          }`}
        >
          <User
            className={`w-5 h-5 transition-all ${
              activeTab === "profile" ? "scale-110" : ""
            }`}
          />
        </div>
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
}
