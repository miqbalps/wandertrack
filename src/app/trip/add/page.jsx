"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAllTags, createTag } from "@/lib/supabase/tags";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Calendar,
  X,
  Plus,
  Upload,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddTripPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    cover_photo_url: null,
    is_public: true,
    tags: [],
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTag, setNewTag] = useState({ name: "", slug: "" });

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

  const handleCreateTag = async (e) => {
    e.preventDefault();

    try {
      const tag = await createTag(newTag.name);
      setAvailableTags((prev) => [...prev, tag]);
      setNewTag({ name: "", slug: "" });
      setShowAddTag(false);
    } catch (error) {
      console.error("Failed to create tag:", error);
      alert("Failed to create tag. Please try again.");
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

  useEffect(() => {
    async function loadTags() {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    }

    loadTags();
  }, []);

  const handleTagsChange = (selectedTags) => {
    setFormData((prev) => ({
      ...prev,
      tags: selectedTags,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload gambar ke Supabase Storage
      let coverPhotoUrl = null;
      if (formData.cover_photo_url) {
        const fileExt = formData.cover_photo_url.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
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

      if (userError) {
        console.error("Error saat ambil user:", userError);
        throw userError;
      }

      if (!user || !user.id) {
        console.error("User tidak ditemukan atau belum login:", user);
        throw new Error("User not authenticated");
      }

      // Prepare trip data with created_at
      const tripData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        cover_photo_url: coverPhotoUrl,
        is_public: formData.is_public,
        user_id: user.id,
        created_at: new Date().toISOString(), // Add created_at timestamp
      };

      // Insert data trip ke database
      const { data: trip, error: tripError } = await supabase
        .from("trips")
        .insert([tripData])
        .select()
        .single();

      if (tripError) {
        console.error("Trip insert error detail:", tripError);
        throw tripError;
      }

      // Insert trip tags
      if (formData.tags.length > 0) {
        const tripTagsData = formData.tags.map((tagId) => ({
          trip_id: trip.id,
          tag_id: tagId,
        }));

        const { error: tagError } = await supabase
          .from("trip_tags")
          .insert(tripTagsData);

        if (tagError) {
          console.error("Trip tags insert error:", tagError);
          throw tagError;
        }
      }

      // Redirect to trips page
      router.push("/trip");
    } catch (error) {
      console.error("Error creating trip:", error);

      // More specific error handling
      if (error.message.includes("duplicate key")) {
        alert("A trip with this information already exists.");
      } else if (error.message.includes("foreign key")) {
        alert("Invalid user or tag reference. Please try again.");
      } else {
        alert(`Failed to create trip: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 mb-16">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl pb-16">
        <div className="mb-8">
          <Link
            href="/trip"
            className="inline-flex items-center text-sm text-yellow-600 dark:text-yellow-400 hover:underline mb-4"
          >
            <ChevronDown className="w-4 h-4 rotate-90 mr-1" /> Back to trips
          </Link>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Compass className="w-6 h-6 text-yellow-500" />
            Create New Trip
          </h1>
          <p className="text-sm opacity-60">
            Document your adventure with details that bring your journey to life
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

          {/* Trip Details */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2 opacity-70"
              >
                Trip Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                  placeholder="e.g. Himalayan Adventure 2023"
                  required
                />
                <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                placeholder="Tell us about your Trip..."
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium mb-2 opacity-70"
                >
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium mb-2 opacity-70"
                >
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white/50 dark:bg-gray-800/50"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
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
                Make this Trip public
              </label>
            </div>
          </div>

          {/* Tags Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2 opacity-70">
              Categories/Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    const isSelected = formData.tags.includes(tag.id);
                    handleTagsChange(
                      isSelected
                        ? formData.tags.filter((id) => id !== tag.id)
                        : [...formData.tags, tag.id]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.tags.includes(tag.id)
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
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
                  <Plus className="w-4 h-4" /> Create Trip
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tags Selection with Add New Tag */}
        <div className="space-y-2 mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium opacity-70">
              Categories/Tags
            </label>
            <button
              type="button"
              onClick={() => setShowAddTag(true)}
              className="text-sm text-yellow-500 hover:text-yellow-600 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add New Tag
            </button>
          </div>

          {/* New Tag Form */}
          {showAddTag && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <form onSubmit={handleCreateTag} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">New Tag</label>
                    <button
                      type="button"
                      onClick={() => setShowAddTag(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) =>
                      setNewTag({ ...newTag, name: e.target.value })
                    }
                    placeholder="Enter tag name"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white dark:bg-gray-900"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Create Tag
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
