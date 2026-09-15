"use client";

import React, { useState, useEffect } from "react";
import { Store } from "@/lib/types";
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  Store as StoreIcon,
  Smartphone,
  LayoutDashboard,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";

interface KioskHeaderProps {
  currentStore: Store | null;
  stores: Store[];
  onSelectStore: (store: Store) => void;
  onReset: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  currentStore,
  stores,
  onSelectStore,
  onReset,
}) => {
  const [time, setTime] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="w-full px-3.5 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between z-20 shrink-0 gap-2">
      {/* Brand Identity & Store Badge */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link href="/" className="shrink-0 flex items-center">
          <img
            src="/brand_logo.png"
            alt="New SaiKeshav Enterprises"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </Link>
        <div className="min-w-0 hidden sm:block">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold tracking-tight text-sm sm:text-base text-brand-dark truncate">
              New SaiKeshav Enterprises
            </span>
            <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-amber-100 font-bold text-amber-900 border border-amber-300 items-center gap-1 shrink-0">
              <Smartphone className="w-2.5 h-2.5 text-amber-700" />
              <span>Roxy Road, Baripada</span>
            </span>
          </div>
          {/* Store Switcher */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-neutral-600 font-medium">
            <StoreIcon className="w-3 h-3 text-brand-blue shrink-0" />
            <select
              value={currentStore?.id || ""}
              onChange={(e) => {
                const s = stores.find((x) => x.id === e.target.value);
                if (s) onSelectStore(s);
              }}
              className="bg-transparent font-semibold text-brand-dark border-none focus:outline-none cursor-pointer py-0.5 truncate max-w-[150px] sm:max-w-[240px]"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Center Live Clock (hidden on mobile, shown on tablet/desktop) */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/75 border border-white/90 shadow-sm text-xs font-semibold text-neutral-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{time || "Live"}</span>
        <span className="text-neutral-300">|</span>
        <span className="text-neutral-500">In-Store</span>
      </div>

      {/* Quick Actions (Responsive for Phone & Desktop) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* POS Link: icon on mobile, icon+text on tablet/desktop */}
        <Link
          href="/pos"
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-semibold text-neutral-800 border border-white/90 shadow-sm transition active:scale-95"
          title="Staff POS Counter Redemption"
        >
          <ReceiptText className="w-4 h-4 text-brand-blue" />
          <span className="hidden md:inline">POS</span>
        </Link>

        {/* Admin Link */}
        <Link
          href="/admin"
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-semibold text-neutral-800 border border-white/90 shadow-sm transition active:scale-95"
          title="Admin & Analytics Portal"
        >
          <LayoutDashboard className="w-4 h-4 text-brand-blue" />
          <span className="hidden md:inline">Admin</span>
        </Link>

        {/* Reset Kiosk */}
        <button
          onClick={onReset}
          className="p-2 sm:p-2.5 rounded-xl bg-white/70 hover:bg-white text-neutral-700 hover:text-brand-dark border border-white/90 shadow-sm transition active:scale-95"
          title="Reset Session"
        >
          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Fullscreen Toggle (hidden on small phone viewports where browser handles it) */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2.5 rounded-xl bg-white/70 hover:bg-white text-neutral-700 hover:text-brand-dark border border-white/90 shadow-sm transition active:scale-95"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
