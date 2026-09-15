"use client";

import React, { useState } from "react";
import { Campaign, Store } from "@/lib/types";
import {
  ChevronLeft,
  Heart,
  Zap,
  ShieldCheck,
  Gift,
  Smartphone,
  Watch,
  Headphones,
  ArrowRight,
  Store as StoreIcon,
  ChevronDown,
} from "lucide-react";
import { TermsModal } from "./TermsModal";

// Custom dual earbuds SVG matching the mockup's "Audio" icon exactly
const DualEarbudsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Left in-ear bud and stem */}
    <path d="M7 10a2.5 2.5 0 1 1 5 0v7a1.5 1.5 0 0 1-3 0v-4" />
    {/* Right in-ear bud and stem */}
    <path d="M17 10a2.5 2.5 0 1 0-5 0v7a1.5 1.5 0 0 0 3 0v-4" />
  </svg>
);

interface WelcomeScreenProps {
  campaign: Campaign;
  currentStore?: Store | null;
  stores?: Store[];
  onSelectStore?: (store: Store) => void;
  onStartClaim: () => void;
  onSkip: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  campaign,
  currentStore,
  stores = [],
  onSelectStore,
  onStartClaim,
  onSkip,
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showStorePicker, setShowStorePicker] = useState(false);

  const toggleHeart = () => {
    setIsLiked((prev) => !prev);
  };

  return (
    <div className="w-full max-w-[460px] mx-auto flex flex-col justify-between min-h-[94vh] bg-[#FAF8F5] text-neutral-900 px-3.5 sm:px-4 py-3 sm:py-4 rounded-3xl shadow-sm border border-neutral-200/60 relative overflow-hidden select-none">
      {/* Soft warm radial aura */}
      <div className="absolute top-12 right-0 w-72 h-72 rounded-full bg-[#F5E6CC]/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-60 h-60 rounded-full bg-[#EFE8DA]/30 blur-3xl pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="w-full flex items-center justify-between z-10 pt-1 pb-2">
        {/* Left Back / Community Hub Button */}
        <button
          onClick={onSkip}
          aria-label="Community Hub"
          className="w-10 h-10 rounded-full bg-white/95 border border-neutral-200/80 shadow-xs flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:scale-95 transition"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center Brand Identity with Official Logo */}
        <div
          className="flex flex-col items-center text-center cursor-pointer max-w-[210px] sm:max-w-[250px]"
          onClick={() => stores.length > 1 && setShowStorePicker(true)}
        >
          <img
            src="/brand_logo.png"
            alt="New SaiKeshav Enterprises - Roxy Road, Baripada"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs"
          />
        </div>

        {/* Right Favorite / Heart Button */}
        <button
          onClick={toggleHeart}
          aria-label="Save to Favorite"
          className="w-10 h-10 rounded-full bg-white/95 border border-neutral-200/80 shadow-xs flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:scale-95 transition"
        >
          <Heart
            className={`w-5 h-5 transition-transform duration-200 ${
              isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-neutral-800 stroke-[1.8]"
            }`}
          />
        </button>
      </header>

      {/* STORE SELECTION DROPDOWN MODAL (if tapped) */}
      {showStorePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-neutral-900 text-base mb-1">Select Store Location</h3>
            <p className="text-xs text-neutral-500 mb-4">Choose your nearest New SaiKeshav Enterprises store:</p>
            <div className="space-y-2">
              {stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (onSelectStore) onSelectStore(s);
                    setShowStorePicker(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                    currentStore?.id === s.id
                      ? "bg-amber-50 border-amber-400 text-amber-950 font-black"
                      : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span>{s.name}</span>
                  {currentStore?.id === s.id && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full">Active</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStorePicker(false)}
              className="mt-4 w-full py-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION: INSTANT ₹500 OFFER + GADGETS SHOWCASE */}
      <div className="relative mt-1 sm:mt-2 grid grid-cols-12 items-center gap-1 z-10">
        {/* Left Text & Badges Column (7 cols) */}
        <div className="col-span-7 pr-1">
          {/* Tag: INSTANT */}
          <div className="text-[10px] sm:text-[11px] font-black tracking-[0.26em] text-neutral-500 uppercase mb-0.5">
            I N S T A N T
          </div>

          {/* Value Heading: ₹500 OFF */}
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-[#B37B24] via-[#DE9F35] to-[#996515] bg-clip-text text-transparent drop-shadow-xs">
              ₹{campaign.rewardAmount}
            </span>
            <span className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight ml-0.5">
              OFF
            </span>
          </div>

          {/* Subheading: ON YOUR NEXT GADGET */}
          <div className="text-[9.5px] sm:text-[11px] font-black tracking-[0.16em] text-neutral-900 uppercase mt-0.5 leading-tight">
            ON YOUR NEXT GADGET
          </div>

          {/* Paragraph */}
          <p className="text-[10px] sm:text-[11px] text-neutral-600 font-normal leading-relaxed mt-2 max-w-[210px]">
            Complete 2 quick steps and unlock an instant ₹{campaign.rewardAmount} voucher on Smartphones, Audio, Smartwatches &amp; Premium Accessories.
          </p>

          {/* 3 Benefit Badges Row */}
          <div className="flex items-center gap-2 mt-3 pt-0.5">
            {/* 1. Quick & Easy */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center text-neutral-800 shadow-2xs mb-1">
                <Zap className="w-3.5 h-3.5 fill-neutral-800 text-neutral-800" />
              </div>
              <span className="text-[9px] font-bold text-neutral-800 leading-tight">
                Quick<br />&amp; Easy
              </span>
            </div>

            <div className="w-px h-6 bg-neutral-200 self-center" />

            {/* 2. 100% Genuine */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center text-neutral-800 shadow-2xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-800 stroke-[2.2]" />
              </div>
              <span className="text-[9px] font-bold text-neutral-800 leading-tight">
                100%<br />Genuine
              </span>
            </div>

            <div className="w-px h-6 bg-neutral-200 self-center" />

            {/* 3. More Value */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center text-neutral-800 shadow-2xs mb-1">
                <Gift className="w-3.5 h-3.5 text-neutral-800 stroke-[2.2]" />
              </div>
              <span className="text-[9px] font-bold text-neutral-800 leading-tight">
                More<br />Value
              </span>
            </div>
          </div>
        </div>

        {/* Right Gadgets Pedestal Column (5 cols) with Living Floating Loop */}
        <div className="col-span-5 relative flex items-center justify-end">
          <div className="absolute inset-0 m-auto w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-amber-300/35 blur-2xl animate-pulse-glow pointer-events-none" />
          <img
            src="/gadgets_showcase_perfect.png"
            alt="Gold iPhone, White AirPods and Gold Smartwatch on Luxury Pedestal"
            className="w-full max-h-[230px] sm:max-h-[270px] object-contain drop-shadow-md select-none pointer-events-none scale-105 sm:scale-100 animate-float-gentle"
          />
        </div>
      </div>

      {/* 4 CATEGORY CARDS (Unified rounded card container) */}
      <div className="w-full bg-white/95 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-xs border border-neutral-200/60 grid grid-cols-4 gap-1.5 sm:gap-2 mt-3 sm:mt-4 z-10">
        {/* Smartphones */}
        <div className="group flex flex-col items-center justify-center p-1 rounded-xl hover:bg-neutral-50 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F4F4F5] group-hover:bg-amber-50/70 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center text-neutral-800 shadow-2xs">
            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] group-hover:text-amber-700 transition-colors" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-neutral-800 text-center mt-1.5 group-hover:text-amber-900 transition-colors">
            Smartphones
          </span>
        </div>

        {/* Audio */}
        <div className="group flex flex-col items-center justify-center p-1 rounded-xl hover:bg-neutral-50 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F4F4F5] group-hover:bg-amber-50/70 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center text-neutral-800 shadow-2xs">
            <DualEarbudsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800 group-hover:text-amber-700 transition-colors" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-neutral-800 text-center mt-1.5 group-hover:text-amber-900 transition-colors">
            Audio
          </span>
        </div>

        {/* Smartwatches */}
        <div className="group flex flex-col items-center justify-center p-1 rounded-xl hover:bg-neutral-50 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F4F4F5] group-hover:bg-amber-50/70 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center text-neutral-800 shadow-2xs">
            <Watch className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] group-hover:text-amber-700 transition-colors" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-neutral-800 text-center mt-1.5 group-hover:text-amber-900 transition-colors">
            Smartwatches
          </span>
        </div>

        {/* Accessories */}
        <div className="group flex flex-col items-center justify-center p-1 rounded-xl hover:bg-neutral-50 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F4F4F5] group-hover:bg-amber-50/70 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center text-neutral-800 shadow-2xs">
            <Headphones className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] group-hover:text-amber-700 transition-colors" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-neutral-800 text-center mt-1.5 group-hover:text-amber-900 transition-colors">
            Accessories
          </span>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="w-full mt-3 sm:mt-4 z-10">
        <div className="text-[9.5px] sm:text-[11px] font-bold tracking-[0.22em] text-neutral-400 uppercase text-center mb-2">
          H O W &nbsp; I T &nbsp; W O R K S
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-sm mx-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E5BA6C] text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
              1
            </div>
            <div className="text-left leading-tight">
              <div className="text-[9.5px] sm:text-[10px] text-neutral-500 font-medium">Complete</div>
              <div className="text-[11px] sm:text-xs font-extrabold text-neutral-900">2 Simple Steps</div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-neutral-200 mx-1 sm:mx-2" />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E5BA6C] text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
              2
            </div>
            <div className="text-left leading-tight">
              <div className="text-[11px] sm:text-xs font-extrabold text-neutral-900">Get ₹{campaign.rewardAmount} Voucher</div>
              <div className="text-[9.5px] sm:text-[10px] text-neutral-500 font-medium">Instantly</div>
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY CTA BUTTON: Claim My ₹500 */}
      <div className="w-full mt-3 sm:mt-4 z-10">
        <button
          onClick={onStartClaim}
          className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-[#C28E3A] via-[#B88230] to-[#996515] hover:brightness-105 active:scale-[0.98] text-white font-extrabold text-base sm:text-lg shadow-lg shadow-amber-950/20 flex items-center justify-center relative transition-all group shine-effect animate-subtle-pulse"
        >
          <span>Claim My ₹{campaign.rewardAmount}</span>
          <ArrowRight className="w-5 h-5 absolute right-6 text-white stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* BOTTOM TRUST BAR */}
      <footer className="w-full border-t border-neutral-200/80 pt-2.5 sm:pt-3 mt-3 sm:mt-4 flex flex-col items-center gap-1.5 z-10">
        <div className="w-full flex items-center justify-around text-neutral-700">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold">
            <StoreIcon className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
            <span>Trusted Store</span>
          </div>

          <div className="w-px h-3 bg-neutral-200" />

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
            <span>Latest Gadgets</span>
          </div>

          <div className="w-px h-3 bg-neutral-200" />

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold">
            <Heart className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
            <span>Better Everyday</span>
          </div>
        </div>

        {/* Terms Link */}
        <button
          onClick={() => setShowTerms(true)}
          className="text-[10px] text-neutral-400 hover:text-neutral-700 underline decoration-neutral-300 underline-offset-2 transition"
        >
          Terms &amp; Conditions (Min Purchase ₹{campaign.minOrderValue})
        </button>
      </footer>

      {/* TERMS & CONDITIONS MODAL */}
      <TermsModal
        campaign={campaign}
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </div>
  );
};
