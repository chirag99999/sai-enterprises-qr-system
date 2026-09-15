"use client";

import React, { useEffect, useState } from "react";
import { Campaign, Voucher } from "@/lib/types";
import {
  CheckCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  Smartphone,
  Headphones,
  Watch,
  Zap,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

interface RewardUnlockScreenProps {
  campaign: Campaign;
  voucher: Voucher;
  isDuplicate?: boolean;
  onFinish: () => void;
}

export const RewardUnlockScreen: React.FC<RewardUnlockScreenProps> = ({
  campaign,
  voucher,
  isDuplicate = false,
  onFinish,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [sentMessage, setSentMessage] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(90);

  useEffect(() => {
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#779BAD", "#F1EA99", "#040505", "#557B8F", "#D6CE65"],
      });
    } catch {
      // ignore
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onFinish]);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendSimulatedSms = () => {
    setSentMessage(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
      <GlassCard
        elevated
        className="w-full p-4 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Soft background ambient gradient */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-yellow/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none" />

        {/* Celebration Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-3">
          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>
            {isDuplicate ? "Voucher Active & Ready" : "New SaiKeshav Enterprises Voucher Unlocked!"}
          </span>
        </div>

        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-dark tracking-tight leading-snug">
          ₹{voucher.value} Off Your Gadget Purchase
        </h2>
        <p className="text-[11px] sm:text-sm text-neutral-500 font-medium mt-0.5 mb-3 sm:mb-4">
          Present this barcode or code at the New SaiKeshav Enterprises billing desk, Roxy Road, Baripada.
        </p>

        {/* Voucher Ticket Component */}
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-dashed border-neutral-300 shadow-lg relative mb-3 sm:mb-4">
          {/* Top Notch Accents */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-surface border-r border-neutral-300" />
          <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-surface border-l border-neutral-300" />

          {/* Value Header */}
          <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-neutral-100">
            <div className="text-left">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                New SaiKeshav Enterprises Pass
              </span>
              <div className="text-xl sm:text-2xl font-black text-brand-dark">
                ₹{voucher.value} OFF
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Status
              </span>
              <div>
                <span
                  className={`inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase ${
                    voucher.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {voucher.status}
                </span>
              </div>
            </div>
          </div>

          {/* Applicable Gadget icons */}
          <div className="py-1.5 flex items-center justify-center gap-3 text-[9px] sm:text-[10px] font-bold text-neutral-500">
            <span className="flex items-center gap-0.5">
              <Smartphone className="w-2.5 h-2.5 text-brand-blue" /> Phones
            </span>
            <span className="flex items-center gap-0.5">
              <Headphones className="w-2.5 h-2.5 text-pink-500" /> Audio
            </span>
            <span className="flex items-center gap-0.5">
              <Watch className="w-2.5 h-2.5 text-brand-dark" /> Watches
            </span>
            <span className="flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 text-amber-500" /> Gear
            </span>
          </div>

          {/* QR Code and Code Display */}
          <div className="py-2 sm:py-3 flex flex-col items-center">
            <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-neutral-200 shadow-sm mb-2.5">
              <QRCodeSVG
                value={voucher.code}
                size={120}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Voucher Code Box */}
            <div className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-brand-surface border border-neutral-300 shadow-inner">
              <span className="font-mono text-lg sm:text-2xl font-black tracking-widest text-brand-dark">
                {voucher.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded-lg hover:bg-white text-neutral-600 transition"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Ticket Footnote */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-neutral-500">
            <span>Min spend: ₹{voucher.minOrderValue}</span>
            <span>
              Expires: {new Date(voucher.expiresAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* SMS / Delivery status */}
        <div className="w-full max-w-sm sm:max-w-md mb-3 sm:mb-4">
          {sentMessage ? (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sent to +91 {voucher.phone} via SMS/WhatsApp</span>
            </div>
          ) : (
            <button
              onClick={handleSendSimulatedSms}
              className="w-full py-2 px-3 rounded-xl bg-white/80 hover:bg-white border border-neutral-200 text-[11px] sm:text-xs font-bold text-neutral-700 transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3 h-3 text-brand-blue" />
              <span>Send copy to my phone (+91 {voucher.phone})</span>
            </button>
          )}
        </div>

        {/* Finish CTA */}
        <div className="w-full max-w-sm sm:max-w-md space-y-1.5">
          <button
            onClick={onFinish}
            className="w-full py-3 sm:py-3.5 rounded-2xl bg-brand-dark hover:bg-black text-white font-extrabold text-sm sm:text-base tracking-wide shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Done — Ready to Purchase</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="text-[10px] text-neutral-400 font-medium">
            Auto-resets in {countdown}s for the next shopper
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
