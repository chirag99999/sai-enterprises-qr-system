"use client";

import React from "react";
import { Campaign } from "@/lib/types";
import {
  Instagram,
  Youtube,
  Facebook,
  Smartphone,
  Headphones,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Gift,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface SkipSocialHubProps {
  campaign: Campaign;
  onBackToOffer: () => void;
  onSocialClick: (platform: string) => void;
}

export const SkipSocialHub: React.FC<SkipSocialHubProps> = ({
  campaign,
  onBackToOffer,
  onSocialClick,
}) => {
  const openLink = (url: string, platform: string) => {
    onSocialClick(platform);
    window.open(url, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto px-4 py-4">
      <GlassCard elevated className="w-full p-6 sm:p-8 flex flex-col items-center">
        {/* Header Back Link */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={onBackToOffer}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-brand-dark px-3 py-1.5 rounded-full bg-white/70 border border-white hover:bg-white transition active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Offers</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-neutral-200/80 text-neutral-700">
            <span>Sai Enterprises Tech Hub</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
            Connect with Sai Enterprises
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium max-w-md mx-auto">
            Discover latest 5G phone launches, unboxings, gadget comparisons, and warranty support.
          </p>
        </div>

        {/* Brand Channels Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Instagram */}
          <button
            onClick={() => openLink(campaign.socialLinks.instagram, "Instagram")}
            className="p-4 rounded-2xl bg-white/80 hover:bg-white border border-white/90 shadow-sm flex items-center gap-3.5 text-left transition group active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Instagram className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-brand-dark flex items-center gap-1">
                <span>Instagram Tech Drops</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-500 truncate">
                @saienterprises_gadgets
              </p>
            </div>
          </button>

          {/* YouTube */}
          <button
            onClick={() => openLink(campaign.socialLinks.youtube, "YouTube")}
            className="p-4 rounded-2xl bg-white/80 hover:bg-white border border-white/90 shadow-sm flex items-center gap-3.5 text-left transition group active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Youtube className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-brand-dark flex items-center gap-1">
                <span>Gadget Unboxings</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-500 truncate">
                Hands-on phone reviews & specs
              </p>
            </div>
          </button>

          {/* Google Review */}
          <button
            onClick={() => openLink(campaign.reviewUrl, "Google Review")}
            className="p-4 rounded-2xl bg-white/80 hover:bg-white border border-white/90 shadow-sm flex items-center gap-3.5 text-left transition group active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-400 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-brand-dark flex items-center gap-1">
                <span>Customer Google Reviews</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-500 truncate">
                See ratings from in-store shoppers
              </p>
            </div>
          </button>

          {/* Gadget Catalogue */}
          <button
            onClick={() => openLink(campaign.socialLinks.menuUrl, "Catalogue")}
            className="p-4 rounded-2xl bg-white/80 hover:bg-white border border-white/90 shadow-sm flex items-center gap-3.5 text-left transition group active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-dark flex items-center justify-center text-brand-yellow shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-brand-dark flex items-center gap-1">
                <span>Digital Phone Catalogue</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-500 truncate">
                Smartphones, audio, chargers & wear
              </p>
            </div>
          </button>
        </div>

        {/* Return to Reward Offer Callout */}
        <div className="w-full p-4 rounded-2xl bg-brand-yellow/35 border border-brand-yellow-dark/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-brand-dark uppercase">
              <Gift className="w-4 h-4 text-brand-dark" />
              <span>Did you know?</span>
            </div>
            <p className="text-xs text-neutral-700 font-medium mt-0.5">
              You can get ₹{campaign.rewardAmount} off your phone or gadget bill right now by leaving a quick verified review!
            </p>
          </div>
          <button
            onClick={onBackToOffer}
            className="shrink-0 py-2.5 px-5 rounded-xl bg-brand-dark hover:bg-black text-brand-yellow font-extrabold text-xs tracking-wide shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <span>Claim ₹{campaign.rewardAmount} Voucher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
