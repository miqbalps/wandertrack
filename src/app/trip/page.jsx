"use client";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TripListPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [trips, setTrips] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const supabase = createClient();

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
    const fetchData = async () => {
      try {
        // First check for session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError.message);
          // Continue without user - will show public trips only
        }

        if (session?.user) {
          setCurrentUser(session.user);
        }

        // Fetch trips with tags and footprints count
        const { data: tripsData, error: tripsError } = await supabase
          .from("trips")
          .select(
            `
            *,
            trip_tags (
              tags (
                id,
                name,
                slug
              )
            ),
            footprints (
              id
            )
          `
          )
          .eq("is_public", true)
          .order("created_at", { ascending: false });

        if (tripsError) {
          console.error("Error fetching trips:", tripsError.message);
          throw tripsError;
        }

        // Process the data to match our component needs
        const processedTrips =
          tripsData?.map((trip) => ({
            ...trip,
            username:
              session?.user?.id === trip.user_id
                ? "You"
                : `user_${trip.user_id?.slice(-8) || "anonymous"}`,
            footprint_count: trip.footprints?.length || 0,
            tags: trip.trip_tags?.map((tt) => tt.tags) || [],
          })) || [];

        setTrips(processedTrips);
      } catch (error) {
        console.error("Error in fetchData:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    fetchData();

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center text-yellow-500">Loading</div>
        <div className="animate-spin text-yellow-500">↻</div>
      </div>
    );

  // Filter trips based on search and filter
  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myTrips = filteredTrips.filter(
    (trip) => trip.user_id === currentUser?.id
  );
  const otherTrips = filteredTrips.filter(
    (trip) => trip.user_id !== currentUser?.id
  );

  // Limit to 3 trips per section for display
  const displayedMyTrips = myTrips.slice(0, 5);
  const displayedOtherTrips = otherTrips.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-yellow-500">↻</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mb-16">
      {/* Page Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold">Explore Trips</h1>
            <p className="text-xs opacity-60">Track your adventures</p>
          </div>
          <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
            {myTrips.length + otherTrips.length} trips
          </span>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </header>

      {/* Trip List */}
      <main className="px-4 pb-16">
        {/* My Trips Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold opacity-70 uppercase tracking-wider">
              My Trips
            </h2>
            {myTrips.length > 3 && (
              <Link
                href="/trip/my"
                className="text-xs flex items-center text-yellow-600 dark:text-yellow-400 font-medium"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {displayedMyTrips.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto pb-3 -mx-4 px-4">
                <div
                  className="flex gap-3 items-strectch"
                  // style={{ width: `${displayedMyTrips.length * 180}px` }}
                >
                  {displayedMyTrips.map((trip) => (
                    <VerticalTripCard
                      key={trip.id}
                      trip={trip}
                      isOwner={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Compass className="mx-auto w-6 h-6 text-gray-300 dark:text-gray-600 mb-2" />
              <h3 className="text-sm font-medium mb-1">No trips found</h3>
              <p className="text-xs opacity-60 mb-3">
                Create your first adventure
              </p>
              <Link
                href="/trip/add"
                className="text-xs px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> New Trip
              </Link>
            </div>
          )}
        </section>

        {/* Other Trips Section */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold opacity-70 uppercase tracking-wider">
              Other Trips
            </h2>
            {otherTrips.length > 3 && (
              <Link
                href="/trip/community"
                className="text-xs flex items-center text-yellow-600 dark:text-yellow-400 font-medium"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {displayedOtherTrips.length > 0 ? (
            <div className="grid gap-4">
              {displayedOtherTrips.map((trip) => (
                <HorizontalTripCard key={trip.id} trip={trip} isOwner={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Compass className="mx-auto w-6 h-6 text-gray-300 dark:text-gray-600 mb-2" />
              <h3 className="text-sm font-medium mb-1">No trips found</h3>
              <p className="text-xs opacity-60">Try adjusting your search</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function VerticalTripCard({ trip, isOwner }) {
  return (
    <Link
      href={`/trip/detail/${trip.id}`}
      className="group block w-[180px] flex-shrink-0"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-colors shadow-sm hover:shadow-md h-[240px]">
        {/* Cover Image */}
        <div className="relative h-[120px] w-full">
          {trip.cover_photo_url ? (
            <Image
              src={trip.cover_photo_url}
              alt={trip.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes={20}
              quality={20}
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Compass className="w-8 h-8 text-gray-400" />
            </div>
          )}
          {isOwner && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-medium px-1.5 py-0.5 rounded-full">
              Yours
            </div>
          )}
        </div>

        {/* Trip Info */}
        <div className="p-3 flex-grow flex flex-col justify-between">
          <div>
            {" "}
            {/* Wrapper untuk judul dan deskripsi */}
            <h2 className="font-semibold text-sm line-clamp-1 group-hover:text-yellow-500 dark:group-hover:text-yellow-400">
              {trip.title}
            </h2>
            <p className="text-xs opacity-60 line-clamp-2 mt-1 min-h-[2.5rem]">
              {" "}
              {/* PENTING: Tambahkan min-h-[2.5rem] */}
              {trip.description}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
            <span className="inline-flex items-center bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-full">
              <User className="w-2.5 h-2.5 mr-0.5" />@{trip.username}
            </span>
            <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
              <MapPin className="w-2.5 h-2.5 mr-0.5" />
              {trip.footprint_count} stops
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HorizontalTripCard({ trip, isOwner }) {
  return (
    <Link
      href={isOwner ? `/trip/my/${trip.id}` : `/trip/detail/${trip.id}`}
      className="group block"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-colors shadow-sm hover:shadow-md">
        <div className="flex">
          {/* Cover Image */}
          <div className="relative w-1/4 h-auto flex-shrink-0">
            {trip.cover_photo_url ? (
              <Image
                src={trip.cover_photo_url}
                alt={trip.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes={20}
                quality={20}
                priority={false}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Compass className="w-6 h-6 text-gray-400" />
              </div>
            )}
            {isOwner && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                Yours
              </div>
            )}
          </div>

          {/* Trip Info */}
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-sm line-clamp-1 group-hover:text-yellow-500 dark:group-hover:text-yellow-400">
                {trip.title}
              </h2>
              {trip.start_date && (
                <span className="text-xs opacity-60 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(trip.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  {trip.end_date && (
                    <>
                      -{" "}
                      {new Date(trip.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </>
                  )}
                </span>
              )}
            </div>

            <p className="text-xs opacity-60 line-clamp-2 mt-1">
              {trip.description}
            </p>

            <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
              <span className="inline-flex items-center bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-full">
                <User className="w-2.5 h-2.5 mr-0.5" />@{trip.username}
              </span>
              <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                <MapPin className="w-2.5 h-2.5 mr-0.5" />
                {trip.footprint_count} stops
              </span>
              {trip.photo_count && (
                <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                  {trip.photo_count} photos
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
