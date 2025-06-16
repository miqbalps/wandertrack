// src/app/trip/my/page.js
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
  ArrowLeft, // Tambahkan ikon ArrowLeft untuk kembali
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase, getSession } from "@/lib/supabase/client"; // Sesuaikan path jika berbeda

// Re-gunakan komponen card yang sudah Anda definisikan
// Pastikan path ke komponen VerticalTripCard sudah benar
// Misalnya, jika VerticalTripCard berada di src/components/TripCards.js
// Maka Anda perlu memindahkannya atau mengimpornya dari sana.
// Untuk tujuan contoh ini, saya asumsikan TripCards.js ada di src/components
// Jika Anda ingin tetap di file ini, salin saja definisi fungsi VerticalTripCard dan HorizontalTripCard di bawah TripListPage
// Untuk menjaga agar kode tidak terlalu panjang, saya akan anggap VerticalTripCard diimpor atau didefinisikan di sini.

// --- Definisi VerticalTripCard (Jika Anda tidak memindahkannya ke file terpisah) ---
function VerticalTripCard({ trip, isOwner }) {
    return (
      <Link
        href={`/trips/${trip.id}`} // Link ke halaman detail trip
        className="group block w-[170px] flex-shrink-0"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-colors shadow-sm hover:shadow-md">
          {/* Cover Image */}
          <div className="relative h-32">
            <Image
              src={trip.cover_photo || trip.cover_photo_url} // Menggunakan cover_photo_url dari Supabase
              alt={trip.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
            {isOwner && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                Yours
              </div>
            )}
          </div>

          {/* Trip Info */}
          <div className="p-3">
            <h2 className="font-semibold text-sm line-clamp-1 group-hover:text-yellow-500 dark:group-hover:text-yellow-400">
              {trip.title}
            </h2>
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
            </div>
          </div>
        </div>
      </Link>
    );
}
// --- Akhir Definisi VerticalTripCard ---


export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) {
          // Handle case where user is not logged in
          // Redirect to login or show a message
          setError("You must be logged in to view your expeditions.");
          setLoading(false);
          return;
        }
        setCurrentUserId(session.user.id);

        // Fetch trips from Supabase where user_id matches current user's ID
        const { data, error } = await supabase
          .from("trips") // Pastikan nama tabel Anda di Supabase adalah 'trips'
          .select("*, users(username)") // Pilih semua kolom trip dan join untuk username dari tabel users
          .eq("user_id", session.user.id) // Filter berdasarkan user_id yang sedang login
          .order("created_at", { ascending: false }); // Urutkan berdasarkan tanggal pembuatan

        if (error) {
          throw error;
        }

        // Map data agar sesuai dengan format yang diharapkan oleh VerticalTripCard
        const formattedTrips = data.map(trip => ({
            id: trip.id,
            user_id: trip.user_id,
            username: trip.users?.username || 'Unknown', // Ambil username dari join table users
            title: trip.title,
            description: trip.description,
            start_date: trip.start_date,
            end_date: trip.end_date,
            footprint_count: trip.footprint_count || 0, // Beri default jika null
            photo_count: trip.photo_count || 0, // Beri default jika null
            cover_photo: trip.cover_photo_url, // Sesuaikan dengan nama kolom di Supabase
        }));

        setTrips(formattedTrips);
      } catch (err) {
        console.error("Error fetching trips:", err.message);
        setError("Failed to load your expeditions: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // [] agar hanya dijalankan sekali saat komponen di-mount

  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center mb-3">
          <Link href="/trip" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="ml-3">
            <h1 className="text-xl font-bold">My Expeditions</h1>
            <p className="text-xs opacity-60">All your created adventures</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your trips..."
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
        {loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading your expeditions...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            Error: {error}
          </div>
        )}

        {!loading && !error && filteredTrips.length === 0 && (
          <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Compass className="mx-auto w-6 h-6 text-gray-300 dark:text-gray-600 mb-2" />
            <h3 className="text-sm font-medium mb-1">No trips found</h3>
            <p className="text-xs opacity-60 mb-3">
              You haven't created any expeditions yet.
            </p>
            <Link
              href="/trips/new"
              className="text-xs px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> New Trip
            </Link>
          </div>
        )}

        {!loading && !error && filteredTrips.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredTrips.map((trip) => (
              <VerticalTripCard key={trip.id} trip={trip} isOwner={true} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}