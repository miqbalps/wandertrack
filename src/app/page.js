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
      <div className="relative w-full aspect-[9/16] overflow-hidden group">
        <Image
          src="https://plus.unsplash.com/premium_photo-1694475616112-bf74aa5f12ea?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Image"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end pb-8">
          <div className="px-6 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              <span className="inline-block bg-yellow-500 text-black px-2 transform -rotate-2">
                Explore
              </span>{" "}
              Your World
            </h1>
            <p className="text-white/90 mb-6 text-lg">
              Capture every moment with our adventure tools.
            </p>
            <div className="flex gap-3">
              <button className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold flex items-center gap-1.5 text-sm transform hover:scale-105 transition-transform shadow-lg">
                <MapPin className="w-4 h-4" /> Start Exploring
              </button>
              <button className="px-5 py-3 border-2 border-white text-white hover:bg-white/10 rounded-full font-bold flex items-center gap-1.5 text-sm transform hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" /> Read Stories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Cards with hover effects */}
      <section className="px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            <span className="border-b-4 border-yellow-400 pb-1">Recent</span>{" "}
            Adventures
          </h2>
          <button className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-bold">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-5">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedTrip(trip)}
            >
              <div className="relative h-48">
                <Image
                  src={trip.cover_photo}
                  alt={trip.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{trip.title}</h3>
                  <span className="text-xs bg-black/50 px-2 py-1 rounded-full">
                    {trip.start_date}
                  </span>
                </div>
                <p className="text-sm line-clamp-2 mb-2">{trip.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1 bg-yellow-500/90 text-black px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" /> {trip.footprint_count}
                    </span>
                    <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                      <Camera className="w-3 h-3" /> {trip.photo_count}
                    </span>
                  </div>
                  <span className="bg-black/50 px-2 py-1 rounded-full">
                    @{trip.username}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Your <span className="text-yellow-500">Global</span> Footprint
          </h2>
          <p className="text-sm mt-2">
            Track every step of your journey with our interactive maps
          </p>
        </div>

        <MapWrapper
          trips={trips}
          onTripSelect={setSelectedTrip}
          className="aspect-[4/3] mb-5"
        />

        <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold flex items-center justify-center gap-2 text-sm transform hover:scale-105 transition-transform shadow-lg">
          <Globe className="w-5 h-5" /> Explore World Maps
        </button>
      </section>

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div
            className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              onClick={() => setSelectedTrip(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedTrip.title}</h2>
            <p className="text-sm mb-4">by @{selectedTrip.username}</p>

            <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={selectedTrip.cover_photo}
                alt={selectedTrip.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="mb-4">{selectedTrip.description}</p>

            <div className="mb-6">
              <h3 className="font-bold mb-2">Trip Locations</h3>
              <div className="space-y-2">
                {selectedTrip.locations?.map((loc, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="bg-yellow-500 text-black p-2 rounded-full">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{loc.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {loc.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <span className="flex items-center gap-1 bg-yellow-500/90 text-black px-3 py-1.5 rounded-full text-sm">
                  <MapPin className="w-3 h-3" /> {selectedTrip.footprint_count}{" "}
                  footprints
                </span>
                <span className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm">
                  <Camera className="w-3 h-3" /> {selectedTrip.photo_count}{" "}
                  photos
                </span>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vibrant CTA Section */}
      <section className="bg-yellow-500 px-4 py-10 mt-6 rounded-t-3xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3 text-black">
            Ready for Adventure?
          </h2>
          <p className="mb-5 text-black/90">
            Join thousands of explorers documenting their journeys
          </p>
          <button className="w-full max-w-xs mx-auto py-3 bg-black hover:bg-gray-900 text-white rounded-full font-bold flex items-center justify-center gap-2 text-sm transform hover:scale-105 transition-transform shadow-lg">
            <Compass className="w-5 h-5" /> Start Exploring Now
          </button>
        </div>
      </section>
    </>
  );
}
