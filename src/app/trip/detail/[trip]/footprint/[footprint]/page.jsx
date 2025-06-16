"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Navigation,
  Copy,
} from "lucide-react";

export default function FootprintDetailPage() {
  const FootprintMap = dynamic(() => import("@/components/FootprintMap"), {
    ssr: false,
    loading: () => (
      <div className="h-[200px] bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
    ),
  });
  const router = useRouter();
  const params = useParams();
  const [footprint, setFootprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);

      // Get footprint data
      const { data: footprintData, error } = await supabase
        .from("footprints")
        .select(
          `
          *,
          trips (
            id,
            title,
            user_id
          )
        `
        )
        .eq("id", params.footprint)
        .single();

      if (error) {
        console.error("Error fetching footprint:", error);
        return;
      }

      setFootprint(footprintData);
      setLoading(false);
    }

    fetchData();
  }, [params.footprint]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("footprints")
      .delete()
      .eq("id", footprint.id);

    if (error) {
      console.error("Error deleting footprint:", error);
      alert("Failed to delete footprint");
    } else {
      router.push(`/trip/detail/${params.trip}`);
    }
    setIsDeleting(false);
  };

  const isOwner = currentUser?.id === footprint?.trips?.user_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin text-yellow-500">↻</div>
      </div>
    );
  }

  if (!footprint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-500">Footprint not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push(`/trip/detail/${params.trip}`)}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                href={`/trip/detail/${params.trip}/footprint/edit/${params.footprint}`}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {/* <main className="max-w-2xl mx-auto p-4"> */}
      <div className="bg-white dark:bg-gray-950 overflow-hidden mb-6">
        {footprint.cover_photo_url ? (
          <div className="relative h-64">
            <Image
              src={footprint.cover_photo_url}
              alt={footprint.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <Navigation className="w-16 h-16 text-white" />
          </div>
        )}

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{footprint.title}</h1>

          <div className="grid gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-yellow-500" />
              <span>{new Date(footprint.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-yellow-500" />
              <span>{footprint.location}</span>
            </div>
            {footprint.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line text-justify">
                {footprint.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Latitude
              </p>
              <p className="font-medium">{footprint.latitude}°N</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Longitude
              </p>
              <p className="font-medium">{footprint.longitude}°E</p>
            </div>
          </div>

          <div className="space-y-4">
            <FootprintMap footprint={footprint} className="h-[200px] w-full" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <span>
                  {footprint.latitude}°N, {footprint.longitude}°E
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${footprint.latitude},${footprint.longitude}`
                  );
                  alert("Coordinates copied!");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* </main> */}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Footprint</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete this footprint? This action cannot
              be undone.
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
                    Delete Footprint
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
