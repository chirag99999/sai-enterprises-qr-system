"use client";

import React, { useState } from "react";
import { Campaign } from "@/lib/types";
import {
  QrCode,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
  Star,
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
  const [hasVisitedInstagram, setHasVisitedInstagram] = useState<boolean>(false);
  const [hasVisitedWhatsApp, setHasVisitedWhatsApp] = useState<boolean>(false);
  const [hasOpenedReview, setHasOpenedReview] = useState<boolean>(false);

  // QR Modal for kiosk tablets
  const [qrModalPlatform, setQrModalPlatform] = useState<
    "Instagram" | "WhatsApp" | "Google" | null
  >(null);

  const instagramUrl =
    campaign.socialLinks.instagram || "https://www.instagram.com/saikeshav.ent/";
  const whatsappUrl =
    campaign.socialLinks.whatsapp ||
    "https://whatsapp.com/channel/0029VbDIQjDI7BeF7j3TDx45";
  const reviewUrl =
    campaign.reviewUrl ||
    "https://www.google.com/search?q=SAI+KESHAV+ENTERPRISES-Mobiles&kgmid=/g/11j9m4wt35";

  const handleOpenInstagram = () => {
    setHasVisitedInstagram(true);
    onSocialClick("Instagram");
    window.open(instagramUrl, "_blank");
  };

  const handleOpenWhatsApp = () => {
    setHasVisitedWhatsApp(true);
    onSocialClick("WhatsApp");
    window.open(whatsappUrl, "_blank");
  };

  const handleOpenReview = () => {
    setHasOpenedReview(true);
    onOpenReview();
    window.open(reviewUrl, "_blank");
  };

  const completedCount =
    (hasVisitedInstagram ? 1 : 0) + (hasVisitedWhatsApp ? 1 : 0);
  const isMandatoryCompleted = hasVisitedInstagram && hasVisitedWhatsApp;

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-xl w-full mx-auto px-3 sm:px-4 py-2 sm:py-4">
      <GlassCard
        elevated
        className="w-full p-4 sm:p-7 flex flex-col items-center relative overflow-hidden"
      >
        {/* Navigation & Step */}
        <div className="w-full flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-brand-dark px-3 py-1.5 rounded-full bg-white/80 border border-neutral-200 hover:bg-white transition active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Phone</span>
          </button>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span>Step 2 of 2: Verification</span>
          </div>
        </div>

        {/* Reserved Voucher Banner */}
        <div className="w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-300/80 flex items-center gap-3 mb-4 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shrink-0 shadow-sm font-black text-lg">
            ₹
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                ₹{campaign.rewardAmount} Voucher Reserved
              </span>
              <span className="text-[11px] text-neutral-500 font-bold">
                +91 {phone.slice(0, 5)} {phone.slice(5)}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-neutral-900 mt-0.5 leading-snug">
              Complete the 2 required channels below to activate your voucher!
            </p>
          </div>
        </div>

        {/* Mandatory Requirement Header & Progress */}
        <div className="w-full mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Mandatory Actions ({completedCount}/2 Completed)</span>
            </span>
            <span
              className={`text-xs font-black ${
                isMandatoryCompleted ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {isMandatoryCompleted ? "✓ Ready to Unlock!" : `${completedCount} of 2 Done`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isMandatoryCompleted
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 w-full"
                  : completedCount === 1
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 w-1/2"
                  : "w-0"
              }`}
            />
          </div>
        </div>

        {/* 2 MANDATORY REDIRECT CARDS */}
        <div className="w-full space-y-3 mb-4">
          {/* 1. INSTAGRAM MANDATORY REDIRECT */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
              hasVisitedInstagram
                ? "bg-emerald-50/70 border-emerald-400/80 shadow-xs"
                : "bg-white border-neutral-200/90 shadow-sm hover:border-pink-300"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-neutral-900 leading-tight">
                      Step 1: Follow on Instagram
                    </h4>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-pink-100 text-pink-700">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-medium truncate">
                    @saikeshav.ent • Tech deals &amp; launches
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleOpenInstagram}
                  className={`px-3 sm:px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                    hasVisitedInstagram
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white"
                  }`}
                >
                  {hasVisitedInstagram ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Visited ✓</span>
                    </>
                  ) : (
                    <>
                      <span>Open Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setQrModalPlatform("Instagram")}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
                  title="Scan QR"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. WHATSAPP COMMUNITY MANDATORY REDIRECT */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
              hasVisitedWhatsApp
                ? "bg-emerald-50/70 border-emerald-400/80 shadow-xs"
                : "bg-white border-neutral-200/90 shadow-sm hover:border-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-neutral-900 leading-tight">
                      Step 2: Join WhatsApp VIP
                    </h4>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-medium truncate">
                    Instant alerts, flash sales &amp; VIP support
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleOpenWhatsApp}
                  className={`px-3 sm:px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                    hasVisitedWhatsApp
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {hasVisitedWhatsApp ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Joined ✓</span>
                    </>
                  ) : (
                    <>
                      <span>Join Channel</span>
                      <ExternalLink className="w-3 h-3" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setQrModalPlatform("WhatsApp")}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
                  title="Scan QR"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BONUS: GOOGLE REVIEW (Optional) */}
        <div className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-800">
                  Rate New SaiKeshav on Google
                </span>
                <span className="text-[9px] font-bold text-neutral-500 bg-neutral-200/60 px-1.5 py-0.2 rounded">
                  Optional Bonus
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 truncate">
                Leave a 5★ review to help our local store grow
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenReview}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-100 text-[11px] font-bold text-neutral-700 flex items-center gap-1 shrink-0"
          >
            <span>{hasOpenedReview ? "Reviewed ✓" : "Review"}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* PRIMARY UNLOCK BUTTON */}
        <div className="w-full max-w-md">
          <button
            onClick={onConfirmCompleted}
            disabled={!isMandatoryCompleted || loading}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-[0.98] ${
              isMandatoryCompleted
                ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-amber-600/30 cursor-pointer animate-pulse"
                : "bg-neutral-200 text-neutral-500 cursor-not-allowed border border-neutral-300"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Official Voucher...</span>
              </span>
            ) : isMandatoryCompleted ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>UNLOCK MY ₹{campaign.rewardAmount} VOUCHER NOW</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-neutral-400" />
                <span>
                  Complete Both Steps to Unlock ₹{campaign.rewardAmount} ({completedCount}/2)
                </span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-neutral-500 mt-2 font-medium">
            {isMandatoryCompleted ? (
              <span className="text-emerald-700 font-bold">
                ✓ All mandatory steps verified! Tap above to generate your instant checkout voucher.
              </span>
            ) : (
              <span>
                * Redirecting to both Instagram &amp; WhatsApp community is required to activate your ₹{campaign.rewardAmount} voucher.
              </span>
            )}
          </p>
        </div>
      </GlassCard>

      {/* QR MODAL (For store tablet kiosk users) */}
      {qrModalPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-neutral-200 text-center flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-2 shadow-sm ${
                qrModalPlatform === "Instagram"
                  ? "bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600"
                  : qrModalPlatform === "WhatsApp"
                  ? "bg-emerald-600"
                  : "bg-amber-500"
              }`}
            >
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="font-black text-base text-neutral-900">
              Scan for {qrModalPlatform}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5 mb-3">
              Scan with your mobile camera to open {qrModalPlatform} directly on your phone.
            </p>

            <div className="p-3 bg-white rounded-2xl border-2 border-neutral-100 shadow-inner mb-4">
              <QRCodeSVG
                value={
                  qrModalPlatform === "Instagram"
                    ? instagramUrl
                    : qrModalPlatform === "WhatsApp"
                    ? whatsappUrl
                    : reviewUrl
                }
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <button
              onClick={() => {
                if (qrModalPlatform === "Instagram") setHasVisitedInstagram(true);
                if (qrModalPlatform === "WhatsApp") setHasVisitedWhatsApp(true);
                setQrModalPlatform(null);
              }}
              className="w-full py-3 rounded-xl bg-neutral-900 text-white font-extrabold text-xs tracking-wide hover:bg-black transition active:scale-95"
            >
              I Have Scanned &amp; Opened
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
