"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateTrip } from "@/services/tripService";
import MarkdownItinerary from "@/components/MarkdownItinerary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface TripResult {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  ai_recommendation: string;
}

// ── SVG Icons ──────────────────────────────────────────────────────────
const PlaneIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DollarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0l1.5 6H18l-3.75 3 1.5 6L12 12l-3.75 3 1.5-6L6 6h4.5L12 0z" opacity=".5" />
    <path d="M12 2l1.09 4.36H17l-2.73 2.18 1.09 4.36L12 10.5l-3.36 2.4 1.09-4.36L6.91 6.36H11L12 2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CompassIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const ZapIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ── Constants ──────────────────────────────────────────────────────────
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TRAVEL_STYLES = [
  { value: "cultural", label: "🏛️  Wisata Budaya & Sejarah (Cultural)" },
  { value: "backpacker", label: "🎒  Backpacker / Hemat (Budget)" },
  { value: "luxury", label: "💎  Mewah & Relaksasi (Luxury)" },
  { value: "family", label: "👨‍👩‍👧  Keluarga & Anak (Family Friendly)" },
  { value: "adventure", label: "🧗  Petualangan Alam (Adventure & Nature)" },
  { value: "culinary", label: "🍜  Eksplorasi Kuliner (Foodie Tour)" },
];

const POPULAR_DESTINATIONS = [
  {
    name: "Tokyo & Kyoto, Jepang",
    query: "Tokyo, Kyoto, Osaka",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    tag: "Favorit Asia",
    duration: "7 Hari",
    estBudget: "$1,200",
  },
  {
    name: "Bali & Nusa Penida, Indonesia",
    query: "Bali, Nusa Penida, Ubud",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    tag: "Tropis & Budaya",
    duration: "5 Hari",
    estBudget: "$450",
  },
  {
    name: "Swiss Alps & Zurich, Swiss",
    query: "Zurich, Interlaken, Zermatt",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    tag: "Pemandangan Alam",
    duration: "6 Hari",
    estBudget: "$1,800",
  },
  {
    name: "Paris & Roma, Eropa",
    query: "Paris, Rome, Florence",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    tag: "Romantis & Klasik",
    duration: "8 Hari",
    estBudget: "$1,600",
  },
];

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destinations: "",
    days: 3,
    budget: 1000,
    month: "January",
    travel_style: "cultural",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TripResult | null>(null);
  const [error, setError] = useState("");

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // User not logged in, redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPreset = (destinationString: string) => {
    setFormData((prev) => ({ ...prev, destinations: destinationString }));
    const formElement = document.getElementById("planner-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Check if user is logged in
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError("Please login first to create trips.");
        router.push('/login');
        return;
      }

      if (formData.budget <= 0 || formData.days < 1) {
        throw new Error("Budget dan durasi hari harus bernilai lebih dari 0.");
      }

      if (!formData.destinations.trim()) {
        throw new Error("Mohon masukkan minimal satu nama destinasi.");
      }

      // Use the service layer to generate trip
      const data = await generateTrip({
        destination: formData.destinations,
        budget: Number(formData.budget),
        days: Number(formData.days),
        travel_style: formData.travel_style,
      });

      setResult(data);

      // Scroll to result section
      setTimeout(() => {
        const resultEl = document.getElementById("itinerary-result");
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err: any) {
      // Handle 401 Unauthorized
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('auth_token');
        setError("Your session has expired. Please login again.");
        router.push('/login');
        return;
      }
      
      setError(err.message || "Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05061a] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* ── BACKGROUND GLOW LAYER ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="bg-orb-1 absolute w-[70vw] h-[70vw] -top-[20%] -left-[15%] rounded-full blur-[100px] opacity-40" />
        <div className="bg-orb-2 absolute w-[60vw] h-[60vw] -top-[10%] -right-[15%] rounded-full blur-[120px] opacity-35" />
        <div className="bg-orb-3 absolute w-[45vw] h-[45vw] top-[40%] left-[25%] rounded-full blur-[130px] opacity-25" />
      </div>

      {/* ── NAVBAR ────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO SECTION WITH DESTINATION IMAGE ────────────────────── */}
      <section className="relative z-10 pt-10 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI Travel Itinerary Generator Generasi Baru</span>
            <span className="text-slate-400">| Sesi 6</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-5">
            Jelajahi Dunia Lebih Mudah dengan <span className="text-gradient">KelanaAI</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Rencanakan liburan impian Anda dalam hitungan detik. Dapatkan rekomendasi itinerari personal, estimasi anggaran terperinci, dan rute perjalanan pintar berbasis kecerdasan buatan.
          </p>
        </div>

        {/* ── HERO DESTINATION IMAGE SHOWCASE BANNER ─────────────────── */}
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-950/60 mb-16 group">
          {/* Main Hero Destination Image */}
          <div className="relative h-64 sm:h-96 md:h-[450px] w-full overflow-hidden bg-slate-900">
            <img
              src="/assets/airplane_3d_hero.jpg"
              alt="Destinasi Wisata Impian KelanaAI"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Ambient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05061a] via-[#05061a]/40 to-transparent" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#05061a]/30 to-[#05061a]/80" />
            
            {/* Top Floating Badge on Image */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-950/70 border border-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold text-white shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Destinasi Populer Terpilih</span>
            </div>

            {/* Quick Deal Badge */}
            <div className="hidden sm:flex absolute top-6 right-6 items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-purple-500/40 backdrop-blur-md shadow-xl">
              <div className="text-left">
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">Hemat Anggaran</span>
                <span className="text-sm font-black text-white">Rute Multi-Kota AI</span>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-xl font-black text-xs text-white">
                Diskon 35%
              </div>
            </div>

            {/* Bottom Overlay Text Content */}
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1 inline-flex items-center gap-1.5">
                  <CompassIcon /> Eksplorasi Tanpa Batas
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                  Rencanakan Petualangan Tak Terlupakan
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 hidden sm:block">
                  Pilih salah satu rekomendasi rute terpopuler di bawah ini atau tentukan destinasi Anda sendiri.
                </p>
              </div>

              {/* Destination Pill Shortcuts */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSelectPreset("Tokyo, Kyoto, Osaka")}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-purple-600/60 border border-white/20 hover:border-purple-400 text-xs font-medium text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  🇯🇵 Tokyo & Kyoto
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset("Bali, Nusa Penida, Ubud")}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-purple-600/60 border border-white/20 hover:border-purple-400 text-xs font-medium text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  🇮🇩 Bali & Lombok
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset("Zurich, Interlaken, Zermatt")}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-purple-600/60 border border-white/20 hover:border-purple-400 text-xs font-medium text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  🇨🇭 Swiss Alps
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {[
            { value: "15,000+", label: "Itinerari Dibuat" },
            { value: "98.5%", label: "Tingkat Kepuasan" },
            { value: "120+", label: "Negara Terjangkau" },
            { value: "< 5 Detik", label: "Waktu Proses AI" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-4 sm:p-5 text-center border border-white/5 hover:border-purple-500/30 transition-colors"
            >
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── RESPONSIVE TRIP PLANNER FORM CARD ──────────────────────── */}
        <div id="planner-form" className="scroll-mt-28 mb-20">
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/20 shadow-2xl relative overflow-hidden">
            
            {/* Top decorative gradient border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            
            {/* Form Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <PlaneIcon />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Formulir Rencana Perjalanan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Lengkapi preferensi di bawah dan biarkan AI menyusun itinerari otomatis
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <ShieldCheckIcon /> Bebas Repot & Cepat
              </div>
            </div>

            {/* Main Form - Mobile First Responsive Stacking */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Destination Input (Full Width) */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label htmlFor="destinations-input" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <MapPinIcon />
                    <span>Destinasi Tujuan</span>
                    <span className="text-purple-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Bisa multi-tujuan, pisahkan dengan koma (contoh: Tokyo, Kyoto, Osaka)
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="destinations-input"
                    type="text"
                    name="destinations"
                    value={formData.destinations}
                    onChange={handleChange}
                    placeholder="Masukkan kota atau negara tujuan (e.g. Bali, Lombok / Paris, Roma)"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Responsive Grid for Duration, Budget, and Month */}
              {/* On mobile (<640px): 1 column (stacks vertically) */}
              {/* On tablet/desktop (>=640px): 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Duration Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="days-input" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <CalendarIcon />
                    <span>Durasi Perjalanan</span>
                    <span className="text-purple-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="days-input"
                      type="number"
                      name="days"
                      min="1"
                      max="30"
                      value={formData.days}
                      onChange={handleChange}
                      className="w-full pl-4 pr-14 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                      Hari
                    </span>
                  </div>
                </div>

                {/* Budget Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="budget-input" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <DollarIcon />
                    <span>Total Estimasi Budget</span>
                    <span className="text-purple-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                      USD ($)
                    </span>
                    <input
                      id="budget-input"
                      type="number"
                      name="budget"
                      min="10"
                      step="10"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full pl-20 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Month Selector */}
                <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
                  <label htmlFor="month-select" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <CalendarIcon />
                    <span>Bulan Keberangkatan</span>
                  </label>
                  <div className="relative">
                    <select
                      id="month-select"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white text-sm sm:text-base appearance-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer transition-all"
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m} className="bg-[#0c0f2e] text-white">
                          {m}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>

              {/* Travel Style Selector (Full Width) */}
              <div className="flex flex-col gap-2">
                <label htmlFor="travel-style-select" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <SparklesIcon />
                  <span>Gaya & Preferensi Liburan</span>
                </label>
                <div className="relative">
                  <select
                    id="travel-style-select"
                    name="travel_style"
                    value={formData.travel_style}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white text-sm sm:text-base appearance-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer transition-all"
                  >
                    {TRAVEL_STYLES.map((style) => (
                      <option key={style.value} value={style.value} className="bg-[#0c0f2e] text-white">
                        {style.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Action Button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="search-trip-btn"
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-full font-bold text-sm sm:text-base text-white flex items-center justify-center gap-3 transition-all ${
                    loading
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      <span>Sedang Menyusun Itinerari AI...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      <span>Buat Itinerari Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── RESULT ITINERARY SECTION ───────────────────────────────── */}
        {result && !loading && (
          <div id="itinerary-result" className="scroll-mt-28 mb-20 animate-scale-in">
            <div className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden">
              
              {/* Header Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                    <StarIcon />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Rencana Perjalanan Pribadi Anda
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Disusun otomatis oleh KelanaAI khusus untuk kebutuhan Anda
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  🖨️ Cetak / Simpan PDF
                </button>
              </div>

              {/* Trip Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Destinasi
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {result.destination}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Durasi
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {result.days} Hari
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Total Anggaran
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-400">
                    ${result.budget}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Gaya Liburan
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-purple-300">
                    {result.category}
                  </span>
                </div>
              </div>

              {/* Markdown Content Output */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#090b24]/80 border border-white/10 itinerary-prose">
                <MarkdownItinerary content={result.ai_recommendation} />
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/trips" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  📋 View My Trips
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setFormData({
                      destinations: "",
                      days: 3,
                      budget: 1000,
                      month: "January",
                      travel_style: "cultural",
                    });
                    const formElement = document.getElementById("planner-form");
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-all"
                >
                  ✨ Create Another Trip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── POPULAR DESTINATIONS SHOWCASE SECTION ──────────────────── */}
        <section id="destinasi" className="scroll-mt-28 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-3">
              🌍 Inspirasi Liburan
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Destinasi Pilihan Terpopuler
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Klik salah satu destinasi untuk mengisi formulir secara otomatis dan mulai petualangan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                onClick={() => handleSelectPreset(dest.query)}
                className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover border border-white/10 cursor-pointer flex flex-col"
              >
                {/* Destination Card Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f2e] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[11px] font-bold text-white">
                    {dest.tag}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span>⏱️ {dest.duration}</span>
                      <span>•</span>
                      <span>Est. {dest.estBudget}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>Pilih Destinasi</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3D VISUAL & AI FEATURES SHOWCASE ───────────────────────── */}
        <section id="fitur" className="scroll-mt-28 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase mb-3">
              ✦ Fitur Unggulan
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mengapa Memilih <span className="text-gradient">KelanaAI</span>?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Didukung teknologi AI termutakhir untuk pengalaman perencanaan liburan tanpa stres.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 group flex flex-col">
              <div className="h-44 overflow-hidden relative bg-slate-900">
                <img
                  src="/assets/mountain_3d_card.jpg"
                  alt="Optimasi Rute Cerdas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f2e] via-[#0c0f2e]/20 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[11px] font-bold text-white">
                  🏔️ RUTE EFISIEN
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Optimasi Rute Cerdas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    AI menghitung jarak dan urutan kunjungan terbaik agar waktu Anda di jalan lebih hemat dan efisien.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-purple-400">
                  <ZapIcon />
                  <span>Hemat hingga 40% waktu perjalanan</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 group flex flex-col">
              <div className="h-44 overflow-hidden relative bg-slate-900">
                <img
                  src="/assets/airplane_3d_hero.jpg"
                  alt="Rekomendasi Musim & Waktu"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f2e] via-[#0c0f2e]/20 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-[11px] font-bold text-white">
                  ✈️ PREDIKSI MUSIM
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Rekomendasi Sesuai Musim
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Menyesuaikan agenda harian dengan cuaca, festival lokal, serta musim terbaik di destinasi tujuan.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <SparklesIcon />
                  <span>Rekomendasi dinamis 12 bulan</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 group flex flex-col">
              <div className="h-44 overflow-hidden relative bg-slate-900">
                <img
                  src="/assets/suitcase_3d_card.jpg"
                  alt="Transparansi Estimasi Biaya"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f2e] via-[#0c0f2e]/20 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pink-600/80 backdrop-blur-md text-[11px] font-bold text-white">
                  🧳 ESTIMASI ANGGARAN
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Rincian Anggaran Transparan
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Dapatkan pembagian budget realistis untuk akomodasi, kuliner, transportasi, dan tiket wisata.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-pink-400">
                  <DollarIcon />
                  <span>Sesuai limit anggaran pengguna</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </section>

      {/* ── COMPREHENSIVE FOOTER ────────────────────────────────────── */}
      <footer className="mt-auto relative z-10 border-t border-white/10 bg-[#040515]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Brand column (2 spans) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <PlaneIcon />
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  Kelana<span className="text-purple-400">AI</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                KelanaAI adalah platform asisten perjalanan pintar berbasis Artificial Intelligence yang mempermudah perencanaan itinerari, efisiensi rute, dan estimasi anggaran liburan.
              </p>
              <div className="flex items-center gap-3 text-slate-400 text-xs mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  ⚡ Powered by AI Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  🇮🇩 Indonesia
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Navigasi Utama
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Beranda</a></li>
                <li><a href="#planner-form" className="hover:text-purple-400 transition-colors">Buat Itinerari</a></li>
                <li><a href="#destinasi" className="hover:text-purple-400 transition-colors">Destinasi Populer</a></li>
                <li><a href="#fitur" className="hover:text-purple-400 transition-colors">Fitur Unggulan</a></li>
              </ul>
            </div>

            {/* Popular Destinations Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Destinasi Favorit
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                <li><a href="#planner-form" onClick={() => handleSelectPreset("Tokyo, Kyoto, Osaka")} className="hover:text-purple-400 transition-colors">Tokyo & Kyoto</a></li>
                <li><a href="#planner-form" onClick={() => handleSelectPreset("Bali, Nusa Penida, Ubud")} className="hover:text-purple-400 transition-colors">Bali & Lombok</a></li>
                <li><a href="#planner-form" onClick={() => handleSelectPreset("Zurich, Interlaken, Zermatt")} className="hover:text-purple-400 transition-colors">Swiss Alps</a></li>
                <li><a href="#planner-form" onClick={() => handleSelectPreset("Paris, Rome, Florence")} className="hover:text-purple-400 transition-colors">Paris & Roma</a></li>
              </ul>
            </div>

            {/* Legal & Social Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Informasi & Bantuan
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pusat Bantuan (FAQ)</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar with Copyright */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 KelanaAI. Seluruh hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Syarat Penggunaan</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Privasi</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Dokumentasi</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}