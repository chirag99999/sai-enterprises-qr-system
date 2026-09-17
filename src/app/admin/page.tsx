"use client";

import React, { useState, useEffect, useRef } from "react";
import { Campaign, Store, Voucher, FunnelStats } from "@/lib/types";
import { DEFAULT_CAMPAIGN, DEFAULT_STORES } from "@/lib/seed-data";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { CampaignSettingsForm } from "@/components/admin/CampaignSettingsForm";
import { VoucherTable } from "@/components/admin/VoucherTable";
import { GoogleSheetSyncCard } from "@/components/admin/GoogleSheetSyncCard";
import Link from "next/link";
import {
  BarChart3,
  Settings,
  Ticket,
  ArrowLeft,
  ReceiptText,
  Store as StoreIcon,
  RefreshCw,
  FileSpreadsheet,
  Lock,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  LogOut,
} from "lucide-react";

const ADMIN_AUTHORIZED_PHONE = "9439914133";

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [loginPhone, setLoginPhone] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"analytics" | "campaign" | "vouchers">(
    "analytics"
  );
  const [stores, setStores] = useState<Store[]>(DEFAULT_STORES);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [campaign, setCampaign] = useState<Campaign>(DEFAULT_CAMPAIGN);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [stats, setStats] = useState<FunnelStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check persisted session auth on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("sai_admin_authenticated");
      if (saved === "true") {
        setIsAuthenticated(true);
      }
      setIsCheckingAuth(false);
    }
  }, []);

  // Auto focus input when on login screen
  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAuthenticated, isCheckingAuth]);

  // Load data once authenticated
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Campaign & Stores
      const campRes = await fetch("/api/campaign", { cache: "no-store" });
      if (campRes.ok) {
        const campData = await campRes.json();
        if (campData.success) {
          if (campData.campaign) setCampaign(campData.campaign);
          if (campData.stores) setStores(campData.stores);
        }
      }

      // 2. Funnel Analytics
      const statsRes = await fetch(`/api/analytics?storeId=${selectedStore}`, { cache: "no-store" });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }
      }

      // 3. Vouchers
      const vchRes = await fetch("/api/vouchers", { cache: "no-store" });
      if (vchRes.ok) {
        const vchData = await vchRes.json();
        if (vchData.success) {
          setVouchers(vchData.vouchers);
        }
      }
    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, selectedStore]);

  // Handle phone input & auto-unlock when 9439914133 is entered
  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 10);
    setLoginPhone(digitsOnly);
    setLoginError("");

    // Auto-verify if 10 digits reached
    if (digitsOnly.length === 10) {
      if (digitsOnly === ADMIN_AUTHORIZED_PHONE) {
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("sai_admin_authenticated", "true");
        }
      } else {
        setLoginError("Access Restricted: Incorrect admin number.");
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = loginPhone.replace(/\D/g, "");
    if (digitsOnly === ADMIN_AUTHORIZED_PHONE || digitsOnly.endsWith(ADMIN_AUTHORIZED_PHONE)) {
      setIsAuthenticated(true);
      setLoginError("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("sai_admin_authenticated", "true");
      }
    } else {
      setLoginError("Access Restricted: Invalid Admin Number.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginPhone("");
    setLoginError("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("sai_admin_authenticated");
    }
  };

  const handleToggleOtp = async () => {
    const updated = { ...campaign, otpRequired: !campaign.otpRequired };
    setCampaign(updated);
    try {
      await fetch("/api/campaign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Failed to toggle OTP setting:", e);
    }
  };

  // Prevent flash while checking auth
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
      </main>
    );
  }

  // --- LOGIN GATE SCREEN ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAF8F5] text-neutral-900 relative">
        {/* Soft background aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200/80 relative z-10">
          {/* Top Return link */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Kiosk</span>
            </Link>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
              Authorized Only
            </span>
          </div>

          {/* Badge & Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-600/20 mb-3">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Admin Access Gate
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
              Enter the authorized administrator mobile number to access store analytics, campaign settings &amp; voucher logs.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Admin Mobile Number
              </label>
              <div className="flex items-center rounded-2xl border-2 border-neutral-200 focus-within:border-amber-500 bg-neutral-50/50 overflow-hidden transition px-3.5 py-1">
                <span className="text-sm font-extrabold text-neutral-400 select-none mr-2">
                  +91
                </span>
                <input
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={loginPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="w-full py-2.5 bg-transparent font-extrabold text-base tracking-widest text-neutral-900 focus:outline-none placeholder:text-neutral-300 placeholder:font-normal placeholder:tracking-normal"
                  maxLength={10}
                />
              </div>
              {loginError && (
                <p className="text-xs font-bold text-rose-600 mt-1.5 flex items-center gap-1 animate-in fade-in">
                  <span>⚠️</span>
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 active:scale-[0.98] text-amber-400 font-extrabold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4 text-amber-400 ml-1" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured for New SaiKeshav Enterprises Management</span>
          </div>
        </div>
      </main>
    );
  }

  // --- AUTHENTICATED ADMIN DASHBOARD ---
  return (
    <main className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Admin Top Navigation */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-neutral-700 border border-neutral-200 shadow-sm transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kiosk Mode</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl text-brand-dark">
              Marketing &amp; Ops Control
            </h1>
            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-brand-dark text-brand-yellow uppercase">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Store Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-neutral-200 text-xs font-bold text-neutral-700">
            <StoreIcon className="w-3.5 h-3.5 text-brand-blue" />
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="all">All Store Locations</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 1-Click Customer OTP Verification Toggle */}
          <button
            onClick={handleToggleOtp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs active:scale-95 ${
              campaign.otpRequired
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : "bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200"
            }`}
            title="Click to toggle Customer Phone OTP Verification ON or OFF"
          >
            <ShieldCheck
              className={`w-3.5 h-3.5 ${
                campaign.otpRequired ? "text-emerald-600" : "text-neutral-400"
              }`}
            />
            <span>Customer OTP:</span>
            <span
              className={`px-1.5 py-0.2 rounded-md font-black text-[10px] uppercase ${
                campaign.otpRequired
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-300 text-neutral-700"
              }`}
            >
              {campaign.otpRequired ? "ON" : "OFF"}
            </span>
          </button>

          <Link
            href="/pos"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-neutral-700 border border-neutral-200 shadow-sm transition"
          >
            <ReceiptText className="w-3.5 h-3.5 text-brand-blue" />
            <span>Staff POS</span>
          </Link>

          <button
            onClick={loadAllData}
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Lock / Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition shadow-2xs"
            title="Lock Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === "analytics"
              ? "bg-brand-dark text-brand-yellow shadow-sm"
              : "bg-white/60 hover:bg-white text-neutral-600"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Funnel Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("campaign")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === "campaign"
              ? "bg-brand-dark text-brand-yellow shadow-sm"
              : "bg-white/60 hover:bg-white text-neutral-600"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Campaign Config</span>
        </button>

        <button
          onClick={() => setActiveTab("vouchers")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === "vouchers"
              ? "bg-brand-dark text-brand-yellow shadow-sm"
              : "bg-white/60 hover:bg-white text-neutral-600"
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Voucher Ledger ({vouchers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("sheets" as any)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            (activeTab as any) === "sheets"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Google Sheets Sync</span>
        </button>
      </div>

      {/* Google Sheets Lead Sync Banner when on Vouchers or Sheets tab */}
      {((activeTab as any) === "sheets" || activeTab === "vouchers") && (
        <GoogleSheetSyncCard />
      )}

      {/* Tab Panels */}
      {activeTab === "analytics" && stats && <FunnelChart stats={stats} />}

      {activeTab === "campaign" && (
        <CampaignSettingsForm
          initialCampaign={campaign}
          stores={stores}
          onSaved={(updated) => setCampaign(updated)}
        />
      )}

      {activeTab === "vouchers" && (
        <VoucherTable vouchers={vouchers} stores={stores} />
      )}
    </main>
  );
}
