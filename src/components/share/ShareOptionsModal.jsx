// import { X, Copy, Facebook, Twitter, Whatsapp, Instagram } from "lucide-react";

// const ShareOptionsModal = ({ trip, onClose }) => {
//   if (!trip) return null; // Pastikan ada trip yang dipilih

//   const tripUrl = `${window.location.origin}/trip/${trip.id}`;
//   const shareText = `Lihat petualangan luar biasa ${trip.title} oleh @${trip.username} di aplikasi kami!`;

//   const handleCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(tripUrl);
//       alert("Link trip berhasil disalin!"); 
//       onClose(); 
//     } catch (err) {
//       console.error('Gagal menyalin teks:', err);
//       alert("Gagal menyalin link.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"> {/* z-index lebih tinggi dari modal utama */}
//       <div className="relative w-full max-w-sm rounded-xl p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <h3 className="text-lg font-bold mb-4 text-center">Bagikan Petualangan Ini</h3>

//         <div className="flex flex-wrap justify-center gap-4 mb-6">
//           {/* WhatsApp */}
//           <a
//             href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + tripUrl)}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex flex-col items-center gap-1 text-xs text-center hover:opacity-80 transition-opacity"
//           >
//             <div className="p-3 bg-green-500 rounded-full text-white">
//               <Whatsapp className="w-6 h-6" />
//             </div>
//             WhatsApp
//           </a>

//           {/* Facebook */}
//           <a
//             href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tripUrl)}&quote=${encodeURIComponent(shareText)}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex flex-col items-center gap-1 text-xs text-center hover:opacity-80 transition-opacity"
//           >
//             <div className="p-3 bg-blue-600 rounded-full text-white">
//               <Facebook className="w-6 h-6" />
//             </div>
//             Facebook
//           </a>

//           {/* Twitter / X */}
//           <a
//             href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(tripUrl)}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex flex-col items-center gap-1 text-xs text-center hover:opacity-80 transition-opacity"
//           >
//             <div className="p-3 bg-black rounded-full text-white"> {/* Biasanya hitam untuk X */}
//               <Twitter className="w-6 h-6" />
//             </div>
//             Twitter/X
//           </a>

//           {/* Instagram (tidak ada API share langsung yang mudah dari web) */}
//           {/* Untuk Instagram, umumnya disarankan untuk copy link atau menggunakan Web Share API native */}
//           <button
//             onClick={handleCopyLink} 
//             className="flex flex-col items-center gap-1 text-xs text-center hover:opacity-80 transition-opacity"
//           >
//             <div className="p-3 bg-pink-500 rounded-full text-white">
//               <Instagram className="w-6 h-6" />
//             </div>
//             Instagram (Salin Link)
//           </button>
//         </div>

//         {/* Opsi Salin Link terpisah (untuk fleksibilitas) */}
//         <button
//           onClick={handleCopyLink}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//         >
//           <Copy className="w-4 h-4" /> Salin Link
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ShareOptionsModal;