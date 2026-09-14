"use client";

import React, { useState } from "react";
import { Campaign } from "@/lib/types";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Smartphone,
  Headphones,
  Watch,
  Zap,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { TermsModal } from "./TermsModal";
import { GadgetAnimation } from "./GadgetAnimation";

interface WelcomeScreenProps {
  campaign: Campaign;
  onStartClaim: () => void;
  onSkip: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  campaign,
  onStartClaim,
  onSkip,
}) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/90 border border-brand-yellow-dark/40 shadow-sm text-brand-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-3">
        <Sparkles className="w-3 h-3 text-brand-dark shrink-0" />
        <span className="truncate">Sai Enterprises • Phones & Gadgets In-Store Privilege</span>
      </div>

      {/* Main Glass Hero Card */}
      <GlassCard
        elevated
        className="w-full p-4 sm:p-8 md:p-10 text-center flex flex-col items-center relative overflow-hidden"
      >
        {/* Soft background ambient glow */}
        <div className="absolute -top-20 -right-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-brand-yellow/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none" />

        {/* Big Reward Visual Display */}
        <div className="relative mb-1">
          <div className="inline-flex items-baseline gap-0.5 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-brand-dark drop-shadow-sm">
            <span className="text-2xl sm:text-4xl text-brand-blue-dark">₹</span>
            <span>{campaign.rewardAmount}</span>
            <span className="text-lg sm:text-2xl text-neutral-500 font-extrabold ml-1">
              OFF
            </span>
          </div>
          <div className="inline-block sm:absolute sm:-top-2 sm:-right-8 px-2.5 py-0.5 rounded-full bg-brand-dark text-brand-yellow font-black text-[9px] sm:text-xs uppercase tracking-widest shadow-md transform sm:rotate-6 mt-0.5 sm:mt-0">
            Instant Gadget Voucher
          </div>
        </div>

        {/* Headline & Subhead */}
        <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight max-w-xl px-1">
          {campaign.headline}
        </h1>
        <p className="mt-1 text-xs sm:text-sm md:text-base text-neutral-600 max-w-lg font-medium leading-relaxed px-1">
          {campaign.subheadline}
        </p>

        {/* ANIMATED PHONES & GADGETS SHOWCASE */}
        <div className="w-full my-1 sm:my-2">
          <GadgetAnimation />
        </div>

        {/* Gadget Category Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 my-2 sm:my-3 text-[10px] sm:text-xs font-bold text-neutral-700">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 border border-neutral-200 shadow-xs">
            <Smartphone className="w-3 h-3 text-brand-blue-dark" />
            <span>5G Phones</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 border border-neutral-200 shadow-xs">
            <Headphones className="w-3 h-3 text-pink-600" />
            <span>Audio</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 border border-neutral-200 shadow-xs">
            <Watch className="w-3 h-3 text-brand-dark" />
            <span>Wearables</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 border border-neutral-200 shadow-xs">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Chargers</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-2 pt-1.5">
          {/* Primary CTA */}
          <button
            onClick={onStartClaim}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-brand-dark hover:bg-black text-brand-yellow hover:text-white font-extrabold text-base sm:text-lg tracking-wide shadow-xl flex items-center justify-center gap-2 sm:gap-3 transition-all transform active:scale-[0.98] border border-brand-yellow/40"
          >
            <span>CLAIM MY ₹{campaign.rewardAmount} VOUCHER</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Secondary Action: Skip */}
          <button
            onClick={onSkip}
            className="w-full py-2 px-4 rounded-2xl bg-transparent hover:bg-white/60 text-neutral-600 hover:text-brand-dark font-bold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-1"
          >
            <span>Skip to Community Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terms Link */}
        <button
          onClick={() => setShowTerms(true)}
          className="mt-2.5 sm:mt-3 inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-neutral-500 hover:text-neutral-800 underline decoration-neutral-300 underline-offset-4 transition"
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Terms & Conditions (Min Purchase ₹{campaign.minOrderValue})</span>
        </button>
      </GlassCard>

      <TermsModal
        campaign={campaign}
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </div>
  );
};
