"use client";

import Image from "next/image";
import {
  Camera,
  MapPin,
  Compass,
  Globe,
  BookOpen,
  Share2,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import MapWrapper from "@/components/MapWrapper";

// Sample trip data with coordinates for mapping
const trips = [
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
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold flex items-center gap-1.5 text-sm transform hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4" /> Start Exploring
              </button>
              <button className="px-4 py-2 border-2 border-white text-white hover:bg-white/10 rounded-full font-bold flex items-center gap-1.5 text-sm transform hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" /> Read Stories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Cards with hover effects */}
      <section className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            <span className="border-b-4 border-yellow-400 pb-1">Recent</span>{" "}
            Trips
          </h2>
          <button className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-bold">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTrip(trip)}
            >
              <div className="relative h-40">
                <Image
                  src={trip.cover_photo}
                  alt={trip.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base">{trip.title}</h3>
                  <span className="text-xs bg-black/50 px-2 py-0.5 rounded-full">
                    {trip.start_date}
                  </span>
                </div>
                <p className="text-xs line-clamp-2 mb-2">{trip.description}</p>
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
          ))}
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            Your <span className="text-yellow-500">Global</span> Footprint
          </h2>
          <p className="text-sm mt-1">
            Track every step of your journey with our interactive maps
          </p>
        </div>

        <MapWrapper
          trips={trips}
          onTripSelect={setSelectedTrip}
          className="aspect-[4/3] mb-4"
        />

        <button className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold flex items-center justify-center gap-2 text-sm transform hover:scale-105 transition-transform mb-6">
          <Globe className="w-5 h-5" /> Explore World Maps
        </button>
      </section>

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div
            className={`relative w-full max-w-md max-h-[80vh] overflow-y-auto rounded-xl p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              onClick={() => setSelectedTrip(null)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-1">{selectedTrip.title}</h2>
            <p className="text-sm mb-3">by @{selectedTrip.username}</p>

            <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden">
              <Image
                src={selectedTrip.cover_photo}
                alt={selectedTrip.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="mb-3 text-sm">{selectedTrip.description}</p>

            <div className="mb-4">
              <h3 className="font-bold mb-2 text-sm">Trip Locations</h3>
              <div className="space-y-2">
                {selectedTrip.locations?.map((loc, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="bg-yellow-500 text-black p-1.5 rounded-full">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{loc.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {loc.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="flex items-center gap-1 bg-yellow-500/90 text-black px-2 py-1 rounded-full text-xs">
                  <MapPin className="w-3 h-3" /> {selectedTrip.footprint_count}
                </span>
                <span className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                  <Camera className="w-3 h-3" /> {selectedTrip.photo_count}
                </span>
              </div>
              <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
