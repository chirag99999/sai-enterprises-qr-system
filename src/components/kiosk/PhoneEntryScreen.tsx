"use client";

import React, { useState } from "react";
import { Campaign, Voucher } from "@/lib/types";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { TouchKeypad } from "./TouchKeypad";
import { QRCodeSVG } from "qrcode.react";

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
  const [step, setStep] = useState<"PHONE" | "WHATSAPP_VERIFY">("PHONE");
  const [phone, setPhone] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // WhatsApp 1-Tap Verification state
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const storePhone = campaign.storeWhatsAppNumber || "9439914133";

  // Format 10 digits
  const formatPhone = (raw: string) => {
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)} ${raw.slice(5)}`;
  };

  // Touch keypad handlers
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

  // Build WhatsApp URL
  const generateWhatsAppUrl = (code: string) => {
    const text = `Hi New SaiKeshav Enterprises! Verifying my mobile number +91 ${phone} to claim my ₹${campaign.rewardAmount} voucher. Verification Code: ${code}`;
    return `https://wa.me/91${storePhone}?text=${encodeURIComponent(text)}`;
  };

  // Step 1: Submit Phone or Trigger WhatsApp Verification
  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) {
      setError("Please enter a complete 10-digit mobile number");
      return;
    }

    if (!consent) {
      setError("Please accept consent to receive your voucher");
      return;
    }

    // If verification is ON: Generate code and open WhatsApp verification
    if (campaign.otpRequired) {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      setVerificationCode(randomCode);
      setHasSentWhatsApp(false);
      setStep("WHATSAPP_VERIFY");
      setError(null);
    } else {
      // If verification is OFF: Directly submit
      setLoading(true);
      setError(null);
      try {
        const res = await onSubmitPhone(phone, consent);
        setLoading(false);
        if (!res.success) {
          setError(res.error || "Failed to process mobile number");
          return;
        }
        if (res.hasExistingVoucher && res.existingVoucher) {
          onViewExistingVoucher(res.existingVoucher);
        }
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Failed to process mobile number");
      }
    }
  };

  // Open WhatsApp with prefilled message
  const handleOpenWhatsApp = () => {
    setHasSentWhatsApp(true);
    const url = generateWhatsAppUrl(verificationCode);
    window.open(url, "_blank");
  };

  // Step 2: Proceed after sending WhatsApp code
  const handleConfirmVerified = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await onSubmitPhone(phone, consent);
      setLoading(false);
      if (!res.success) {
        setError(res.error || "Failed to process mobile number");
        return;
      }
      if (res.hasExistingVoucher && res.existingVoucher) {
        onViewExistingVoucher(res.existingVoucher);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to process mobile number");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
      <GlassCard elevated className="w-full p-4 sm:p-7 flex flex-col items-center">
        {/* Top Navigation */}
        <div className="w-full flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (step === "WHATSAPP_VERIFY") {
                setStep("PHONE");
                setError(null);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-brand-dark px-3 py-1 rounded-full bg-white/70 border border-neutral-200 hover:bg-white transition active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{step === "WHATSAPP_VERIFY" ? "Change Phone" : "Back"}</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span>
              {step === "WHATSAPP_VERIFY"
                ? "Step 1b: WhatsApp Verification"
                : "Step 1 of 2: Mobile Number"}
            </span>
          </div>
        </div>

        {/* --- STEP 1: PHONE ENTRY --- */}
        {step === "PHONE" && (
          <>
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
                Where should we send your ₹{campaign.rewardAmount} voucher?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium max-w-sm mx-auto">
                {campaign.otpRequired
                  ? "Enter your 10-digit mobile number for free 1-tap WhatsApp verification."
                  : "Enter your 10-digit mobile number to reserve your instant gadget voucher."}
              </p>
            </div>

            {/* Phone Display Box */}
            <div className="w-full max-w-[280px] sm:max-w-xs mb-3">
              <div
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-2xl bg-white border-2 transition-all ${
                  error
                    ? "border-red-500 bg-red-50/20"
                    : phone.length === 10
                    ? "border-amber-500 ring-4 ring-amber-400/20"
                    : "border-neutral-300"
                } shadow-sm`}
              >
                <div className="flex items-center gap-1 pr-2 border-r border-neutral-200 text-xs sm:text-sm font-extrabold text-neutral-700">
                  <span className="text-base">🇮🇳</span>
                  <span>+91</span>
                </div>
                <div className="flex-1 tracking-widest text-lg sm:text-2xl font-black text-neutral-900 font-mono text-center">
                  {phone.length === 0 ? (
                    <span className="text-neutral-300 font-normal tracking-normal text-xs sm:text-sm">
                      10 Digits Mobile
                    </span>
                  ) : (
                    formatPhone(phone)
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-1 mt-1.5 text-xs font-bold text-red-600 px-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Touch Keypad */}
            <div className="w-full mb-3">
              <TouchKeypad
                onDigit={handleDigit}
                onBackspace={handleBackspace}
                onClear={handleClear}
                disabled={loading}
              />
            </div>

            {/* Consent checkbox */}
            <div className="w-full max-w-[280px] sm:max-w-xs mb-3">
              <label className="flex items-start gap-2 cursor-pointer text-left select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-neutral-300 cursor-pointer"
                />
                <span className="text-[10px] sm:text-[11px] text-neutral-500 leading-tight">
                  I agree to receive my ₹{campaign.rewardAmount} voucher via SMS/WhatsApp and confirm I am a store customer.
                </span>
              </label>
            </div>

            {/* Primary Action Button */}
            <div className="w-full max-w-[280px] sm:max-w-xs">
              <button
                onClick={handlePhoneSubmit}
                disabled={phone.length !== 10 || loading}
                className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                  phone.length === 10 && !loading
                    ? campaign.otpRequired
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-600/30"
                      : "bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 text-amber-400 cursor-pointer"
                    : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : campaign.otpRequired ? (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>VERIFY VIA WHATSAPP (FREE)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>CONTINUE TO CLAIM</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* --- STEP 2: WHATSAPP 1-TAP VERIFICATION CARD --- */}
        {step === "WHATSAPP_VERIFY" && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-emerald-600/30 animate-in zoom-in-95">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
              1-Tap WhatsApp Verification
            </h2>

            <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
              Tap below to send your verification code from your personal WhatsApp to New SaiKeshav Enterprises.
            </p>

            {/* Big Code Pill */}
            <div className="my-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 w-full max-w-xs shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block mb-1">
                Your Verification Code
              </span>
              <div className="text-3xl font-mono font-black text-emerald-950 tracking-[0.3em]">
                {verificationCode}
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                For Mobile: +91 {phone.slice(0, 5)} {phone.slice(5)}
              </span>
            </div>

            {/* Primary WhatsApp Action Button */}
            <div className="w-full max-w-xs space-y-2.5">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>OPEN WHATSAPP &amp; SEND CODE</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              {/* Tablet Kiosk QR Code Option */}
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>On Store Tablet? Scan QR Code</span>
              </button>
            </div>

            {/* Once tapped / verified button */}
            <div className="w-full max-w-xs mt-4 pt-4 border-t border-neutral-200">
              <button
                onClick={handleConfirmVerified}
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                  hasSentWhatsApp
                    ? "bg-gradient-to-r from-neutral-900 to-neutral-800 text-amber-400 hover:from-black hover:to-neutral-900 cursor-pointer animate-pulse"
                    : "bg-neutral-900 text-white hover:bg-black cursor-pointer"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Reserving Voucher...</span>
                  </span>
                ) : hasSentWhatsApp ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>I&apos;VE SENT CODE — CONTINUE</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </>
                ) : (
                  <>
                    <span>I&apos;VE SENT CODE — CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-neutral-400 mt-1.5 font-medium">
                Instant 100% Free verification with New SaiKeshav Enterprises.
              </p>
            </div>
          </div>
        )}
      </GlassCard>

      {/* QR Code Modal for Tablet Users */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-neutral-200 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="font-black text-base text-neutral-900">
              Scan with WhatsApp Camera
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5 mb-3">
              Scan with your phone camera to send verification code {verificationCode} directly to our WhatsApp.
            </p>

            <div className="p-3 bg-white rounded-2xl border-2 border-neutral-100 shadow-inner mb-4">
              <QRCodeSVG
                value={generateWhatsAppUrl(verificationCode)}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <button
              onClick={() => {
                setHasSentWhatsApp(true);
                setShowQrModal(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wide transition active:scale-95"
            >
              I Have Scanned &amp; Sent
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
