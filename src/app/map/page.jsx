"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import GlobalMap from "@/components/GlobalMap";

// import ShareOptionsModal from "@/components/share/ShareOptionsModal";

export default function MapPage() {
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
      {/* Interactive Map Section */}
      <section id="map-section">
        {currentUser ? (
          <GlobalMap
            trips={userTripsForMap}
            onFootprintSelect={setSelectedFootprint}
            className="mb-4"
          />
        ) : (
          <div className="h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Link
              href="/login"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold flex items-center gap-1.5 text-sm"
            >
              <User className="w-4 h-4" /> Sign in to view your map
            </Link>
          </div>
        )}
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
