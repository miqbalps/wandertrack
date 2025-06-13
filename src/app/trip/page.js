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
    cover_photo:
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?q=80&w=1469&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?q=80&w=1470&auto=format&fit=crop",
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
    cover_photo:
      "https://images.unsplash.com/photo-1516908205727-40afad9449a8?q=80&w=1470&auto=format&fit=crop",
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
    cover_photo:
      "https://images.unsplash.com/photo-1517783999520-f068d7431a60?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 5,
    user_id: 4,
    username: "ocean_explorer",
    title: "Pacific Islands",
    description: "Island hopping across the South Pacific",
    start_date: "2023-07-01",
    end_date: "2023-07-21",
    footprint_count: 9,
    photo_count: 78,
    cover_photo:
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=1433&auto=format&fit=crop",
  },
  {
    id: 6,
    user_id: 5,
    username: "mountain_climber",
    title: "Andes Adventure",
    description: "Climbing the highest peaks in South America",
    start_date: "2023-09-10",
    end_date: "2023-10-05",
    footprint_count: 14,
    photo_count: 112,
    cover_photo:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 7,
    user_id: 6,
    username: "urban_explorer",
    title: "European Capitals",
    description: "Photographing architecture in major European cities",
    start_date: "2023-04-15",
    end_date: "2023-05-30",
    footprint_count: 11,
    photo_count: 203,
    cover_photo:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1520&auto=format&fit=crop",
  },
  {
    id: 8,
    user_id: 1,
    username: "explorer_jane",
    title: "Siberian Wilderness",
    description: "Exploring the remote regions of Siberia",
    start_date: "2023-06-01",
    end_date: "2023-06-20",
    footprint_count: 7,
    photo_count: 56,
    cover_photo:
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?q=80&w=1374&auto=format&fit=crop",
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

  // Limit to 3 trips per section for demo
  const displayedMyTrips = filteredMyTrips.slice(0, 3);
  const displayedOtherTrips = filteredOtherTrips.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold">Explore Expeditions</h1>
            <p className="text-xs opacity-60">Track your adventures</p>
          </div>
          <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
            {filteredMyTrips.length + filteredOtherTrips.length} trips
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
              My Expeditions
            </h2>
            {filteredMyTrips.length > 2 && (
              <Link
                href="/trips/my"
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
                  className="flex gap-3"
                  style={{ width: `${displayedMyTrips.length * 180}px` }}
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
                href="/trips/new"
                className="text-xs px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> New Trip
              </Link>
            </div>
          )}
        </section>

        {/* Community Trips Section */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold opacity-70 uppercase tracking-wider">
              Community Expeditions
            </h2>
            {filteredOtherTrips.length > 3 && (
              <Link
                href="/trips/community"
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
      href={isOwner ? `/trip/my/${trip.id}` : `/trip/community/${trip.id}`}
      className="group block w-[170px] flex-shrink-0"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-colors shadow-sm hover:shadow-md">
        {/* Cover Image */}
        <div className="relative h-32">
          <Image
            src={trip.cover_photo}
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

function HorizontalTripCard({ trip, isOwner }) {
  return (
    <Link
      href={isOwner ? `/trip/my/${trip.id}` : `/trip/community/${trip.id}`}
      className="group block"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-colors shadow-sm hover:shadow-md">
        <div className="flex">
          {/* Cover Image */}
          <div className="relative w-1/4 h-auto flex-shrink-0">
            <Image
              src={trip.cover_photo}
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
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-sm line-clamp-1 group-hover:text-yellow-500 dark:group-hover:text-yellow-400">
                {trip.title}
              </h2>
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
              <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                {trip.photo_count} photos
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
