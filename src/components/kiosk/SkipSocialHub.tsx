"use client";

import React, { useState } from "react";
import { Campaign } from "@/lib/types";
import {
  Instagram,
  Youtube,
  Facebook,
  Smartphone,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Gift,
  ExternalLink,
  MessageCircle,
  Share2,
  Check,
  Flame,
  ShieldCheck,
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
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const openLink = (url: string, platform: string) => {
    onSocialClick(platform);
    window.open(url, "_blank");
  };

  const handleCopy = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const channels = [
    {
      id: "instagram-main",
      name: "Instagram Official",
      handle: "@saikeshav.ent",
      desc: "Daily gadget drops, festive sale reels & phone unboxings",
      url: "https://www.instagram.com/saikeshav.ent/",
      ctaText: "Follow on Instagram",
      badge: "Active Drops",
      gradient: "from-amber-400 via-rose-500 to-purple-600",
      btnBg: "bg-gradient-to-r from-pink-600 to-rose-600 text-white",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      id: "whatsapp-channel",
      name: "WhatsApp VIP Channel",
      handle: "New SaiKeshav Enterprises, Baripada",
      desc: "Instant flash sales, new stock arrival alerts & price drops",
      url: "https://whatsapp.com/channel/0029VbDIQjDI7BeF7j3TDx45",
      ctaText: "Join WhatsApp Channel",
      badge: "Exclusive Deals",
      gradient: "from-emerald-400 to-green-600",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
    },
    {
      id: "facebook-profile",
      name: "Facebook Official Page",
      handle: "New SaiKeshav Enterprises",
      desc: "Store events, community stories, reviews and gadget demos",
      url: "https://www.facebook.com/profile.php?id=61592129150557",
      ctaText: "Like & Follow on Facebook",
      badge: "Community Hub",
      gradient: "from-blue-500 to-indigo-700",
      btnBg: "bg-blue-600 hover:bg-blue-700 text-white",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      id: "facebook-share",
      name: "Community Feed & Buzz",
      handle: "Trending on Facebook",
      desc: "Live customer feedback, tech showcases & in-store photos",
      url: "https://www.facebook.com/share/1J1GDYGkxs/?mibextid=wwXIfr",
      ctaText: "View Featured Post",
      badge: "Trending",
      gradient: "from-sky-500 to-blue-600",
      btnBg: "bg-sky-600 hover:bg-sky-700 text-white",
      icon: <Share2 className="w-5 h-5 text-white" />,
    },
    {
      id: "google-reviews",
      name: "Google Customer Reviews",
      handle: "New SaiKeshav Enterprises Ratings",
      desc: "Verified reviews, photos, store directions & customer experiences",
      url: campaign.reviewUrl,
      ctaText: "Read & Rate Us",
      badge: "4.9 ★ Rating",
      gradient: "from-amber-400 to-orange-500",
      btnBg: "bg-amber-500 hover:bg-amber-600 text-white",
      icon: <Star className="w-5 h-5 fill-white text-white" />,
    },
    {
      id: "instagram-qr",
      name: "Digital Phone & Gadget Showcase",
      handle: "Scan & Browse Anytime",
      desc: "Flagship smartphones, earbuds, chargers & smartwatch catalog",
      url: "https://www.instagram.com/saikeshav.ent?stkn=ZnFodWh3N3FnMHVn&utm_source=qr",
      ctaText: "Open Catalog via QR",
      badge: "In-Store Catalog",
      gradient: "from-neutral-800 to-black",
      btnBg: "bg-brand-dark hover:bg-black text-brand-yellow",
      icon: <Smartphone className="w-5 h-5 text-brand-yellow" />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-6">
      <GlassCard elevated className="w-full p-5 sm:p-8 flex flex-col items-center">
        {/* Header Navigation */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={onBackToOffer}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-brand-dark px-3 py-1.5 rounded-full bg-white/80 border border-white hover:bg-white shadow-2xs transition active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Offers</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1 rounded-full bg-brand-yellow/80 text-brand-dark border border-brand-yellow-dark/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-dark" />
            <span>Official Social Hub</span>
          </div>
        </div>

        {/* Title Banner */}
        <div className="text-center mb-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Official Accounts • Roxy Road, Baripada</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Connect with New SaiKeshav Enterprises
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Join our tech community on Instagram, WhatsApp & Facebook for exclusive launch deals, unboxings, and instant support.
          </p>
        </div>

        {/* Social Channels Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className="p-4 rounded-2xl bg-white/90 border border-neutral-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-start gap-3.5 mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${ch.gradient} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                >
                  {ch.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="text-sm font-extrabold text-brand-dark truncate group-hover:text-black">
                      {ch.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                      {ch.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1 truncate">
                    {ch.handle}
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-tight line-clamp-2">
                    {ch.desc}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => openLink(ch.url, ch.name)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 ${ch.btnBg}`}
                >
                  <span>{ch.ctaText}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(ch.url, ch.id)}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold transition active:scale-95 shrink-0"
                  title="Copy link"
                >
                  {copiedLink === ch.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Claim Voucher Promo Footer */}
        <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-yellow/40 via-brand-yellow/60 to-brand-yellow/40 border border-brand-yellow-dark/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-dark text-brand-yellow flex items-center justify-center shrink-0 shadow-md">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-brand-dark uppercase">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Instant In-Store Reward Available</span>
              </div>
              <p className="text-xs text-neutral-800 font-medium mt-0.5">
                Claim your ₹{campaign.rewardAmount} voucher right now to use on smartphones, smartwatches, or premium audio!
              </p>
            </div>
          </div>
          <button
            onClick={onBackToOffer}
            className="shrink-0 py-2.5 px-5 rounded-xl bg-brand-dark hover:bg-black text-brand-yellow font-extrabold text-xs tracking-wide shadow-md transition active:scale-95 flex items-center gap-1.5"
          >
            <span>Claim ₹{campaign.rewardAmount} Voucher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

