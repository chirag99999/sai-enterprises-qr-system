"use client";

import React, { useState, useEffect, useRef } from "react";
import { Campaign, Voucher } from "@/lib/types";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Edit2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { TouchKeypad } from "./TouchKeypad";
import {
  isFirebaseConfigured,
  getFirebaseAuth,
  ConfirmationResult,
} from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

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
  // Mode: "PHONE" or "OTP"
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Firebase ConfirmationResult & timer
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Ref to hold recaptcha verifier
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Format raw 10 digits
  const formatPhone = (raw: string) => {
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)} ${raw.slice(5)}`;
  };

  // Keypad handlers for PHONE step
  const handlePhoneDigit = (digit: string) => {
    if (phone.length < 10) {
      setPhone((prev) => prev + digit);
      setError(null);
    }
  };

  const handlePhoneBackspace = () => {
    setPhone((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handlePhoneClear = () => {
    setPhone("");
    setError(null);
  };

  // Keypad handlers for OTP step
  const handleOtpDigit = (digit: string) => {
    if (otp.length < 6) {
      const newOtp = otp + digit;
      setOtp(newOtp);
      setError(null);
      if (newOtp.length === 6) {
        handleVerifyOtp(newOtp);
      }
    }
  };

  const handleOtpBackspace = () => {
    setOtp((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleOtpClear = () => {
    setOtp("");
    setError(null);
  };

  // Step 1: Send SMS OTP
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Please enter a complete 10-digit mobile number");
      return;
    }

    if (!consent) {
      setError("Please accept consent to receive your voucher");
      return;
    }

    setLoading(true);
    setError(null);

    const fullPhoneNumber = `+91${phone}`;

    // Check if Firebase keys are configured
    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase auth not available");

        // Initialize invisible reCAPTCHA
        if (!recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
              size: "invisible",
              callback: () => {
                // reCAPTCHA solved
              },
            }
          );
        }

        const confirmation = await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          recaptchaVerifierRef.current
        );

        setConfirmationResult(confirmation);
        setIsDemoMode(false);
        setStep("OTP");
        setOtp("");
        setResendCooldown(30);
      } catch (err: any) {
        console.error("Firebase SMS error:", err);
        // If reCAPTCHA or Firebase fails, report clear message
        setError(
          err.message ||
            "Unable to send SMS. Please check mobile number or try again."
        );
        if (recaptchaVerifierRef.current) {
          try {
            recaptchaVerifierRef.current.clear();
            recaptchaVerifierRef.current = null;
          } catch {
            // ignore
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Firebase not configured yet in environment -> Instant Demo Simulation
      setIsDemoMode(true);
      setStep("OTP");
      setOtp("");
      setResendCooldown(30);
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (codeToVerify: string = otp) => {
    if (codeToVerify.length !== 6) {
      setError("Please enter the full 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (confirmationResult && !isDemoMode) {
        // Real Firebase SMS verification
        await confirmationResult.confirm(codeToVerify);
      } else {
        // Demo fallback verification (accepts 123456 or any 6 digits in demo mode)
        if (codeToVerify !== "123456" && codeToVerify.length !== 6) {
          throw new Error("Invalid OTP code. In demo mode, use 123456");
        }
      }

      // Once OTP is confirmed, submit the lead and advance
      const res = await onSubmitPhone(phone, consent);
      if (!res.success) {
        setError(res.error || "Failed to process mobile number");
        setLoading(false);
        return;
      }

      if (res.hasExistingVoucher && res.existingVoucher) {
        onViewExistingVoucher(res.existingVoucher);
      }
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(
        err.message?.includes("invalid-verification-code")
          ? "Incorrect OTP. Please check the SMS and re-enter."
          : err.message || "Invalid OTP code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Primary submit on Phone screen (checks if OTP is required)
  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) {
      setError("Please enter a complete 10-digit mobile number");
      return;
    }

    if (!consent) {
      setError("Please accept consent to receive your voucher");
      return;
    }

    // If OTP is required by the admin, send SMS OTP
    if (campaign.otpRequired) {
      handleSendOtp();
    } else {
      // If OTP is turned OFF, proceed directly to unlock/social verification
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

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
      {/* Hidden container for invisible Firebase reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <GlassCard elevated className="w-full p-4 sm:p-7 flex flex-col items-center">
        {/* Step Indicator & Back Button */}
        <div className="w-full flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (step === "OTP") {
                setStep("PHONE");
                setError(null);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-brand-dark px-3 py-1 rounded-full bg-white/70 border border-neutral-200 hover:bg-white transition active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{step === "OTP" ? "Change Phone" : "Back"}</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span>
              {step === "OTP"
                ? "Step 1b: Verify OTP"
                : campaign.otpRequired
                ? "Step 1 of 2: Phone & OTP"
                : "Step 1 of 2: Phone Number"}
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
                  ? "Enter your 10-digit mobile number to receive your instant SMS verification code."
                  : "Enter your 10-digit mobile number to reserve your instant gadget voucher."}
              </p>
            </div>

            {/* Phone Display Input */}
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
                onDigit={handlePhoneDigit}
                onBackspace={handlePhoneBackspace}
                onClear={handlePhoneClear}
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

            {/* Continue / Send OTP Button */}
            <div className="w-full max-w-[280px] sm:max-w-xs">
              <button
                onClick={handlePhoneSubmit}
                disabled={phone.length !== 10 || loading}
                className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                  phone.length === 10 && !loading
                    ? "bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 text-amber-400 cursor-pointer"
                    : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>
                      {campaign.otpRequired ? "Sending SMS OTP..." : "Reserving Voucher..."}
                    </span>
                  </span>
                ) : (
                  <>
                    <span>
                      {campaign.otpRequired ? "SEND FREE SMS OTP" : "CONTINUE"}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* --- STEP 2: 6-DIGIT OTP VERIFICATION --- */}
        {step === "OTP" && (
          <>
            <div className="text-center mb-3 sm:mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
                Enter 6-Digit OTP
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="text-xs font-bold text-neutral-600">
                  Sent via SMS to +91 {phone.slice(0, 5)} {phone.slice(5)}
                </span>
                <button
                  onClick={() => {
                    setStep("PHONE");
                    setError(null);
                  }}
                  className="text-amber-700 hover:text-amber-800 p-0.5"
                  title="Change Number"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

              {isDemoMode && (
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                  <span>💡 Test Demo OTP: <strong>123456</strong> (Add Firebase keys to send live SMS)</span>
                </div>
              )}
            </div>

            {/* 6 OTP Boxes */}
            <div className="w-full max-w-[320px] mb-2">
              <div className="flex gap-1.5 sm:gap-2 justify-center">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-9 h-12 sm:w-11 sm:h-14 rounded-xl border-2 flex items-center justify-center font-mono font-black text-xl sm:text-2xl transition-all shadow-xs ${
                      otp.length === idx
                        ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/20"
                        : otp[idx]
                        ? "border-neutral-900 bg-white text-neutral-900"
                        : "border-neutral-200 bg-neutral-50 text-neutral-300"
                    }`}
                  >
                    {otp[idx] || ""}
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs font-bold text-red-600 px-1 text-center animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Resend Action */}
            <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mb-3">
              <span>Didn&apos;t receive code?</span>
              {resendCooldown > 0 ? (
                <span className="font-bold text-neutral-700">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="font-extrabold text-amber-700 hover:text-amber-800 underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend SMS</span>
                </button>
              )}
            </div>

            {/* Touch Keypad for 6-digit OTP */}
            <div className="w-full mb-3">
              <TouchKeypad
                onDigit={handleOtpDigit}
                onBackspace={handleOtpBackspace}
                onClear={handleOtpClear}
                disabled={loading}
              />
            </div>

            {/* Verify Button */}
            <div className="w-full max-w-[280px] sm:max-w-xs">
              <button
                onClick={() => handleVerifyOtp()}
                disabled={otp.length !== 6 || loading}
                className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                  otp.length === 6 && !loading
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white cursor-pointer"
                    : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying OTP...</span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>VERIFY &amp; PROCEED</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
};
