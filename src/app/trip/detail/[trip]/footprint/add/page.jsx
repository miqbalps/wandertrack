"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ChevronDown,
  Plus,
  Upload,
  Navigation,
  Globe,
  Crosshair,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import MapWrapper from "@/components/MapWrapper";

export default function AddFootprintPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params?.trip; // Get trip ID from URL parameters
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    location_name: "",
    address: "",
    date: "",
    cover_photo_url: null,
    latitude: null,
    longitude: null,
    is_public: true,
    trip_id: params?.trip, // Use params.trip instead of tripId
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);

      // Load current trip details if tripId exists
      if (tripId) {
        await loadTripDetails(tripId);
      }

      setLoading(false);
    }

    checkUser();
  }, [tripId]);

  const loadTripDetails = async (tripId) => {
    try {
      const { data: trip, error } = await supabase
        .from("trips")
        .select("id, title")
        .eq("id", tripId)
        .single();

      if (error) throw error;
      setCurrentTrip(trip);
    } catch (error) {
      console.error("Failed to load trip details:", error);
      // If trip not found, redirect to trips page
      router.push("/trips");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cover_photo_url: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude,
          longitude: longitude,
        }));

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.display_name) {
            setFormData((prev) => ({
              ...prev,
              address: data.display_name,
              location_name: data.name || data.display_name.split(",")[0],
            }));
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
        }

        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Unable to get your location. Please enter coordinates manually."
        );
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleMapClick = (coordinates) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    }));
    setShowMap(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!params.trip) {
        throw new Error("Trip ID is required");
      }
      // Upload gambar ke Supabase Storage
      let coverPhotoUrl = null;
      if (formData.cover_photo_url) {
        const fileExt = formData.cover_photo_url.name.split(".").pop();
        const fileName = `footprint_${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("trip-photos")
          .upload(fileName, formData.cover_photo_url);

        if (uploadError) {
          console.error("Upload image error:", uploadError);
          throw uploadError;
        }

        // Dapatkan URL publik dari gambar
        const {
          data: { publicUrl },
        } = supabase.storage.from("trip-photos").getPublicUrl(fileName);
        coverPhotoUrl = publicUrl;
      }

      // Dapatkan user yang sedang login
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Prepare footprint data
      const footprintData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        location_name: formData.location_name,
        address: formData.address,
        date: formData.date,
        cover_photo_url: coverPhotoUrl,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        is_public: formData.is_public,
        trip_id: params.trip, // Use params.trip directly
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      // Insert data footprint ke database
      const { data: footprint, error: footprintError } = await supabase
        .from("footprints")
        .insert([footprintData])
        .select()
        .single();

      if (footprintError) {
        console.error("Footprint insert error:", footprintError);
        throw footprintError;
      }

      // Redirect back to trip detail page
      if (tripId) {
        router.push(`/trip/detail/${tripId}`);
      } else {
        router.push("/footprint");
      }
    } catch (error) {
      console.error("Error creating footprint:", error);
      alert(`Failed to create footprint: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin text-yellow-500">↻</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl pb-32">
        <div className="mb-8">
          <Link
            href={tripId ? `/trip/detail/${tripId}` : "/footprint"}
            className="inline-flex items-center text-sm text-yellow-600 dark:text-yellow-400 hover:underline mb-4"
          >
            <ChevronDown className="w-4 h-4 rotate-90 mr-1" />
            Back to {currentTrip ? currentTrip.title : "footprints"}
          </Link>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-yellow-500" />
            Add New Footprint
            {currentTrip && (
              <span className="text-base font-normal text-gray-500">
                to {currentTrip.title}
              </span>
            )}
          </h1>
          <p className="text-sm opacity-60">
            Mark your location and capture the moment of your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">
              Cover Photo
            </label>
            <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden group border-2 border-dashed border-gray-200 dark:border-gray-700">
              {previewImage ? (
                <>
                  <Image
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                    sizes={20}
                    priority={false}
                    quality={50}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      className="px-4 py-2 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg flex items-center gap-2 text-sm"
                      onClick={() =>
                        document.getElementById("cover-upload").click()
                      }
                    >
                      <Upload className="w-4 h-4" /> Change Photo
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                  <Upload className="w-8 h-8 mb-3" />
                  <p className="text-sm mb-4">
                    Drag and drop or click to upload
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg flex items-center gap-2 text-sm"
                    onClick={() =>
                      document.getElementById("cover-upload").click()
                    }
                  >
                    <Plus className="w-4 h-4" /> Select Photo
                  </button>
                </div>
              )}
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Footprint Details */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2 opacity-70"
              >
                Footprint Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                  placeholder="e.g. Summit of Mount Everest"
                  required
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2 opacity-70"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                placeholder="Describe this moment..."
              />
            </div>

            {/* Current Trip Display (if from URL) */}
            {currentTrip && (
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  Trip
                </label>
                <div className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                  {currentTrip.title}
                </div>
              </div>
            )}

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium mb-2 opacity-70"
              >
                Date
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location_name"
                    className="block text-sm font-medium mb-2 opacity-70"
                  >
                    Location Name
                  </label>
                  <input
                    type="text"
                    id="location_name"
                    name="location_name"
                    value={formData.location_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                    placeholder="e.g. Mount Everest"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium mb-2 opacity-70"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                    placeholder="e.g. Nepal, Himalayas"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-2 opacity-70"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                  placeholder="Full address"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">
                Coordinates
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm disabled:opacity-50"
                  >
                    {isGettingLocation ? (
                      <span className="animate-spin">↻</span>
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                    Get Current Location
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    {showMap ? "Hide Map" : "Select on Map"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude || ""}
                      onChange={handleChange}
                      step="any"
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                      placeholder="e.g. 27.9881"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude || ""}
                      onChange={handleChange}
                      step="any"
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                      placeholder="e.g. 86.9250"
                    />
                  </div>
                </div>

                {/* Map View */}
                {showMap && (
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <MapWrapper
                      locations={
                        formData.latitude && formData.longitude
                          ? [
                              {
                                lat: parseFloat(formData.latitude),
                                lng: parseFloat(formData.longitude),
                              },
                            ]
                          : []
                      }
                      onMarkerClick={handleMapClick}
                      className="h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label
                htmlFor="is_public"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Make this footprint public
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-yellow-500/70 text-black cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              {isSubmitting ? (
                <span className="animate-spin">↻</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add Footprint
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
