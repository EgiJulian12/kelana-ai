"use client";

import { useState } from "react";
import MarkdownItinerary from "./components/MarkdownItinerary";

interface TripResult {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  ai_recommendation: string;
}

// ── Icon Components ────────────────────────────────────────────────
const PlaneSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const MapPinSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DollarSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const SparklesSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0l1.5 6H18l-3.75 3 1.5 6L12 12l-3.75 3 1.5-6L6 6h4.5L12 0z" opacity=".5" />
    <path d="M12 2l1.09 4.36H17l-2.73 2.18 1.09 4.36L12 10.5l-3.36 2.4 1.09-4.36L6.91 6.36H11L12 2z" />
  </svg>
);

const StarSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ChevronSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const GlobeSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const BrainSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 00-2 2v0a2 2 0 002 2h.09A2.5 2.5 0 017 13.5v0A2.5 2.5 0 019.5 16H10v4a2 2 0 004 0v-4h.5A2.5 2.5 0 0117 13.5v0a2.5 2.5 0 012.91-2.5H20a2 2 0 002-2v0a2 2 0 00-2-2h-.09A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2h-5z" />
  </svg>
);

const ClockSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ── Feature Card Data ──────────────────────────────────────────────
const features = [
  { icon: <BrainSVG />, label: "AI-Powered", desc: "Smart itinerary generation" },
  { icon: <GlobeSVG />, label: "Multi-Destination", desc: "Plan multiple stops" },
  { icon: <ClockSVG />, label: "Instant Results", desc: "Get plans in seconds" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TRAVEL_STYLES = [
  { value: "cultural", label: "🏛️  Cultural & Sightseeing" },
  { value: "backpacker", label: "🎒  Backpacker / Budget" },
  { value: "luxury", label: "💎  Luxury & Relaxing" },
  { value: "family", label: "👨‍👩‍👧  Family Friendly" },
  { value: "adventure", label: "🧗  Action & Adventure" },
];

// ── Main Component ─────────────────────────────────────────────────
export default function Home() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (formData.budget <= 0 || formData.days < 1)
        throw new Error("Budget dan durasi harus lebih dari 0.");

      const destinations = formData.destinations
        .split(",").map(d => d.trim()).filter(Boolean);

      const res = await fetch("http://localhost:8000/api/v1/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          destinations,
          days: Number(formData.days),
          budget: Number(formData.budget),
        }),
      });

      if (!res.ok) throw new Error((await res.json()).detail || "Gagal menyusun itinerari AI.");
      setResult(await res.json());
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: "var(--navy)", overflowX: "hidden" }}>

      {/* ── ANIMATED BACKGROUND LAYER ─────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="bg-grid absolute inset-0" />

        {/* Orb 1 — purple, top-left */}
        <div
          className="bg-orb-1 absolute"
          style={{ width: "65vw", height: "65vw", top: "-20%", left: "-15%", opacity: 0.55, filter: "blur(80px)" }}
        />
        {/* Orb 2 — blue, top-right */}
        <div
          className="bg-orb-2 absolute"
          style={{ width: "55vw", height: "55vw", top: "-10%", right: "-15%", opacity: 0.5, filter: "blur(90px)" }}
        />
        {/* Orb 3 — lavender, mid */}
        <div
          className="bg-orb-3 absolute"
          style={{ width: "40vw", height: "40vw", top: "35%", left: "30%", opacity: 0.3, filter: "blur(100px)" }}
        />

        {/* Subtle top-center beam */}
        <div
          className="absolute"
          style={{
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            height: "70vh",
            background: "linear-gradient(to bottom, transparent, rgba(124,58,237,0.4), transparent)",
            filter: "blur(1px)",
          }}
        />
      </div>

      {/* ── FLOATING DECORATIVE BADGES ──────────────────── */}
      <div className="hidden lg:block" style={{ position: "absolute", inset: 0, zIndex: 15, pointerEvents: "none" }}>
        {/* Left badge */}
        <div
          className="floating-badge animate-float"
          style={{
            position: "absolute",
            top: "22%",
            left: "2%",
            padding: "10px 18px",
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            animationDelay: "0s",
            pointerEvents: "all",
          }}
        >
          <span style={{ fontSize: "1rem" }}>✈️</span>
          AI-POWERED TRAVEL
        </div>

        {/* Right badge */}
        <div
          className="floating-badge animate-float"
          style={{
            position: "absolute",
            top: "19%",
            right: "2%",
            padding: "10px 18px",
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            animationDelay: "1.5s",
            pointerEvents: "all",
          }}
        >
          <span style={{ fontSize: "1rem" }}>🌍</span>
          SMART ITINERARY
        </div>

        {/* Mid-left badge */}
        <div
          className="floating-badge animate-float"
          style={{
            position: "absolute",
            top: "32%",
            left: "1.5%",
            padding: "10px 16px",
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            animationDelay: "0.8s",
            pointerEvents: "all",
          }}
        >
          <span style={{ fontSize: "1rem" }}>⚡</span>
          INSTANT PLAN
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28">

        {/* ── HERO SECTION ─────────────────────────────────── */}
        <header className="text-center mb-16">
          {/* Top badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 mb-8" style={{ animationDelay: "0s" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px 6px 8px",
                borderRadius: 50,
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.3)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#a78bfa",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
                  borderRadius: 50,
                  padding: "3px 8px",
                  fontSize: "0.65rem",
                  color: "#fff",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                NEW
              </span>
              Plan Smarter With KelanaAI
            </div>
          </div>

          {/* Main heading */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              marginBottom: "1.5rem",
              color: "#fff",
            }}
          >
            Save Time &amp; Money
            <br />
            <span className="text-gradient">On Every Trip</span>
          </h1>

          {/* Sub heading */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "1rem",
              color: "rgba(148,163,184,0.8)",
              maxWidth: "520px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.75,
              fontWeight: 400,
            }}
          >
            Discover the best destinations, get personalized AI recommendations,
            and craft your perfect itinerary effortlessly in seconds.
          </p>

          {/* Stats row */}
          <div
            className="animate-fade-up delay-300"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2.5rem",
              flexWrap: "wrap",
              marginBottom: "3rem",
            }}
          >
            {[
              { value: "13,200+", label: "Trips Planned" },
              { value: "98%", label: "Satisfaction" },
              { value: "120+", label: "Countries" },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.72rem", color: "rgba(148,163,184,0.6)", fontWeight: 500, letterSpacing: "0.04em", marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── 3D VISUAL SHOWCASE BANNER (Airlume-Inspired) ── */}
          <div
            className="animate-fade-up delay-400 glass-card"
            style={{
              borderRadius: 24,
              position: "relative",
              overflow: "hidden",
              marginBottom: "3.5rem",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              boxShadow: "0 20px 60px -15px rgba(124, 58, 237, 0.25), 0 0 40px rgba(59, 130, 246, 0.15)",
            }}
          >
            <div style={{ position: "relative", height: "320px", width: "100%" }}>
              {/* 3D Airplane & Mountain Image */}
              <img
                src="/assets/airplane_3d_hero.jpg"
                alt="3D Airplane flying over glowing mountains"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 35%",
                  filter: "brightness(0.9) contrast(1.05)",
                }}
              />

              {/* Gradient overlays for seamless blend */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(5,6,26,0.95) 0%, rgba(5,6,26,0.3) 40%, rgba(5,6,26,0.5) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,6,26,0.8) 100%)",
                }}
              />

              {/* Top Left Floating Tag */}
              <div
                className="floating-badge"
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "20px",
                  padding: "8px 14px",
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#fff",
                  background: "rgba(10, 13, 40, 0.75)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Scanning 200+ Airlines in Real-Time</span>
              </div>

              {/* Top Right Mini Fare Card */}
              <div
                className="hidden sm:flex"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "20px",
                  padding: "10px 16px",
                  borderRadius: 16,
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(12, 15, 46, 0.8)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(124, 58, 237, 0.4)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "0.68rem", color: "#a78bfa", fontWeight: 700, textTransform: "uppercase" }}>Best Deal Found</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff" }}>TYO ⇄ OSAKA</div>
                  <div style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 600 }}>Save 35% with AI Route</div>
                </div>
                <div
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                    padding: "6px 12px",
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    color: "#fff",
                  }}
                >
                  $179
                </div>
              </div>

              {/* Bottom Info Banner */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-2">
                    <span>🏔️ AI Altitude & Mountain Route Engine</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    Smart Scenic Routing &amp; Flight Optimization
                  </h3>
                </div>

                {/* Preset destination quick pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Tokyo, Kyoto, Osaka", label: "🇯🇵 Japan Trio" },
                    { name: "Zurich, Zermatt, Interlaken", label: "🇨🇭 Swiss Alps" },
                    { name: "Reykjavik, Vik, Akureyri", label: "🇮🇸 Iceland Aura" },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, destinations: preset.name }))}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "#e2e8f0",
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(124, 58, 237, 0.35)";
                        e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.6)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── MAIN FORM CARD ───────────────────────────────── */}
        <div
          className="glass-card animate-scale-in delay-200"
          style={{ borderRadius: 28, padding: "2px", marginBottom: "3.5rem", position: "relative" }}
        >
          {/* Top glow line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(124,58,237,0.8), rgba(59,130,246,0.6), transparent)",
              borderRadius: 1,
            }}
          />

          {/* Corner accents */}
          <div style={{ position: "absolute", top: -1, left: -1, width: 24, height: 24, borderTop: "2px solid rgba(124,58,237,0.6)", borderLeft: "2px solid rgba(124,58,237,0.6)", borderRadius: "8px 0 0 0" }} />
          <div style={{ position: "absolute", top: -1, right: -1, width: 24, height: 24, borderTop: "2px solid rgba(59,130,246,0.6)", borderRight: "2px solid rgba(59,130,246,0.6)", borderRadius: "0 8px 0 0" }} />
          <div style={{ position: "absolute", bottom: -1, left: -1, width: 24, height: 24, borderBottom: "2px solid rgba(124,58,237,0.4)", borderLeft: "2px solid rgba(124,58,237,0.4)", borderRadius: "0 0 0 8px" }} />
          <div style={{ position: "absolute", bottom: -1, right: -1, width: 24, height: 24, borderBottom: "2px solid rgba(59,130,246,0.4)", borderRight: "2px solid rgba(59,130,246,0.4)", borderRadius: "0 0 8px 0" }} />

          <div style={{ borderRadius: 26, padding: "2.5rem 2.5rem 2rem" }}>
            {/* Form header */}
            <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))",
                  border: "1px solid rgba(124,58,237,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#a78bfa",
                }}
              >
                <PlaneSVG />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#f1f5f9" }}>Plan Your Trip</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.6)" }}>Fill in the details below and let AI do the rest</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Destination field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", fontWeight: 700, color: "rgba(148,163,184,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    <MapPinSVG /> Destinasi
                  </label>
                  <span className="text-[11px] text-slate-500">Pisahkan dengan koma (,) untuk multi-kota</span>
                </div>
                <input
                  id="destinations-input"
                  type="text"
                  name="destinations"
                  value={formData.destinations}
                  onChange={handleChange}
                  placeholder="e.g. Tokyo, Kyoto, Osaka"
                  className="glass-input"
                  style={{ width: "100%", padding: "1rem 1.25rem", fontSize: "0.95rem" }}
                  required
                />
              </div>

              {/* Row: Days + Budget + Month */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", fontWeight: 700, color: "rgba(148,163,184,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>
                    <CalendarSVG /> Durasi
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="days-input"
                      type="number"
                      name="days"
                      min="1"
                      value={formData.days}
                      onChange={handleChange}
                      className="glass-input"
                      style={{ width: "100%", padding: "1rem 3.5rem 1rem 1.25rem", fontSize: "0.95rem" }}
                      required
                    />
                    <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "rgba(148,163,184,0.5)", fontWeight: 600 }}>
                      Hari
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", fontWeight: 700, color: "rgba(148,163,184,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>
                    <DollarSVG /> Budget
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "1.1rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem", color: "rgba(148,163,184,0.5)", fontWeight: 700 }}>
                      USD
                    </span>
                    <input
                      id="budget-input"
                      type="number"
                      name="budget"
                      min="1"
                      value={formData.budget}
                      onChange={handleChange}
                      className="glass-input"
                      style={{ width: "100%", padding: "1rem 1.25rem 1rem 3.5rem", fontSize: "0.95rem" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", fontWeight: 700, color: "rgba(148,163,184,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>
                    <CalendarSVG /> Bulan
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      id="month-select"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                      className="glass-input"
                      style={{ width: "100%", padding: "1rem 2.5rem 1rem 1.25rem", fontSize: "0.95rem", appearance: "none", cursor: "pointer" }}
                    >
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.4)", pointerEvents: "none" }}>
                      <ChevronSVG />
                    </span>
                  </div>
                </div>
              </div>

              {/* Travel style */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", fontWeight: 700, color: "rgba(148,163,184,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>
                  <SparklesSVG /> Gaya Perjalanan
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    id="travel-style-select"
                    name="travel_style"
                    value={formData.travel_style}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ width: "100%", padding: "1rem 2.5rem 1rem 1.25rem", fontSize: "0.95rem", appearance: "none", cursor: "pointer" }}
                  >
                    {TRAVEL_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.4)", pointerEvents: "none" }}>
                    <ChevronSVG />
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: 14,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#f87171",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* Submit button */}
              <div style={{ paddingTop: "0.5rem", display: "flex", justifyContent: "center" }}>
                <button
                  id="search-trip-btn"
                  type="submit"
                  disabled={loading}
                  className={loading ? "" : "btn-glow"}
                  style={{
                    minWidth: 240,
                    padding: "1rem 2.5rem",
                    borderRadius: 50,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.03em",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    background: loading
                      ? "rgba(255,255,255,0.06)"
                      : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #3b82f6 100%)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      <span>Generating Itinerary…</span>
                    </>
                  ) : (
                    <>
                      <span>✦</span>
                      <span>Search Trip Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── 3D INTERACTIVE CARDS & FEATURES (Pinterest Reference Style) ── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase mb-3">
              ✦ AI-Powered Features
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Travel Effortless with <span className="text-gradient">Kelana AI</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              Enjoy seamless booking, smarter flight predictions, and personalized mountain-to-city itineraries.
            </p>
          </div>

          <div
            className="animate-fade-up delay-500"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Card 1: 3D Mountain Explorer */}
            <div
              className="glass-card glass-card-hover group"
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
              }}
            >
              <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                <img
                  src="/assets/mountain_3d_card.jpg"
                  alt="3D Mountain Scenic Optimizer"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(12, 15, 46, 1) 0%, rgba(12, 15, 46, 0.2) 60%, transparent 100%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(124, 58, 237, 0.8)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: 20,
                  }}
                >
                  🏔️ MOUNTAIN &amp; TRAILS
                </span>
              </div>
              <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
                  Smart Route Optimization
                </h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(148, 163, 184, 0.8)", lineHeight: 1.6 }}>
                  AI analyzes altitude, scenic viewpoints, and travel terrain to craft the ultimate roadtrip.
                </p>
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 6, color: "#a78bfa", fontSize: "0.75rem", fontWeight: 700 }}>
                  <span>Explore Route Features</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Card 2: 3D Airplane Flight Fare Predictor */}
            <div
              className="glass-card glass-card-hover group"
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
              }}
            >
              <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                <img
                  src="/assets/airplane_3d_hero.jpg"
                  alt="3D Airplane Fare Predictor"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    transition: "transform 0.5s ease",
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(12, 15, 46, 1) 0%, rgba(12, 15, 46, 0.2) 60%, transparent 100%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(59, 130, 246, 0.8)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: 20,
                  }}
                >
                  ✈️ REAL-TIME RADAR
                </span>
              </div>
              <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
                  AI Flight &amp; Fare Predictor
                </h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(148, 163, 184, 0.8)", lineHeight: 1.6 }}>
                  Scans hundreds of flights globally to predict fare drops and secure the best ticket prices.
                </p>
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 6, color: "#60a5fa", fontSize: "0.75rem", fontWeight: 700 }}>
                  <span>View Prediction Engine</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Card 3: 3D Smart Luggage & Terminal */}
            <div
              className="glass-card glass-card-hover group"
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
              }}
            >
              <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                <img
                  src="/assets/suitcase_3d_card.jpg"
                  alt="3D Smart Travel Luggage & Terminal"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(12, 15, 46, 1) 0%, rgba(12, 15, 46, 0.2) 60%, transparent 100%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(236, 72, 153, 0.8)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: 20,
                  }}
                >
                  🧳 BUDGET &amp; PACKING
                </span>
              </div>
              <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
                  Automated Budget Breakdown
                </h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(148, 163, 184, 0.8)", lineHeight: 1.6 }}>
                  Generates day-by-day itemized cost analysis for hotel, transportation, food, and activities.
                </p>
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 6, color: "#f472b6", fontSize: "0.75rem", fontWeight: 700 }}>
                  <span>Calculate Trip Budget</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ── RESULT SECTION ───────────────────────────────── */}
        {result && !loading && (
          <div
            className="glass-card animate-scale-in"
            style={{ borderRadius: 28, padding: "2.5rem", position: "relative", overflow: "hidden" }}
          >
            {/* Top accent */}
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 3,
                background: "linear-gradient(to right, #7c3aed, #4f46e5, #3b82f6, #22d3ee)",
              }}
            />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", flexShrink: 0,
                }}
              >
                <StarSVG />
              </div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: "1.15rem", color: "#f1f5f9", margin: 0 }}>
                  Your Personalized Trip
                </h2>
                <p style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.6)", margin: "2px 0 0" }}>
                  AI-generated itinerary ready to explore
                </p>
              </div>
            </div>

            {/* Info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "Destinasi", value: result.destination, accent: false },
                { label: "Durasi", value: `${result.days} Hari`, accent: false },
                { label: "Total Budget", value: `$${result.budget}`, accent: false },
                { label: "Kategori", value: result.category, accent: true },
              ].map(info => (
                <div key={info.label} className="result-info-card">
                  <p style={{ fontSize: "0.65rem", color: "rgba(148,163,184,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.4rem" }}>
                    {info.label}
                  </p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: info.accent ? "#a78bfa" : "#f1f5f9", margin: 0 }}>
                    {info.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "2rem" }} />

            {/* AI Recommendation */}
            <div className="itinerary-prose">
              <MarkdownItinerary content={result.ai_recommendation} />
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "rgba(148,163,184,0.4)",
          fontSize: "0.78rem",
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}
      >
        © 2026 KelanaAI — AI-Powered Travel Planning. All rights reserved.
      </footer>
    </main>
  );
}