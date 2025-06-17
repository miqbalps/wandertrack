"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Fingerprint,
  CalendarDays,
  Clock4,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Camera,
} from "lucide-react";
import StatCard from "@/components/StatCard";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalTrips = userTrips.length;
  const totalFootprints = userTrips.reduce(
    (acc, trip) => acc + (trip.footprints?.length || 0),
    0
  );

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    }

    checkUser();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      try {
        // First check auth session
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          router.push("/login");
          return;
        }

        // Get user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          router.push("/login");
          return;
        }

        // Get user's trips with all related data
        const { data: tripsData, error: tripsError } = await supabase
          .from("trips")
          .select(
            `
            *,
            footprints (
              id,
              title,
              cover_photo_url
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (tripsError) throw tripsError;

        // Process trips data
        const processedTrips = tripsData.map((trip) => ({
          ...trip,
          footprint_count: trip.footprints?.length || 0,
          photo_count:
            trip.footprints?.filter((f) => f.cover_photo_url).length || 0,
          cover_photo_url:
            trip.cover_photo_url ||
            trip.footprints?.find((f) => f.cover_photo_url)?.cover_photo_url ||
            "/default-trip-cover.jpg",
        }));

        setUser(user);
        setUserTrips(processedTrips);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const displayedRecentTrips = userTrips.slice(0, 2);

  const CompactDetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm">
      <Icon size={16} className="text-yellow-600" />
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950/95 p-6 ">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Profile
            </h1>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.reload();
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
            >
              Logout <ArrowRight className="w-4 h-4 inline" />
            </button>
          </div>

          {user && (
            <div className="grid md:grid-cols-2 gap-4 dark:text-white">
              <CompactDetailItem
                icon={Mail}
                label="Email"
                value={user.email || "-"}
              />
              <CompactDetailItem
                icon={Fingerprint}
                label="UID"
                value={user.id.slice(0, 8)}
              />
              <CompactDetailItem
                icon={CalendarDays}
                label="Joined"
                value={new Date(user.created_at).toLocaleDateString()}
              />
              <CompactDetailItem
                icon={Clock4}
                label="Last login"
                value={new Date(user.last_sign_in_at).toLocaleDateString()}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            Icon={MapPin} // Pass the component directly, not as a string
            label="Total Trips"
            value={totalTrips}
          />
          <StatCard
            Icon={Camera} // Pass the component directly, not as a string
            label="Total Footprints"
            value={totalFootprints}
          />
        </div>

        {/* User Trips */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              My Recent Trips
            </h2>
            <Link
              href="/trip/create"
              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-sm font-medium"
            >
              + New Trip
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          ) : displayedRecentTrips.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {displayedRecentTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trip/detail/${trip.id}`}
                  className="block group"
                >
                  <div className="relative h-32 rounded overflow-hidden shadow-sm hover:shadow transition-shadow">
                    <Image
                      src={trip.cover_photo_url || "/default-trip-cover.jpg"}
                      alt={trip.title}
                      fill
                      sizes={20}
                      priority={false}
                      quality={20}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h3 className="text-white text-sm font-medium truncate mb-0.5">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-white/90">
                        <span className="inline-flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded-full">
                          <MapPin className="w-3 h-3" />
                          {trip.footprint_count}
                        </span>
                        <span className="inline-flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded-full">
                          <Camera className="w-3 h-3" />
                          {trip.photo_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded">
              <MapPin className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No trips yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
