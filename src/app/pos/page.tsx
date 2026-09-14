"use client";

import React, { useState, useEffect } from "react";
import { Store } from "@/lib/types";
import { DEFAULT_STORES } from "@/lib/seed-data";
import { RedemptionScanner } from "@/components/pos/RedemptionScanner";
import Link from "next/link";
import { ArrowLeft, Store as StoreIcon, ShieldCheck, LayoutDashboard } from "lucide-react";

export default function PosPage() {
  const [stores, setStores] = useState<Store[]>(DEFAULT_STORES);
  const [currentStore, setCurrentStore] = useState<Store | null>(DEFAULT_STORES[0]);

  useEffect(() => {
    async function loadStores() {
      try {
        const res = await fetch("/api/campaign");
        const data = await res.json();
        if (data.success && data.stores && data.stores.length > 0) {
          setStores(data.stores);
          setCurrentStore(data.stores[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStores();
  }, []);

  return (
    <main className="min-h-screen flex flex-col p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Top Navbar */}
      <header className="w-full flex items-center justify-between pb-6 mb-4 border-b border-neutral-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-neutral-700 border border-neutral-200 shadow-sm transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kiosk Mode</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-brand-dark">
              Staff POS Terminal
            </span>
            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-brand-yellow text-brand-dark uppercase">
              Counter Mode
            </span>
          </div>
        </div>

        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-neutral-700 border border-neutral-200 shadow-sm transition"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-brand-blue" />
          <span>Admin & Analytics</span>
        </Link>
      </header>

      {/* Main Redemption Tool */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <RedemptionScanner
          currentStore={currentStore}
          stores={stores}
          onSelectStore={(s) => setCurrentStore(s)}
        />
      </div>

      <footer className="w-full py-4 text-center text-xs text-neutral-400 font-medium">
        Sai Enterprises Counter POS System • Real-Time Voucher Validation
      </footer>
    </main>
  );
}
