"use client";
import { useState } from "react";
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    cover_photo: null,
    is_public: true,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setFormData((prev) => ({ ...prev, cover_photo: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, you would upload the image and submit the form data
    // to your API endpoint here
    console.log("Submitting trip:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to trip list after successful submission
    router.push("/trips");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* National Geographic-style yellow top border */}
      <div className="h-2 bg-yellow-400 w-full"></div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Compass className="w-8 h-8 text-yellow-600" />
          <span className="text-2xl font-bold font-serif">WanderTrack</span>
        </div>
        <Link
          href="/trip"
          className="px-4 py-2 border border-black hover:bg-gray-100 rounded-full font-medium flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Cancel
        </Link>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2">
            Create New Expedition
          </h1>
          <p className="text-gray-600">
            Document your adventure with details that bring your journey to life
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Cover Photo Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Photo
            </label>
            <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden group">
              {previewImage ? (
                <>
                  <Image
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      className="px-4 py-2 bg-white text-black rounded-full flex items-center gap-2"
                      onClick={() =>
                        document.getElementById("cover-upload").click()
                      }
                    >
                      <Upload className="w-4 h-4" /> Change Photo
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Upload className="w-12 h-12 mb-2" />
                  <p className="mb-2">Drag and drop or click to upload</p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full flex items-center gap-2"
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
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expedition Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="e.g. Himalayan Adventure 2023"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Tell us about your expedition..."
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 appearance-none"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 appearance-none"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_public"
                className="ml-2 block text-sm text-gray-700"
              >
                Make this expedition public (visible to other explorers)
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-yellow-400/70 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                {isSubmitting ? (
                  "Creating Expedition..."
                ) : (
                  <>
                    <Compass className="w-5 h-5" /> Create Expedition
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Compass className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold font-serif">WanderTrack</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} WanderTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
