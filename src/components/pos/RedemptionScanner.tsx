"use client";

import React, { useState } from "react";
import { Voucher, Store } from "@/lib/types";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ban,
  Receipt,
  ArrowRight,
  Sparkles,
  QrCode,
  Store as StoreIcon,
  Phone,
  Calendar,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface RedemptionScannerProps {
  currentStore: Store | null;
  stores: Store[];
  onSelectStore: (s: Store) => void;
}

export const RedemptionScanner: React.FC<RedemptionScannerProps> = ({
  currentStore,
  stores,
  onSelectStore,
}) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Redemption action state
  const [orderRef, setOrderRef] = useState<string>("");
  const [redeemLoading, setRedeemLoading] = useState<boolean>(false);
  const [redeemResult, setRedeemResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setSearchError(null);
    setRedeemResult(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SEARCH", query: q }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.voucher) {
        setVoucher(data.voucher);
      } else {
        setVoucher(null);
        setSearchError(data.message || "No voucher found matching that search.");
      }
    } catch (e: any) {
      setLoading(false);
      setSearchError(e.message || "Search request failed.");
    }
  };

  const handleRedeem = async () => {
    if (!voucher) return;

    setRedeemLoading(true);
    setRedeemResult(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REDEEM",
          code: voucher.code,
          storeId: currentStore?.id || "store-101",
          posOrderRef: orderRef || `POS-${Date.now().toString().slice(-4)}`,
        }),
      });
      const data = await res.json();
      setRedeemLoading(false);

      if (data.success && data.voucher) {
        setVoucher(data.voucher);
        setRedeemResult({
          success: true,
          message: data.message,
        });
      } else {
        setRedeemResult({
          success: false,
          message: data.message || "Redemption could not be completed.",
        });
        if (data.voucher) {
          setVoucher(data.voucher);
        }
      }
    } catch (e: any) {
      setRedeemLoading(false);
      setRedeemResult({
        success: false,
        message: e.message || "Redemption network error",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Store & Terminal Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white/80 border border-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-brand-dark text-base">
              POS Counter Redemption
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Verify customer vouchers & prevent duplicate claims
            </p>
          </div>
        </div>

        {/* Store selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-brand-surface border border-neutral-200 text-xs font-bold">
          <StoreIcon className="w-3.5 h-3.5 text-brand-blue" />
          <select
            value={currentStore?.id || ""}
            onChange={(e) => {
              const s = stores.find((x) => x.id === e.target.value);
              if (s) onSelectStore(s);
            }}
            className="bg-transparent border-none focus:outline-none cursor-pointer text-neutral-800"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input Box */}
      <GlassCard elevated className="p-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
          Enter Voucher Code or Customer Mobile
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. SAI500-3L9M7V or 9845012345"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-neutral-300 font-mono font-bold text-sm tracking-wide text-brand-dark focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none shadow-inner"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="py-3.5 px-6 rounded-2xl bg-brand-dark hover:bg-black text-white font-extrabold text-sm tracking-wide transition shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Look Up</span>
            )}
          </button>
        </div>

        {/* Quick Test Codes */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-400 font-semibold">Quick test codes:</span>
          <button
            type="button"
            onClick={() => {
              setQuery("SAI500-3L9M7V");
              handleSearch("SAI500-3L9M7V");
            }}
            className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-brand-dark font-mono font-bold border border-neutral-200 transition"
          >
            SAI500-3L9M7V (Active)
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("FOOD500-Q7VFWQ");
              handleSearch("FOOD500-Q7VFWQ");
            }}
            className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-emerald-700 font-mono font-bold border border-emerald-200 transition"
          >
            FOOD500-Q7VFWQ (Just Minted)
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("SAI500-8X4K2P");
              handleSearch("SAI500-8X4K2P");
            }}
            className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-neutral-600 font-mono font-bold border border-neutral-200 transition"
          >
            SAI500-8X4K2P (Redeemed)
          </button>
        </div>

        {/* Error message */}
        {searchError && (
          <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs font-bold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </GlassCard>

      {/* Voucher Inspection Card */}
      {voucher && (
        <GlassCard elevated className="p-6 border-2 border-white bg-white/90">
          <div className="flex items-start justify-between pb-4 border-b border-neutral-200/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black tracking-wider text-brand-dark">
                  {voucher.code}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    voucher.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : voucher.status === "REDEEMED"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {voucher.status}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                Issued for Campaign: In-Store Review & ₹500 Reward Sprint
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-neutral-400 uppercase">
                Discount
              </span>
              <div className="text-2xl font-black text-brand-dark">
                ₹{voucher.value}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-xs">
            <div className="p-3 rounded-2xl bg-brand-surface border border-neutral-200">
              <div className="text-neutral-400 font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>Customer Phone</span>
              </div>
              <div className="font-mono font-bold text-brand-dark text-sm">
                +91 {voucher.phone}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-brand-surface border border-neutral-200">
              <div className="text-neutral-400 font-bold mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Expires At</span>
              </div>
              <div className="font-bold text-brand-dark text-sm">
                {new Date(voucher.expiresAt).toLocaleDateString()}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-brand-surface border border-neutral-200 col-span-2 sm:col-span-1">
              <div className="text-neutral-400 font-bold mb-1 flex items-center gap-1">
                <Receipt className="w-3 h-3" />
                <span>Min Order Spend</span>
              </div>
              <div className="font-bold text-brand-dark text-sm">
                ₹{voucher.minOrderValue}
              </div>
            </div>
          </div>

          {/* Redemption Details if already redeemed */}
          {voucher.status === "REDEEMED" && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-4">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Already Redeemed</span>
              </div>
              <p>
                This voucher was marked redeemed on{" "}
                <span className="font-bold">
                  {new Date(voucher.redeemedAt!).toLocaleString()}
                </span>{" "}
                under bill reference{" "}
                <span className="font-mono font-bold">
                  {voucher.posOrderRef || "Counter"}
                </span>
                . It cannot be used again.
              </p>
            </div>
          )}

          {/* Redemption Result Banner */}
          {redeemResult && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2 ${
                redeemResult.success
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                  : "bg-red-50 border border-red-300 text-red-800"
              }`}
            >
              {redeemResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{redeemResult.message}</span>
            </div>
          )}

          {/* Action Section for Active Voucher */}
          {voucher.status === "ACTIVE" && (
            <div className="pt-2 border-t border-neutral-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">
                  POS Order / Invoice Reference (Optional)
                </label>
                <input
                  type="text"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder="e.g. BILL-9842 or KITCHEN-12"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono font-bold text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <button
                onClick={handleRedeem}
                disabled={redeemLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2 active:scale-98"
              >
                {redeemLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply ₹{voucher.value} Discount & Mark Redeemed</span>
                  </>
                )}
              </button>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};
