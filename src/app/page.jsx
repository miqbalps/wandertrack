"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MapHome from "@/components/MapHome";
import Link from "next/link";
import Image from "next/image";

import {
  Camera,
  MapPin,
  Calendar,
  Globe,
  X,
  ChevronRight,
  Copy,
  ArrowRight,
  User,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// import ShareOptionsModal from "@/components/share/ShareOptionsModal";

// Sample trip data with coordinates for mapping
const trips = [
  {
    id: 1,
    user_id: 1,
    username: "explorer_jane",
    title: "Himalayan Trip",
    description:
      "A 30-day trek through the Nepalese Himalayas, documenting remote villages and mountain landscapes.",
    start_date: "2023-10-15",
    end_date: "2023-11-14",
    footprint_count: 18,
    photo_count: 127,
    cover_photo:
      "https://images.unsplash.com/photo-1513415277900-a62401e19be4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    locations: [
      {
        lat: 27.7172,
        lng: 85.324,
        name: "Kathmandu",
        date: "2023-10-16",
        photo:
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        lat: 27.9881,
        lng: 86.925,
        name: "Mount Everest Base Camp",
        date: "2023-10-25",
        photo:
          "https://images.unsplash.com/photo-1581617460601-b1e0b0bdb144?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        lat: 28.3949,
        lng: 84.124,
        name: "Annapurna Circuit",
        date: "2023-11-05",
        photo:
          "https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    id: 2,
    user_id: 2,
    username: "desert_nomad",
    title: "Sahara Crossing",
    description:
      "Journey across the Sahara desert following ancient trade routes.",
    start_date: "2023-05-01",
    end_date: "2023-05-21",
    footprint_count: 12,
    photo_count: 89,
    cover_photo:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    locations: [
      {
        lat: 31.6295,
        lng: -7.9811,
        name: "Marrakech",
        date: "2023-05-02",
        photo:
          "https://images.unsplash.com/photo-1518976024611-28bf4b48222e?q=80&w=1985&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        lat: 30.4278,
        lng: -9.5981,
        name: "Taroudant",
        date: "2023-05-10",
        photo:
          "https://images.unsplash.com/photo-1570303345338-e1f0ed1b3b46?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        lat: 29.3759,
        lng: -10.1726,
        name: "Sahara Dunes",
        date: "2023-05-15",
        photo:
          "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  // ... other trips with locations data
];

export default function Page() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedFootprint, setSelectedFootprint] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const supabase = createClient();
  const [userTripsForMap, setUserTripsForMap] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // const handleShare = (trip) => {
  //   alert(`Shared trip: ${trip.title}`)
  // }

  const fetchUserTripsWithFootprints = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return [];

      const { data: tripsData, error } = await supabase
        .from("trips")
        .select(
          `
        *,
        footprints (
          id,
          trip_id,
          title,
          description,
          location,
          date,
          latitude,
          longitude,
          cover_photo_url
        )
      `
        )
        .eq("user_id", session.user.id);

      if (error) throw error;

      return (
        tripsData?.map((trip) => ({
          ...trip,
          locations:
            trip.footprints?.map((f) => ({
              id: f.id,
              trip_id: f.trip_id,
              lat: f.latitude,
              lng: f.longitude,
              name: f.title,
              description: f.description,
              date: f.date,
              location: f.location,
              photo: f.cover_photo_url,
            })) || [],
        })) || []
      );
    } catch (error) {
      console.error("Error fetching user trips:", error);
      return [];
    }
  };

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

          // Fetch user's trips for the map
          const userTrips = await fetchUserTripsWithFootprints();
          setUserTripsForMap(userTrips);
        }

        // Fetch trips with tags, profiles, and footprints for Recent Trips section
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
            id,
            title,
            location,
            date,
            latitude,
            longitude,
            cover_photo_url
          )
        `
          )
          .eq("is_public", true)
          .order("created_at", { ascending: false })
          .limit(2);

        if (tripsError) {
          console.error("Error fetching trips:", tripsError.message);
          throw tripsError;
        }

        // Process the data
        const processedTrips =
          tripsData?.map((trip) => ({
            ...trip,
            username:
              session?.user?.id === trip.user_id
                ? "You"
                : trip.profiles?.username || `user_${trip.user_id?.slice(-4)}`,
            footprint_count: trip.footprints?.length || 0,
            photo_count:
              trip.footprints?.filter((f) => f.cover_photo_url).length || 0,
            start_date: trip.start_date
              ? new Date(trip.start_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "No date",
            locations:
              trip.footprints?.map((f) => ({
                name: f.title,
                date: new Date(f.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
                location: f.location,
                lat: f.latitude,
                lng: f.longitude,
                photo: f.cover_photo_url,
              })) || [],
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
        // Refetch user trips when auth state changes
        fetchUserTripsWithFootprints().then(setUserTripsForMap);
      } else {
        setCurrentUser(null);
        setUserTripsForMap([]);
      }
    });

    fetchData();

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      {/* Hero Section with animated elements */}
      <div className="relative w-full h-[300px] overflow-hidden group">
        <Image
          src="https://plus.unsplash.com/premium_photo-1694475616112-bf74aa5f12ea?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Image"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center px-6">
          <div className="animate-fade-in-up max-w-md">
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
              <span className="inline-block bg-yellow-500 text-black px-2 transform -rotate-2">
                Explore
              </span>{" "}
              Your World
            </h1>
            <p className="text-white/90 mb-4">
              Capture every moment with our adventure tools.
            </p>
            <div className="flex gap-3">
              <Link
                href="#map-section"
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold flex items-center gap-1.5 text-sm transform hover:scale-105 transition-transform"
              >
                <MapPin className="w-4 h-4" /> Start Exploring
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips Section */}
      <section className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            <span className="border-b-4 border-yellow-400 pb-1">Recent</span>{" "}
            Trips
          </h2>
          <Link
            href="/trip"
            className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-bold"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-yellow-500">↻</div>
          </div>
        ) : trips.length > 0 ? (
          <div className="grid gap-4">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trip/detail/${trip.id}`}
                className="block group"
              >
                <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-40">
                    <Image
                      src={trip.cover_photo_url || "/default-trip-cover.jpg"}
                      alt={trip.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base">{trip.title}</h3>
                      <span className="text-xs bg-black/50 px-2 py-0.5 rounded-full">
                        {trip.start_date}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2 mb-2">
                      {trip.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 bg-yellow-500/90 text-black px-2 py-0.5 rounded-full">
                          <MapPin className="w-3 h-3" /> {trip.footprint_count}
                        </span>
                        <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                          <Camera className="w-3 h-3" /> {trip.photo_count}
                        </span>
                      </div>
                      <span className="bg-black/50 px-2 py-0.5 rounded-full">
                        @{trip.username}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No trips found</p>
          </div>
        )}
      </section>

      {/* Interactive Map Section */}
      <section id="map-section" className="px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            Your <span className="text-yellow-500">Global</span> Footprint
          </h2>
          <p className="text-sm mt-1 flex items-center gap-2">
            {currentUser ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <span>
                  {userTripsForMap.reduce(
                    (acc, trip) => acc + (trip.locations?.length || 0),
                    0
                  )}{" "}
                  lokasi dalam {userTripsForMap.length} perjalanan
                </span>
              </>
            ) : (
              "Sign in to see your journey map"
            )}
          </p>
        </div>

        {currentUser ? (
          <MapHome
            trips={userTripsForMap}
            onFootprintSelect={setSelectedFootprint}
            className="aspect-[4/3] mb-4"
          />
        ) : (
          <div className="aspect-[4/3] mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <Link
              href="/login"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold flex items-center gap-1.5 text-sm"
            >
              <User className="w-4 h-4" /> Sign in to view your map
            </Link>
          </div>
        )}

        <Link
          href="/trip"
          className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold flex items-center justify-center gap-2 text-sm transform hover:scale-105 transition-transform mb-6"
        >
          <Globe className="w-5 h-5" /> Explore World Maps
        </Link>
      </section>

      {/* Footprint Detail Modal */}
      {selectedFootprint && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold">Location Details</h3>
              <button
                onClick={() => setSelectedFootprint(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Cover Photo */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                {selectedFootprint.photo ? (
                  <Image
                    src={selectedFootprint.photo}
                    alt={selectedFootprint.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              {/* Location Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    {selectedFootprint.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFootprint.location}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-yellow-500" />
                  <span>{selectedFootprint.date}</span>
                </div>

                {selectedFootprint.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-5 whitespace-pre-line text-justify">
                    {selectedFootprint.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Latitude
                    </p>
                    <p className="font-medium">{selectedFootprint.lat}°N</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Longitude
                    </p>
                    <p className="font-medium">{selectedFootprint.lng}°E</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${selectedFootprint.lat},${selectedFootprint.lng}`
                  );
                  alert("Coordinates copied!");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>

              <Link
                href={`/trip/detail/${selectedFootprint.trip_id}/footprint/${selectedFootprint.id}`}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-medium flex items-center gap-2"
              >
                View Full Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
