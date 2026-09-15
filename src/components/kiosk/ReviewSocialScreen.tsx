"use client";

import React, { useState } from "react";
import { Campaign } from "@/lib/types";
import {
  Star,
  QrCode,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Instagram,
  Youtube,
  Facebook,
  Smartphone,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { QRCodeSVG } from "qrcode.react";

interface ReviewSocialScreenProps {
  campaign: Campaign;
  phone: string;
  onOpenReview: () => void;
  onSocialClick: (platform: string) => void;
  onConfirmCompleted: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
}

export const ReviewSocialScreen: React.FC<ReviewSocialScreenProps> = ({
  campaign,
  phone,
  onOpenReview,
  onSocialClick,
  onConfirmCompleted,
  onBack,
  loading,
}) => {
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [hasOpenedReview, setHasOpenedReview] = useState<boolean>(false);

  const handleOpenReviewLink = () => {
    setHasOpenedReview(true);
    onOpenReview();
    window.open(campaign.reviewUrl, "_blank");
  };

  const handleSocialLink = (url: string, platform: string) => {
    onSocialClick(platform);
    window.open(url, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
      <GlassCard elevated className="w-full p-4 sm:p-8 flex flex-col items-center">
        {/* Navigation & Step */}
        <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-brand-dark px-2.5 py-1 rounded-full bg-white/70 border border-white hover:bg-white transition active:scale-95"
          >
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Change Phone</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-yellow/70 text-brand-dark">
            <span>Step 2 of 2</span>
          </div>
        </div>

        {/* Voucher Reserved Banner */}
        <div className="w-full p-3 sm:p-4 rounded-2xl bg-brand-surface border border-neutral-200/90 flex items-center gap-2.5 sm:gap-3.5 mb-3 sm:mb-4 shadow-xs">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-dark text-brand-yellow flex items-center justify-center shrink-0 shadow-sm font-black text-base sm:text-lg">
            ₹
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                Reserved
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                For +91 {phone.slice(0, 5)} {phone.slice(5)}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-brand-dark mt-0.5 leading-snug">
              ₹{campaign.rewardAmount} voucher reserved! Complete review below to unlock.
            </p>
          </div>
        </div>

        {/* Primary Action: Review Destination */}
        <div className="w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 border-brand-blue/30 shadow-md mb-3 sm:mb-4 text-center">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] sm:text-xs font-bold mb-1.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>Required Step</span>
          </div>
          <h3 className="text-base sm:text-xl font-extrabold text-brand-dark">
            Rate Sai Enterprises on Google
          </h3>
          <p className="text-[11px] sm:text-xs text-neutral-500 max-w-md mx-auto mt-0.5 mb-3">
            Share quick feedback on Google to activate your ₹{campaign.rewardAmount} coupon.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-md mx-auto">
            {/* Open Google Review Direct (best for phone users) */}
            <button
              onClick={handleOpenReviewLink}
              className="py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl bg-brand-dark hover:bg-black text-white font-extrabold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Open Google Review</span>
            </button>

            {/* Scan QR (best for store tablet kiosk) */}
            <button
              onClick={() => {
                setShowQrModal(true);
                setHasOpenedReview(true);
                onOpenReview();
              }}
              className="py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl bg-brand-blue/15 hover:bg-brand-blue/25 text-brand-dark font-extrabold text-xs tracking-wide flex items-center justify-center gap-1.5 border border-brand-blue/40 transition active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-brand-blue-dark" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>

        {/* Official Brand Channels */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Follow Sai Keshav Enterprises
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Official Links
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Instagram */}
            <button
              onClick={() => handleSocialLink(campaign.socialLinks.instagram, "Instagram")}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-800">Instagram</span>
            </button>

            {/* WhatsApp VIP Channel */}
            <button
              onClick={() =>
                handleSocialLink(
                  campaign.socialLinks.whatsapp || "https://whatsapp.com/channel/0029VbDIQjDI7BeF7j3TDx45",
                  "WhatsApp"
                )
              }
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-800">WhatsApp</span>
            </button>

            {/* Facebook Official */}
            <button
              onClick={() => handleSocialLink(campaign.socialLinks.facebook, "Facebook")}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-800">Facebook</span>
            </button>

            {/* Digital Phone Catalogue */}
            <button
              onClick={() => handleSocialLink(campaign.socialLinks.menuUrl, "Catalogue")}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/80 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-brand-yellow shrink-0 group-hover:scale-110 transition-transform">
                <Smartphone className="w-4 h-4 text-brand-yellow" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-800">Catalog</span>
            </button>
          </div>
        </div>

        {/* Primary Completion Button */}
        <div className="w-full max-w-md">
          <button
            onClick={onConfirmCompleted}
            disabled={loading}
            className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-brand-dark hover:bg-black text-brand-yellow font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-[0.98] border border-brand-yellow/30"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                <span>Unlocking Voucher...</span>
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow shrink-0" />
                <span className="truncate">I&apos;VE POSTED REVIEW — UNLOCK ₹{campaign.rewardAmount}</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-neutral-400 mt-1.5">
            Instant barcode generated for checkout at Sai Enterprises.
          </p>
        </div>
      </GlassCard>

      {/* Phone QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <GlassCard
            elevated
            className="max-w-xs sm:max-w-sm w-full p-5 sm:p-6 bg-white flex flex-col items-center text-center shadow-2xl border border-white"
          >
            <div className="w-9 h-9 rounded-2xl bg-brand-blue/20 text-brand-blue-dark flex items-center justify-center mb-2.5">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-brand-dark">
              Scan with Phone Camera
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5 mb-3">
              Review Sai Enterprises directly from your personal Google account.
            </p>

            <div className="p-3 bg-white rounded-xl border-2 border-neutral-100 shadow-inner mb-3">
              <QRCodeSVG
                value={campaign.reviewUrl}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-brand-dark text-white font-bold text-xs tracking-wide transition active:scale-95"
            >
              Done Scanning
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
