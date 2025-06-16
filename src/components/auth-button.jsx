// // auth-button.js
// async function createAuthButton() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const container = document.createElement("div");

//   if (user) {
//     container.className = "flex items-center gap-4";
//     container.innerHTML = `Hey, ${user.email}!`;

//     const logoutButton = document.createElement("button");
//     logoutButton.onclick = async () => {
//       await supabase.auth.signOut();
//       window.location.reload();
//     };
//     logoutButton.textContent = "Logout";
//     container.appendChild(logoutButton);
//   } else {
//     container.className = "flex gap-2";

//     // Sign in button
//     const signInLink = document.createElement("a");
//     signInLink.href = "/login";
//     const signInButton = document.createElement("button");
//     signInButton.className = "button-outline button-sm";
//     signInButton.textContent = "Sign in";
//     signInLink.appendChild(signInButton);

//     // Sign up button
//     const signUpLink = document.createElement("a");
//     signUpLink.href = "/sign-up";
//     const signUpButton = document.createElement("button");
//     signUpButton.className = "button-default button-sm";
//     signUpButton.textContent = "Sign up";
//     signUpLink.appendChild(signUpButton);

//     container.appendChild(signInLink);
//     container.appendChild(signUpLink);
//   }

//   return container;
// }

// // Usage:
// document.addEventListener("DOMContentLoaded", async () => {
//   const authButton = await createAuthButton();
//   document.querySelector("#auth-button-container").appendChild(authButton);
// });

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
// import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function AuthButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (user) {
    return (
      <div className="flex items-center gap-4 justify-between rounded-lg">
        <span className="font-medium text-gray-700">Hey, {user.email}!</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-50 rounded-md transition-colors duration-200 cursor-pointer"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-end">
      <Link href="/login">
        <button className="px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 bg-yellow-100 hover:bg-yellow-50 rounded-md transition-colors duration-200 cursor-pointer">
          Sign in
        </button>
      </Link>
      <Link href="/sign-up">
        <button className="px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 bg-yellow-100 hover:bg-yellow-50 rounded-md transition-colors duration-200 cursor-pointer">
          Sign up
        </button>
      </Link>
    </div>
  );
}
