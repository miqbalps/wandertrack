"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);
      setLoading(false);
    }

    checkUser();
  }, []);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profil</h1>
      {user ? <p>Hai, {user.email}</p> : <p>Memuat data pengguna...</p>}
    </div>
  );
}
