"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Campaign, Store, Voucher, ClaimSession } from "@/lib/types";
import { DEFAULT_CAMPAIGN, DEFAULT_STORES } from "@/lib/seed-data";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { WelcomeScreen } from "@/components/kiosk/WelcomeScreen";
import { PhoneEntryScreen } from "@/components/kiosk/PhoneEntryScreen";
import { ReviewSocialScreen } from "@/components/kiosk/ReviewSocialScreen";
import { RewardUnlockScreen } from "@/components/kiosk/RewardUnlockScreen";
import { SkipSocialHub } from "@/components/kiosk/SkipSocialHub";

type KioskStep =
  | "WELCOME"
  | "PHONE_ENTRY"
  | "REVIEW_SOCIAL"
  | "REWARD_UNLOCK"
  | "SKIP_HUB";

export default function KioskPage() {
  const [campaign, setCampaign] = useState<Campaign>(DEFAULT_CAMPAIGN);
  const [stores, setStores] = useState<Store[]>(DEFAULT_STORES);
  const [currentStore, setCurrentStore] = useState<Store | null>(DEFAULT_STORES[0]);
  const [currentStep, setCurrentStep] = useState<KioskStep>("WELCOME");

  // Flow states
  const [session, setSession] = useState<ClaimSession | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [unlockedVoucher, setUnlockedVoucher] = useState<Voucher | null>(null);
  const [isDuplicateVoucher, setIsDuplicateVoucher] = useState<boolean>(false);
  const [unlockLoading, setUnlockLoading] = useState<boolean>(false);

  // Inactivity auto-reset timer (60 seconds)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetKiosk = useCallback(() => {
    setCurrentStep("WELCOME");
    setSession(null);
    setPhone("");
    setUnlockedVoucher(null);
    setIsDuplicateVoucher(false);
    setUnlockLoading(false);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (currentStep !== "WELCOME") {
      idleTimerRef.current = setTimeout(() => {
        resetKiosk();
      }, 75000); // 75 seconds idle reset
    }
  }, [currentStep, resetKiosk]);

  useEffect(() => {
    const handleUserActivity = () => resetIdleTimer();
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    resetIdleTimer();

    return () => {
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Fetch campaign config on load
  useEffect(() => {
    async function loadCampaign() {
      try {
        const res = await fetch("/api/campaign");
        const data = await res.json();
        if (data.success) {
          if (data.campaign) setCampaign(data.campaign);
          if (data.stores && data.stores.length > 0) {
            setStores(data.stores);
            setCurrentStore(data.stores[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load campaign:", err);
      }
    }
    loadCampaign();
  }, []);

  // Step Handlers
  const handleStartClaim = async () => {
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "START_CLAIM",
          storeId: currentStore?.id || "store-101",
        }),
      });
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
      }
    } catch (e) {
      console.error(e);
    }
    setCurrentStep("PHONE_ENTRY");
  };

  const handleSkipToSocial = async () => {
    try {
      await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SKIP_TO_SOCIAL",
          sessionId: session?.sessionId,
          storeId: currentStore?.id || "store-101",
        }),
      });
    } catch (e) {
      console.error(e);
    }
    setCurrentStep("SKIP_HUB");
  };

  const handleSubmitPhone = async (
    submittedPhone: string,
    consent: boolean
  ): Promise<{
    success: boolean;
    error?: string;
    hasExistingVoucher?: boolean;
    existingVoucher?: Voucher | null;
  }> => {
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_PHONE",
          phone: submittedPhone,
          sessionId: session?.sessionId,
          storeId: currentStore?.id || "store-101",
          marketingConsent: consent,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error };
      }

      setPhone(submittedPhone);

      // If customer already has an existing voucher, return it
      if (data.hasExistingVoucher && data.existingVoucher) {
        return {
          success: true,
          hasExistingVoucher: true,
          existingVoucher: data.existingVoucher,
        };
      }

      // Fresh claim, advance to review step
      setCurrentStep("REVIEW_SOCIAL");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const handleViewExistingVoucher = (v: Voucher) => {
    setUnlockedVoucher(v);
    setIsDuplicateVoucher(true);
    setCurrentStep("REWARD_UNLOCK");
  };

  const handleOpenReview = async () => {
    try {
      await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CLICK_REVIEW_CTA",
          sessionId: session?.sessionId,
          storeId: currentStore?.id || "store-101",
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSocialClick = async (platform: string) => {
    try {
      await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CLICK_SOCIAL",
          sessionId: session?.sessionId,
          storeId: currentStore?.id || "store-101",
          platform,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmCompleted = async () => {
    setUnlockLoading(true);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session?.sessionId,
          phone,
          storeId: currentStore?.id || "store-101",
        }),
      });
      const data = await res.json();
      setUnlockLoading(false);

      if (data.success && data.voucher) {
        setUnlockedVoucher(data.voucher);
        setIsDuplicateVoucher(data.isDuplicate || false);
        setCurrentStep("REWARD_UNLOCK");
      } else {
        alert(data.error || "Could not unlock voucher. Please try again.");
      }
    } catch (e: any) {
      setUnlockLoading(false);
      alert(e.message || "An error occurred while unlocking your reward.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between overflow-x-hidden relative">
      {/* Top Header Shell (shown on sub-screens) */}
      {currentStep !== "WELCOME" && (
        <KioskHeader
          currentStore={currentStore}
          stores={stores}
          onSelectStore={(s) => setCurrentStore(s)}
          onReset={resetKiosk}
        />
      )}

      {/* Dynamic Screen View */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {currentStep === "WELCOME" && (
          <WelcomeScreen
            campaign={campaign}
            currentStore={currentStore}
            stores={stores}
            onSelectStore={(s) => setCurrentStore(s)}
            onStartClaim={handleStartClaim}
            onSkip={handleSkipToSocial}
          />
        )}

        {currentStep === "PHONE_ENTRY" && (
          <PhoneEntryScreen
            campaign={campaign}
            onSubmitPhone={handleSubmitPhone}
            onBack={() => setCurrentStep("WELCOME")}
            onViewExistingVoucher={handleViewExistingVoucher}
          />
        )}

        {currentStep === "REVIEW_SOCIAL" && (
          <ReviewSocialScreen
            campaign={campaign}
            phone={phone}
            onOpenReview={handleOpenReview}
            onSocialClick={handleSocialClick}
            onConfirmCompleted={handleConfirmCompleted}
            onBack={() => setCurrentStep("PHONE_ENTRY")}
            loading={unlockLoading}
          />
        )}

        {currentStep === "REWARD_UNLOCK" && unlockedVoucher && (
          <RewardUnlockScreen
            campaign={campaign}
            voucher={unlockedVoucher}
            isDuplicate={isDuplicateVoucher}
            onFinish={resetKiosk}
          />
        )}

        {currentStep === "SKIP_HUB" && (
          <SkipSocialHub
            campaign={campaign}
            onBackToOffer={() => setCurrentStep("WELCOME")}
            onSocialClick={handleSocialClick}
          />
        )}
      </div>

      {/* Subtle Bottom Footer (on sub-screens) */}
      {currentStep !== "WELCOME" && (
        <footer className="w-full py-3 text-center text-[11px] text-neutral-400 font-medium z-10">
          <span>Powered by New SaiKeshav Enterprises In-Store Experience Engine • Roxy Road, Baripada</span>
        </footer>
      )}
    </main>
  );
}
