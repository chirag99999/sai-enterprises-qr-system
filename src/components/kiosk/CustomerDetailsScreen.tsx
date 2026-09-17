"use client";

import React, { useState } from "react";
import { Campaign, isFreeGiftOffer, getRewardTitle } from "@/lib/types";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Gift,
  Cake,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface CustomerDetailsScreenProps {
  campaign: Campaign;
  phone: string;
  initialName?: string;
  initialDob?: string;
  onSubmitProfile: (name: string, dob: string) => Promise<{ success: boolean; error?: string }>;
  onSkipProfile: () => void;
  onBack: () => void;
  loading?: boolean;
}

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const CustomerDetailsScreen: React.FC<CustomerDetailsScreenProps> = ({
  campaign,
  phone,
  initialName = "",
  initialDob = "",
  onSubmitProfile,
  onSkipProfile,
  onBack,
  loading = false,
}) => {
  const isFreeGift = isFreeGiftOffer(campaign);
  const rewardTitle = getRewardTitle(campaign);

  // Parse initial DOB if exists (format DD-MM-YYYY or YYYY-MM-DD)
  const parseInitialDob = () => {
    if (!initialDob) return { day: "", month: "", year: "" };
    const parts = initialDob.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return { year: parts[0], month: parts[1], day: parts[2] };
      }
      return { day: parts[0], month: parts[1], year: parts[2] };
    }
    return { day: "", month: "", year: "" };
  };

  const parsed = parseInitialDob();
  const [name, setName] = useState<string>(initialName);
  const [day, setDay] = useState<string>(parsed.day);
  const [month, setMonth] = useState<string>(parsed.month);
  const [year, setYear] = useState<string>(parsed.year);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Generate days 1-31
  const days = Array.from({ length: 31 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, "0");
    return num;
  });

  // Generate years (from current year - 10 down to 1940)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => (currentYear - 10 - i).toString());

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name to personalize your gift voucher");
      return;
    }

    // Build DOB string if selected
    let dobString = "";
    if (day && month && year) {
      dobString = `${day}-${month}-${year}`;
    } else if (day || month || year) {
      setError("Please complete Day, Month, and Year for Date of Birth");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await onSubmitProfile(name.trim(), dobString);
      setSubmitting(false);
      if (!res.success) {
        setError(res.error || "Failed to save profile");
      }
    } catch (err: any) {
      setSubmitting(false);
      setError(err.message || "Failed to save profile");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
      <GlassCard elevated className="w-full p-4 sm:p-7 flex flex-col items-center relative overflow-hidden">
        {/* Ambient background aura glows */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-amber-400/20 blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Top Bar Navigation */}
        <div className="w-full flex items-center justify-between mb-3 z-10">
          <button
            onClick={onBack}
            disabled={submitting || loading}
            className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-brand-dark px-3 py-1 rounded-full bg-white/70 border border-neutral-200 hover:bg-white transition active:scale-95 shadow-2xs tap-feedback"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span>Step 2 of 3: Your Profile</span>
          </div>
        </div>

        {/* Header Icon & Title */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-amber-500/25 animate-float-gentle">
          <Gift className="w-7 h-7" />
        </div>

        <div className="text-center mb-4 sm:mb-5 z-10">
          <h2 className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
            Tell Us About Yourself 🎁
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium max-w-sm mx-auto">
            Personalize your reward voucher for mobile <span className="font-bold text-neutral-800">+91 {phone.slice(0, 5)} {phone.slice(5)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 z-10">
          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-black text-neutral-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Full Name <span className="text-red-500">*</span></span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your full name"
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-neutral-300 focus:border-[#DE9F35] focus:ring-2 focus:ring-amber-400/20 text-neutral-900 font-bold text-sm sm:text-base transition-all placeholder:text-neutral-300 outline-hidden shadow-xs"
              />
            </div>
          </div>

          {/* Date of Birth Picker (Day / Month / Year Dropdowns for Tablet Kiosk) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Cake className="w-3.5 h-3.5 text-pink-500" />
                <span>Date of Birth</span>
              </label>
              <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Birthday Gifts 🎂</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Day */}
              <div className="relative">
                <select
                  value={day}
                  onChange={(e) => {
                    setDay(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3 py-3 rounded-xl bg-white border-2 border-neutral-300 focus:border-[#DE9F35] text-neutral-800 font-bold text-xs sm:text-sm appearance-none cursor-pointer outline-hidden shadow-2xs"
                >
                  <option value="">Day</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                  <span className="text-[10px]">▼</span>
                </div>
              </div>

              {/* Month */}
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-2.5 py-3 rounded-xl bg-white border-2 border-neutral-300 focus:border-[#DE9F35] text-neutral-800 font-bold text-xs sm:text-sm appearance-none cursor-pointer outline-hidden shadow-2xs"
                >
                  <option value="">Month</option>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label.slice(0, 3)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                  <span className="text-[10px]">▼</span>
                </div>
              </div>

              {/* Year */}
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-2.5 py-3 rounded-xl bg-white border-2 border-neutral-300 focus:border-[#DE9F35] text-neutral-800 font-bold text-xs sm:text-sm appearance-none cursor-pointer outline-hidden shadow-2xs"
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                  <span className="text-[10px]">▼</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 mt-1.5 flex items-center gap-1 leading-tight">
              <span>🎁</span>
              <span>We send exclusive surprise gift vouchers to you on your birthday!</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={submitting || loading || !name.trim()}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] tap-feedback ${
                name.trim() && !submitting && !loading
                  ? "bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 text-amber-400 cursor-pointer shine-effect animate-subtle-pulse shadow-amber-950/20"
                  : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              }`}
            >
              {submitting || loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Details...</span>
                </span>
              ) : (
                <>
                  <span>CONTINUE TO VERIFY &amp; CLAIM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Subtle Skip Button */}
            <button
              type="button"
              onClick={onSkipProfile}
              disabled={submitting || loading}
              className="w-full py-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition active:scale-95 tap-feedback"
            >
              Skip for now &amp; continue →
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
