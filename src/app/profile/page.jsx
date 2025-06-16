"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Fingerprint,
  CalendarDays,
  Clock4,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

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

  const handleLogout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatConfirmationSentAt = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
  };

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 bg-white rounded-md shadow-sm p-3">
      <div className="mt-1 text-yellow-700">
        <Icon size={18} />
      </div>
      <div>
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-sm text-gray-600">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-700">👤 Profile</h1>
          <button
            onClick={handleLogout}
            className="h-fit px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-50 rounded-md transition-colors duration-200 cursor-pointer flex items-center gap-2"
          >
            Logout <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {user ? (
          <div className="space-y-4">
            <DetailItem icon={Mail} label="Email" value={user.email || "-"} />
            <DetailItem
              icon={Fingerprint}
              label="User UID"
              value={user.id || "-"}
            />
            <DetailItem
              icon={CalendarDays}
              label="Created at"
              value={formatDateTime(user.created_at)}
            />
            <DetailItem
              icon={CalendarDays}
              label="Updated at"
              value={formatDateTime(user.updated_at)}
            />
            <DetailItem
              icon={Clock4}
              label="Invited at"
              value={user.invited_at ? formatDateTime(user.invited_at) : "-"}
            />
            <DetailItem
              icon={Clock4}
              label="Confirmation sent at"
              value={formatConfirmationSentAt(user.confirmation_sent_at)}
            />
            <DetailItem
              icon={CheckCircle2}
              label="Confirmed at"
              value={formatDateTime(user.confirmed_at)}
            />
            <DetailItem
              icon={Clock4}
              label="Last signed in"
              value={formatDateTime(user.last_sign_in_at)}
            />
            <DetailItem
              icon={ShieldCheck}
              label="SSO"
              value={user.app_metadata?.providers?.length > 0 ? "✓" : "X"}
            />

            <div className="mt-6 border-t pt-4">
              <p className="font-semibold">Provider Information</p>
              <p className="text-sm text-gray-600">
                {user.app_metadata?.providers?.length > 0
                  ? `The user has the following providers: ${user.app_metadata.providers.join(
                      ", "
                    )}`
                  : "No providers linked."}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            Tidak ada data pengguna yang tersedia atau terjadi kesalahan saat
            memuat.
          </p>
        )}
      </div>
    </div>
  );
}
