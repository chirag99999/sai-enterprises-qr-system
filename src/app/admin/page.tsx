"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "campaign" | "vouchers">(
    "analytics"
  );
  const [stores, setStores] = useState<Store[]>(DEFAULT_STORES);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [campaign, setCampaign] = useState<Campaign>(DEFAULT_CAMPAIGN);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [stats, setStats] = useState<FunnelStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Campaign & Stores
      const campRes = await fetch("/api/campaign");
      const campData = await campRes.json();
      if (campData.success) {
        if (campData.campaign) setCampaign(campData.campaign);
        if (campData.stores) setStores(campData.stores);
      }

      // 2. Funnel Analytics
      const statsRes = await fetch(`/api/analytics?storeId=${selectedStore}`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // 3. Vouchers
      const vchRes = await fetch("/api/vouchers");
      const vchData = await vchRes.json();
      if (vchData.success) {
        setVouchers(vchData.vouchers);
      }
    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [selectedStore]);

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
              Marketing & Ops Control
            </h1>
            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-brand-dark text-brand-yellow uppercase">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            (activeTab as any) === "sheets"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Google Sheets Sync</span>
        </button>
      </div>

      {/* Google Sheets Lead Sync Banner when on Vouchers tab */}
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
