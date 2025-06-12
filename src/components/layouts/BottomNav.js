"use client";

import { Home, Search, Plus, BookOpen, User, CalendarDays } from "lucide-react"; // Import CalendarDays icon
import Link from "next/link";
import { usePathname } from 'next/navigation'; // Import usePathname untuk mendapatkan path saat ini

export default function BottomNav({ activeTab, setActiveTab, darkMode }) {
  const pathname = usePathname(); // Dapatkan path URL saat ini

  // Fungsi helper untuk menentukan apakah tab aktif
  const isActive = (path) => pathname === path;

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
          isActive("/") ? "text-yellow-500" : "text-gray-500" // Gunakan isActive
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            isActive("/") ? "bg-yellow-500/20" : "" // Gunakan isActive
          }`}
        >
          <Home
            className={`w-5 h-5 transition-all ${
              isActive("/") ? "scale-110" : "" // Gunakan isActive
            }`}
          />
        </div>
        <span className="text-xs mt-1">Home</span>
      </Link>

      <Link
        href={"/trip"} // Asumsi '/trip' adalah halaman explore Anda
        onClick={() => setActiveTab("explore")}
        className={`flex flex-col items-center p-2 relative ${
          isActive("/trip") ? "text-yellow-500" : "text-gray-500" // Gunakan isActive
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            isActive("/trip") ? "bg-yellow-500/20" : "" // Gunakan isActive
          }`}
        >
          <Search
            className={`w-5 h-5 transition-all ${
              isActive("/trip") ? "scale-110" : "" // Gunakan isActive
            }`}
          />
        </div>
        <span className="text-xs mt-1">Explore</span>
      </Link>

      <Link
        href={"/add"} // Ubah path ini ke /add atau /trip/add sesuai struktur yang benar
        onClick={() => setActiveTab("create")}
        className="flex flex-col items-center p-2 relative -mt-8"
      >
        <div className="bg-yellow-500 text-black rounded-full p-3 shadow-lg transform hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </div>
        <span className="text-xs mt-2 text-yellow-500 font-bold">Create</span>
      </Link>

      {/* ITEM NAVIGASI BARU UNTUK 'PLAN' */}
      <Link
        href={"/plan"} // <--- PENTING: Ubah path ini ke halaman Plan yang baru Anda buat
        onClick={() => setActiveTab("plan")}
        className={`flex flex-col items-center p-2 relative ${
          isActive("/plan") ? "text-yellow-500" : "text-gray-500" // Gunakan isActive
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            isActive("/plan") ? "bg-yellow-500/20" : "" // Gunakan isActive
          }`}
        >
          <CalendarDays // <--- Gunakan ikon CalendarDays untuk Plan
            className={`w-5 h-5 transition-all ${
              isActive("/plan") ? "scale-110" : "" // Gunakan isActive
            }`}
          />
        </div>
        <span className="text-xs mt-1">Plan</span>
      </Link>

      <Link
        href={"/profile"} // Asumsi '/profile' adalah halaman profile Anda
        onClick={() => setActiveTab("profile")}
        className={`flex flex-col items-center p-2 relative ${
          isActive("/profile") ? "text-yellow-500" : "text-gray-500" // Gunakan isActive
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            isActive("/profile") ? "bg-yellow-500/20" : "" // Gunakan isActive
          }`}
        >
          <User
            className={`w-5 h-5 transition-all ${
              isActive("/profile") ? "scale-110" : "" // Gunakan isActive
            }`}
          />
        </div>
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
}