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
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Mock data based on your schema
const allTrips = [
  {
    id: 1,
    user_id: 1,
    username: "explorer_jane",
    title: "Himalayan Expedition",
    description:
      "A 30-day trek through the Nepalese Himalayas, documenting remote villages and mountain landscapes.",
    start_date: "2023-10-15",
    end_date: "2023-11-14",
    footprint_count: 18,
    photo_count: 127,
    cover_photo: "/himalayas-cover.jpg",
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
    cover_photo: "/sahara-cover.jpg",
  },
  {
    id: 3,
    user_id: 1,
    username: "explorer_jane",
    title: "Amazon Rainforest",
    description:
      "Exploring biodiversity in the Amazon basin with local guides.",
    start_date: "2023-08-10",
    end_date: "2023-08-25",
    footprint_count: 8,
    photo_count: 64,
    cover_photo: "/amazon-cover.jpg",
  },
  {
    id: 4,
    user_id: 3,
    username: "arctic_trekker",
    title: "Arctic Circle",
    description: "Documenting climate change effects in the Arctic region.",
    start_date: "2023-12-01",
    end_date: "2023-12-15",
    footprint_count: 6,
    photo_count: 42,
    cover_photo: "/arctic-cover.jpg",
  },
];

// Current user ID (would come from auth in real app)
const currentUserId = 1;

export default function TripListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Separate trips into mine and others
  const myTrips = allTrips.filter((trip) => trip.user_id === currentUserId);
  const otherTrips = allTrips.filter((trip) => trip.user_id !== currentUserId);

  // Filter trips based on search and filter
  const filteredMyTrips = myTrips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOtherTrips = otherTrips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center gap-4">
          <Link
            href="/trip/add"
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Trip
          </Link>
        </div>
      </nav>

      {/* Page Header */}
      <header className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold font-serif mb-2">Your Expeditions</h1>
        <p className="text-gray-600">Explore and manage your travel journals</p>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search trips..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Trips</option>
              <option value="recent">Recent</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </header>

      {/* Trip List */}
      <main className="container mx-auto px-6 pb-16">
        {/* My Trips Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-serif">My Expeditions</h2>
            <span className="text-sm text-gray-500">
              {filteredMyTrips.length} trips
            </span>
          </div>

          {filteredMyTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMyTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} isOwner={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-yellow-50 rounded-lg">
              <Compass className="mx-auto w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No trips found
              </h3>
              <p className="text-gray-500 mb-6">Create your first adventure</p>
              <Link
                href="/trips/new"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Create Trip
              </Link>
            </div>
          )}
        </section>

        {/* Other Trips Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-serif">
              Community Expeditions
            </h2>
            <span className="text-sm text-gray-500">
              {filteredOtherTrips.length} trips
            </span>
          </div>

          {filteredOtherTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOtherTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} isOwner={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Compass className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No community trips found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </section>
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

function TripCard({ trip, isOwner }) {
  return (
    <Link
      href={isOwner ? `/trip/my/${trip.id}` : `/trip/community/${trip.id}`}
      className="group"
    >
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative aspect-[4/3]">
          <Image
            src={trip.cover_photo}
            alt={trip.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Yellow frame decoration */}
          <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {isOwner && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
              YOUR TRIP
            </div>
          )}
        </div>

        {/* Trip Info */}
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold font-serif group-hover:text-yellow-600 transition-colors">
              {trip.title}
            </h2>
            <span className="text-sm text-gray-500">
              {new Date(trip.start_date).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>

          <div className="flex flex-wrap gap-4 text-sm mt-auto">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-yellow-600" />
              <span>@{trip.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-yellow-600" />
              <span>{trip.footprint_count} locations</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-yellow-600" />
              <span>
                {new Date(trip.start_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(trip.end_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
