"use client";

import React, { useState } from "react";
import { Campaign, Voucher } from "@/lib/types";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { TouchKeypad } from "./TouchKeypad";

interface PhoneEntryScreenProps {
  campaign: Campaign;
  onSubmitPhone: (
    phone: string,
    consent: boolean
  ) => Promise<{
    success: boolean;
    error?: string;
    hasExistingVoucher?: boolean;
    existingVoucher?: Voucher | null;
  }>;
  onBack: () => void;
  onViewExistingVoucher: (voucher: Voucher) => void;
}

export const PhoneEntryScreen: React.FC<PhoneEntryScreenProps> = ({
  campaign,
  onSubmitPhone,
  onBack,
  onViewExistingVoucher,
}) => {
  const [phone, setPhone] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    if (phone.length < 10) {
      setPhone((prev) => prev + digit);
      setError(null);
    }
  };

  const handleBackspace = () => {
    setPhone((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPhone("");
    setError(null);
  };

  const formatPhone = (raw: string) => {
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)} ${raw.slice(5)}`;
  };

  const handleContinue = async () => {
    if (phone.length !== 10) {
      setError("Please enter a complete 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await onSubmitPhone(phone, consent);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to process mobile number");
      return;
    }

    if (res.hasExistingVoucher && res.existingVoucher) {
      onViewExistingVoucher(res.existingVoucher);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
      <GlassCard elevated className="w-full p-4 sm:p-8 flex flex-col items-center">
        {/* Step Indicator & Back Button */}
        <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-brand-dark px-2.5 py-1 rounded-full bg-white/70 border border-white hover:bg-white transition active:scale-95"
          >
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-yellow/70 text-brand-dark">
            <span>Step 1 of 2</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-3 sm:mb-5">
          <h2 className="text-xl sm:text-3xl font-extrabold text-brand-dark tracking-tight leading-snug">
            Where should we send your ₹{campaign.rewardAmount} voucher?
          </h2>
          <p className="mt-1 text-[11px] sm:text-sm text-neutral-500 font-medium max-w-sm mx-auto">
            Enter your mobile number to reserve your instant gadget reward.
          </p>
        </div>

        {/* Phone Input Display */}
        <div className="w-full max-w-[280px] sm:max-w-xs mb-3 sm:mb-4">
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl bg-white border-2 transition-all ${
              error
                ? "border-red-500 bg-red-50/20"
                : phone.length === 10
                ? "border-brand-blue ring-4 ring-brand-blue/20"
                : "border-neutral-300"
            } shadow-sm`}
          >
            <div className="flex items-center gap-1 pr-2 border-r border-neutral-200 text-xs sm:text-sm font-bold text-neutral-600">
              <span className="text-sm sm:text-base">🇮🇳</span>
              <span>+91</span>
            </div>
            <div className="flex-1 tracking-widest text-lg sm:text-2xl font-black text-brand-dark font-mono text-center">
              {phone.length === 0 ? (
                <span className="text-neutral-300 font-normal tracking-normal text-xs sm:text-base">
                  Enter 10 digits
                </span>
              ) : (
                formatPhone(phone)
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-red-600 px-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Touch Keypad */}
        <div className="w-full mb-3 sm:mb-4">
          <TouchKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
            disabled={loading}
          />
        </div>

        {/* Consent checkbox */}
        <div className="w-full max-w-[280px] sm:max-w-xs mb-3 sm:mb-4">
          <label className="flex items-start gap-2 cursor-pointer text-left">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded text-brand-dark focus:ring-brand-blue border-neutral-300 cursor-pointer"
            />
            <span className="text-[10px] sm:text-[11px] text-neutral-500 leading-tight">
              I agree to receive my ₹{campaign.rewardAmount} voucher via SMS/WhatsApp and confirm I am a walk-in store customer.
            </span>
          </label>
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-[280px] sm:max-w-xs">
          <button
            onClick={handleContinue}
            disabled={phone.length !== 10 || loading}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 transition-all shadow-md ${
              phone.length === 10 && !loading
                ? "bg-brand-dark hover:bg-black text-brand-yellow active:scale-[0.98]"
                : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                <span>Checking...</span>
              </span>
            ) : (
              <>
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
