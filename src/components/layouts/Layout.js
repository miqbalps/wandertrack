"use client";

import { useState } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

const fontFamily =
  "'Gill Sans', 'Gill Sans MT', 'Century Gothic', 'Apple Gothic', sans-serif";

export default function AppLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div
      className={`min-h-screen max-w-[500px] mx-auto overflow-x-hidden relative pb-16 ${
        darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900"
      }`}
      style={{ fontFamily }}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="relative">{children}</main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
      />
    </div>
  );
}
