"use client";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Camera,
  Share2,
  Heart,
  Edit,
  Trash2,
  Navigation,
  Clock,
  Star,
  Tag,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

export default function TripDetailPage() {
  const RouteMap = dynamic(() => import("@/components/RouteMap"), {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl aspect-[4/3]" />
    ),
  });
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [footprints, setFootprints] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [activeTab, setActiveTab] = useState("footprints");
  const tripId = params.trip;
  const isOwner = trip?.user_id === currentUser?.id;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!isOwner) return;
    setIsDeleting(true);

    const supabase = createClient();
    try {
      // Delete all footprints
      const { error: footprintError } = await supabase
        .from("footprints")
        .delete()
        .eq("trip_id", tripId);

      if (footprintError) throw footprintError;

      // Delete trip tags
      const { error: tagError } = await supabase
        .from("trip_tags")
        .delete()
        .eq("trip_id", tripId);

      if (tagError) throw tagError;

      // Delete the trip
      const { error: tripError } = await supabase
        .from("trips")
        .delete()
        .eq("id", tripId);

      if (tripError) throw tripError;

      router.push("/trip");
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Failed to delete trip. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleFootprintDelete = (deletedFootprintId) => {
    // Update footprints state by filtering out the deleted one
    setFootprints((currentFootprints) =>
      currentFootprints.filter((f) => f.id !== deletedFootprintId)
    );
  };

  useEffect(() => {
    const fetchTripDetail = async () => {
      const supabase = createClient();

      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Fetch trip details with tags
        const { data: tripData, error: tripError } = await supabase
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
            )
          `
          )
          .eq("id", tripId)
          .single();

        if (tripError) throw tripError;

        // Process trip data
        const processedTrip = {
          ...tripData,
          username: `user_${tripData.user_id?.slice(-8) || "anonymous"}`,
          tags: tripData.trip_tags?.map((tt) => tt.tags) || [],
        };

        setTrip(processedTrip);

        // Fetch footprints for this trip
        const { data: footprintsData, error: footprintsError } = await supabase
          .from("footprints")
          .select("*")
          .eq("trip_id", tripId)
          .order("created_at", { ascending: true });

        if (footprintsError) throw footprintsError;

        setFootprints(footprintsData || []);

        // Fetch likes data (if you have a likes table)
        // const { data: likesData } = await supabase
        //   .from("trip_likes")
        //   .select("*")
        //   .eq("trip_id", tripId);

        // setLikesCount(likesData?.length || 0);
        // setIsLiked(likesData?.some(like => like.user_id === user?.id) || false);
      } catch (error) {
        console.error("Error fetching trip details:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTripDetail();
    }
  }, [tripId]);

  const handleLike = async () => {
    if (!currentUser) return;

    // Toggle like state optimistically
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    // Here you would implement the actual like/unlike logic with Supabase
    // const supabase = createClient();
    // if (isLiked) {
    //   await supabase.from("trip_likes").delete().match({ trip_id: tripId, user_id: currentUser.id });
    // } else {
    //   await supabase.from("trip_likes").insert({ trip_id: tripId, user_id: currentUser.id });
    // }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip.title,
          text: trip.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-yellow-500">↻</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Trip not found</h2>
          <Link
            href="/trip"
            className="text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            Back to trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 mb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-950">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <Link
                  href={`/trip/edit/${trip.id}`}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>{" "}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-64 md:h-80">
          {trip.cover_photo_url ? (
            <Image
              src={trip.cover_photo_url}
              alt={trip.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Navigation className="w-16 h-16 text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Floating action button */}
          <button
            onClick={handleLike}
            className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-colors ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </section>

      {/* Trip Info */}
      <section className="px-4 py-6 bg-white dark:bg-gray-950">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line text-justify">
            {trip.description}
          </p>
        </div>

        {/* Trip Meta */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4 mr-2 text-yellow-500" />
            <span>@{trip.username}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
            <span>{footprints.length} stops</span>
          </div>
          {trip.start_date && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
              <span>
                {new Date(trip.start_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {trip.end_date && (
                  <>
                    {" - "}
                    {new Date(trip.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </>
                )}
              </span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Heart className="w-4 h-4 mr-2 text-yellow-500" />
            <span>{likesCount} likes</span>
          </div>
        </div>

        {/* Tags */}
        {trip.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {trip.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {footprints.length}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 opacity-70">
              Footprints
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {trip.photo_count || 0}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 opacity-70">
              Photos
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {trip.duration || "N/A"}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 opacity-70">
              Duration
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("footprints")}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "footprints"
                  ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Footprints ({footprints.length})
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "photos"
                  ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Photos ({trip.photo_count || 0})
            </button>
            <button
              onClick={() => setActiveTab("route")}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "route"
                  ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Route
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <main className="px-4 py-6 pb-20">
        {activeTab === "footprints" && (
          <div className="space-y-4">
            {/* Add Footprint Button - Always shown for owner */}
            {isOwner && (
              <div className="mb-4">
                <Link
                  href={`/trip/detail/${trip.id}/footprint/add`}
                  className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-medium transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Add Footprint
                </Link>
              </div>
            )}

            {footprints.length > 0 ? (
              footprints.map((footprint, index) => (
                <FootprintCard
                  key={footprint.id}
                  footprint={footprint}
                  index={index}
                  isOwner={isOwner}
                  tripId={params.trip}
                  onDelete={handleFootprintDelete}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <MapPin className="mx-auto w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium mb-2">No footprints yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start adding locations to your journey
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "photos" && (
          <div>
            {trip.photo_count && trip.photo_count > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Photo grid would go here */}
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Camera className="mx-auto w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium mb-2">No photos yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Photos will appear here when added to footprints
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "route" && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {footprints.length > 0 ? (
              <>
                <RouteMap
                  footprints={footprints}
                  className="aspect-[4/3] mb-4"
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {footprints.map((footprint, index) => (
                    <div
                      key={footprint.id}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm"
                    >
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-bold">
                        {index + 1}
                      </div>
                      <span>{footprint.title}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Navigation className="mx-auto w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium mb-2">No footprints yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add footprints to see your journey route
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Trip</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete this trip? This action cannot be
              undone and will delete all footprints associated with this trip.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin">↻</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Trip
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FootprintCard({ footprint, index, isOwner, tripId, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleClick = () => {
    router.push(`/trip/detail/${tripId}/footprint/${footprint.id}`);
  };

  const handleDelete = async (footprintId) => {
    if (!isOwner || !footprintId) return;

    if (!confirm("Are you sure you want to delete this footprint?")) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete the footprint
      const { error } = await supabase
        .from("footprints")
        .delete()
        .eq("id", footprintId);

      if (error) throw error;

      // Call parent callback to update UI
      onDelete(footprintId);
    } catch (error) {
      console.error("Error deleting footprint:", error);
      alert("Failed to delete footprint. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative h-40">
        {footprint.cover_photo_url ? (
          <>
            <Image
              src={footprint.cover_photo_url}
              alt={footprint.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-white" />
          </div>
        )}

        {/* Action buttons */}
        {isOwner && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Link
              href={`/trip/detail/${tripId}/footprint/edit/${footprint.id}`}
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking edit
              className="p-1.5 bg-white/90 dark:bg-gray-900 hover:bg-yellow-500 hover:text-black rounded-lg transition-colors backdrop-blur-sm"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click when clicking delete
                handleDelete(footprint.id);
              }}
              disabled={isDeleting}
              className="p-1.5 bg-white/90 dark:bg-gray-900 hover:bg-red-500 hover:text-white rounded-lg transition-colors backdrop-blur-sm disabled:opacity-50"
            >
              {isDeleting ? (
                <span className="animate-spin">↻</span>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* Footprint details overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <h3 className="font-bold text-base">{footprint.title}</h3>
            </div>
            <span className="text-xs bg-black/50 px-2 py-0.5 rounded-full">
              {new Date(footprint.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {footprint.description && (
            <p className="text-xs line-clamp-2 mb-2 mt-1">
              {footprint.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-yellow-500" />
              <span className="text-white/90">
                {footprint.location || "Location not specified"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
