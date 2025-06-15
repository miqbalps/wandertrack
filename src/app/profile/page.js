'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profil</h1>
      {user ? (
        <p>Hai, {user.email}</p>
      ) : (
        <p>Memuat data pengguna...</p>
      )}
    </div>
  );
}