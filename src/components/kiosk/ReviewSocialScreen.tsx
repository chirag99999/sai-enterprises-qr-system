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

        {/* Optional Social Channels */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Explore Channels (Optional)
            </span>
            <span className="text-[10px] sm:text-[11px] text-neutral-400">Bonus</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleSocialLink(campaign.socialLinks.instagram, "Instagram")}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/70 hover:bg-white border border-white flex flex-col items-center justify-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
              <span className="text-[10px] sm:text-xs font-bold text-neutral-700">Instagram</span>
            </button>

            <button
              onClick={() => handleSocialLink(campaign.socialLinks.youtube, "YouTube")}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/70 hover:bg-white border border-white flex flex-col items-center justify-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <Youtube className="w-4 h-4 text-red-600" />
              <span className="text-[10px] sm:text-xs font-bold text-neutral-700">YouTube</span>
            </button>

            <button
              onClick={() => handleSocialLink(campaign.socialLinks.facebook, "Facebook")}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/70 hover:bg-white border border-white flex flex-col items-center justify-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] sm:text-xs font-bold text-neutral-700">Facebook</span>
            </button>

            <button
              onClick={() => handleSocialLink(campaign.socialLinks.menuUrl, "Catalogue")}
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/70 hover:bg-white border border-white flex flex-col items-center justify-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <Smartphone className="w-4 h-4 text-brand-blue-dark" />
              <span className="text-[10px] sm:text-xs font-bold text-neutral-700">Catalogue</span>
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
