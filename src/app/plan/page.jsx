"use client";

import React, { useState, useEffect } from "react";
// Hapus import Header dan BottomNav jika mereka sudah di layout.js Anda
// import Header from '../../components/layouts/Header';
// import BottomNav from '../../components/layouts/BottomNav';
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  PlusCircle,
  CheckCircle,
  Trash2,
  XCircle,
  ChevronLeft,
} from "lucide-react";

export default function PlanPage() {
  const [plans, setPlans] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPlans = localStorage.getItem("travelPlans");
      return savedPlans ? JSON.parse(savedPlans) : [];
    }
    return [];
  });

  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const [newItem, setNewItem] = useState("");
  // Ubah inisialisasi notificationDate agar kompatibel dengan datetime-local jika ada
  const [notificationDate, setNotificationDate] = useState("");

  useEffect(() => {
    const currentPlan = plans.find((p) => p.id === selectedPlanId);
    if (currentPlan) {
      // Saat memuat, pastikan formatnya YYYY-MM-DDTHH:mm
      if (currentPlan.notificationDate) {
        const dateObj = new Date(currentPlan.notificationDate);
        const formattedDate = dateObj.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
        setNotificationDate(formattedDate);
      } else {
        setNotificationDate("");
      }
    } else {
      setNotificationDate("");
    }
  }, [selectedPlanId, plans]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("travelPlans", JSON.stringify(plans));
    }
  }, [plans]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date(); // Gunakan waktu saat ini untuk perbandingan notifikasi

      plans.forEach((plan) => {
        if (plan.notificationDate) {
          const reminder = new Date(plan.notificationDate);

          // Pengingat 2 hari sebelumnya, tapi tetap mempertimbangkan waktu
          const reminderThreshold = new Date(reminder.getTime());
          reminderThreshold.setDate(reminderThreshold.getDate() - 2);

          // Cek apakah sekarang sudah melewati atau sama dengan waktu pengingat (2 hari sebelumnya atau tepat pada waktu)
          // Dan pastikan belum terlalu jauh melewati waktu pengingat (misal, dalam rentang 24 jam setelah waktu pengingat)
          const isWithinReminderWindow =
            now >= reminderThreshold &&
            now <= new Date(reminder.getTime() + 24 * 60 * 60 * 1000); // Dalam 24 jam setelah waktu notifikasi

          if (isWithinReminderWindow) {
            const notifiedKey = `notified_${
              plan.id
            }_${new Date().toDateString()}`; // Notifikasi per hari per trip
            if (
              typeof window !== "undefined" &&
              !localStorage.getItem(notifiedKey)
            ) {
              if (Notification.permission === "granted") {
                new Notification(
                  `WanderTrack: Pengingat Persiapan Rencana "${plan.title}"!`,
                  {
                    body: `Jangan lupa untuk menyiapkan barang-barang untuk perjalananmu yang akan datang pada ${formatDateForDisplay(
                      plan.notificationDate
                    )}!\n\nBarang yang harus disiapkan: ${plan.items
                      .map((item) => item.text)
                      .join(", ")}`,
                    icon: "/favicon.ico",
                  }
                );
                localStorage.setItem(notifiedKey, "true");
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then((permission) => {
                  if (permission === "granted") {
                    new Notification(
                      `WanderTrack: Pengingat Persiapan Rencana "${plan.title}"!`,
                      {
                        body: `Jangan lupa untuk menyiapkan barang-barang untuk perjalananmu yang akan datang pada ${formatDateForDisplay(
                          plan.notificationDate
                        )}!\n\nBarang yang harus disiapkan: ${plan.items
                          .map((item) => item.text)
                          .join(", ")}`,
                        icon: "/favicon.ico",
                      }
                    );
                    localStorage.setItem(notifiedKey, "true");
                  }
                });
              }
            }
          }
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60 * 60 * 1000); // Periksa setiap jam

    return () => clearInterval(interval);
  }, [plans]);

  const handleCreateNewPlan = (e) => {
    e.preventDefault();
    if (newPlanTitle.trim()) {
      const newPlan = {
        id: Date.now(),
        title: newPlanTitle.trim(),
        description: newPlanDescription.trim(),
        notificationDate: "", // Awalnya kosong
        items: [],
      };
      setPlans((prevPlans) => [...prevPlans, newPlan]);
      setNewPlanTitle("");
      setNewPlanDescription("");
      setSelectedPlanId(newPlan.id);
    }
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
  };

  const handleBackToList = () => {
    setSelectedPlanId(null);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() && selectedPlanId !== null) {
      setPlans((prevPlans) => {
        const updatedPlans = prevPlans.map((plan) =>
          plan.id === selectedPlanId
            ? {
                ...plan,
                items: [
                  ...plan.items,
                  { id: Date.now(), text: newItem, checked: false },
                ],
              }
            : plan
        );
        return updatedPlans;
      });
      setNewItem("");
    }
  };

  const handleToggleCheck = (itemId) => {
    if (selectedPlanId === null) return;

    setPlans((prevPlans) => {
      const updatedPlans = prevPlans.map((plan) =>
        plan.id === selectedPlanId
          ? {
              ...plan,
              items: plan.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : plan
      );
      return updatedPlans;
    });
  };

  const handleDeleteItem = (itemId) => {
    if (selectedPlanId === null) return;

    setPlans((prevPlans) => {
      const updatedPlans = prevPlans.map((plan) =>
        plan.id === selectedPlanId
          ? {
              ...plan,
              items: plan.items.filter((item) => item.id !== itemId),
            }
          : plan
      );
      return updatedPlans;
    });
  };

  const handleDeletePlan = (planIdToDelete) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus rencana perjalanan ini dan semua keperluannya?"
      )
    ) {
      setPlans((prevPlans) =>
        prevPlans.filter((plan) => plan.id !== planIdToDelete)
      );
      if (selectedPlanId === planIdToDelete) {
        setSelectedPlanId(null);
      }
    }
  };

  const handleNotificationDateChange = (e) => {
    const date = e.target.value; // Nilai dari datetime-local sudah dalam format YYYY-MM-DDTHH:mm
    setNotificationDate(date);

    if (selectedPlanId !== null) {
      setPlans((prevPlans) => {
        const updatedPlans = prevPlans.map((plan) =>
          plan.id === selectedPlanId
            ? { ...plan, notificationDate: date }
            : plan
        );
        return updatedPlans;
      });
    }
  };

  // Fungsi helper untuk memformat tanggal dengan jam untuk tampilan
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Belum diatur";
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Gunakan format 24 jam
    };
    return new Date(dateString).toLocaleString("id-ID", options); // Sesuaikan 'id-ID' untuk bahasa Indonesia
  };

  const currentSelectedPlan = plans.find((p) => p.id === selectedPlanId);
  const planItemsForSelectedPlan = currentSelectedPlan
    ? currentSelectedPlan.items
    : [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950/95 flex flex-col">
      {/* <Header /> */} {/* Render Header dari layout.js */}
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Manajemen Rencana Perjalanan
        </h1>

        {selectedPlanId === null ? (
          <>
            {" "}
            <section className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-6">
              <div className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Buat Rencana Perjalanan Baru
              </div>
              <form onSubmit={handleCreateNewPlan} className="space-y-4">
                <div>
                  <label
                    htmlFor="newPlanTitle"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Judul Rencana
                  </label>
                  <input
                    type="text"
                    id="newPlanTitle"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Misal: Liburan ke Bali, Pendakian Gunung Fuji"
                    value={newPlanTitle}
                    onChange={(e) => setNewPlanTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPlanDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    id="newPlanDescription"
                    rows="2"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Ceritakan sedikit tentang rencana Anda..."
                    value={newPlanDescription}
                    onChange={(e) => setNewPlanDescription(e.target.value)}
                  ></textarea>
                </div>{" "}
                <button
                  type="submit"
                  className="w-full bg-yellow-500 dark:bg-yellow-600 text-white p-3 rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <PlusCircle className="w-5 h-5" /> Buat Rencana
                </button>
              </form>
            </section>{" "}
            <section className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Daftar Rencana Anda ({plans.length})
              </h2>{" "}
              {plans.length === 0 ? (
                <div className="text-center py-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                  <CalendarDays className="mx-auto w-12 h-12 text-yellow-400 dark:text-yellow-500 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Belum ada rencana perjalanan yang dibuat.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Gunakan formulir di atas untuk membuat rencana pertama Anda!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`relative bg-yellow-50 dark:bg-gray-700/50 rounded-lg p-4 cursor-pointer border-2 transition-all duration-200
                                                        ${
                                                          selectedPlanId ===
                                                          plan.id
                                                            ? "border-yellow-500 shadow-lg dark:shadow-yellow-500/10"
                                                            : "border-transparent hover:border-yellow-300 dark:hover:border-yellow-500/50"
                                                        }`}
                    >
                      {" "}
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
                        {plan.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {plan.description || "Tidak ada deskripsi."}
                      </p>
                      {plan.notificationDate && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-2">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          {/* Tampilan tanggal notifikasi di daftar rencana */}
                          <span>
                            Pengingat:{" "}
                            {formatDateForDisplay(plan.notificationDate)}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Hapus rencana"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          currentSelectedPlan && (
            <section className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              {" "}
              <button
                onClick={handleBackToList}
                className="mb-4 flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Kembali ke Daftar Rencana
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Detail Rencana:{" "}
                <span className="text-yellow-600 dark:text-yellow-500">
                  {currentSelectedPlan.title}
                </span>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {currentSelectedPlan.description || "Tidak ada deskripsi."}
              </p>
              {/* Tanggal Pengingat - Ubah type dan value */}{" "}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  Atur Tanggal Pengingat
                </h3>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={notificationDate}
                  onChange={handleNotificationDateChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Notifikasi akan muncul 2 hari sebelum tanggal yang ditentukan.
                </p>
              </div>{" "}
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Daftar Keperluan
              </h3>
              <form onSubmit={handleAddItem} className="flex mb-4">
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Tambahkan keperluan baru..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-500 text-white p-2 rounded-r-md hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors duration-200 flex items-center gap-1"
                >
                  <PlusCircle className="w-5 h-5" /> Tambah
                </button>
              </form>{" "}
              {planItemsForSelectedPlan.length === 0 ? (
                <div className="text-center py-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Belum ada keperluan untuk rencana ini.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Tambahkan barang yang harus disiapkan di atas.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {planItemsForSelectedPlan.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleToggleCheck(item.id)}
                          className="form-checkbox h-5 w-5 text-yellow-600 dark:text-yellow-500 rounded cursor-pointer bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                        <span
                          className={`ml-3 text-base ${
                            item.checked
                              ? "line-through text-gray-500 dark:text-gray-400"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                        title="Hapus keperluan"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        )}
      </main>
      {/* <BottomNav /> */} {/* Render BottomNav dari layout.js */}
    </div>
  );
}
