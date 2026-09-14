"use client";

import React from "react";
import {
  Smartphone,
  Headphones,
  Watch,
  Zap,
  Wifi,
  BatteryCharging,
  ShieldCheck,
  Sparkles,
  Flame,
} from "lucide-react";

export const GadgetAnimation: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl h-44 sm:h-60 mx-auto flex items-center justify-center select-none pointer-events-none my-1 sm:my-2 px-2">
      {/* Background Soft Ambient Glow */}
      <div className="absolute w-52 sm:w-72 h-36 sm:h-44 rounded-full bg-brand-blue/25 blur-3xl -top-2 -left-4 animate-pulse-glow" />
      <div className="absolute w-48 sm:w-64 h-32 sm:h-40 rounded-full bg-brand-yellow/30 blur-3xl -bottom-2 -right-4 animate-pulse-glow" />

      {/* CENTERPIECE: Flagship 5G Smartphone */}
      <div className="relative z-10 animate-gadget-float flex flex-col items-center">
        {/* Phone Body */}
        <div className="w-28 sm:w-40 h-40 sm:h-56 rounded-[26px] sm:rounded-[34px] bg-gradient-to-b from-neutral-800 to-neutral-950 p-1.5 sm:p-2 shadow-2xl border-[2px] sm:border-[2.5px] border-neutral-600/80 relative flex flex-col items-center overflow-hidden animate-screen-glow">
          {/* Dynamic Island */}
          <div className="w-10 sm:w-16 h-2.5 sm:h-3.5 bg-black rounded-full mb-1 z-20 flex items-center justify-between px-1.5 sm:px-2 shadow-inner">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-neutral-800" />
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500/80 animate-ping" />
          </div>

          {/* Screen Content */}
          <div className="w-full flex-1 rounded-[18px] sm:rounded-[24px] bg-gradient-to-b from-[#111e29] via-[#0b141d] to-[#1c1a0e] p-1.5 sm:p-2.5 flex flex-col justify-between relative overflow-hidden">
            {/* Status bar */}
            <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-white/80 px-1">
              <span>12:45</span>
              <div className="flex items-center gap-1 text-[7px] sm:text-[8px]">
                <Wifi className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white/90" />
                <span>5G</span>
                <BatteryCharging className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
              </div>
            </div>

            {/* Notification Badge */}
            <div className="my-auto py-1 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg text-center">
              <div className="flex items-center justify-center gap-0.5 text-[8px] sm:text-[10px] font-black text-brand-yellow uppercase tracking-wider">
                <Sparkles className="w-2 h-2" />
                <span>Sai Enterprises</span>
              </div>
              <div className="text-[10px] sm:text-xs font-black text-white mt-0.5">
                ₹500 OFF UNLOCKED
              </div>
              <div className="hidden sm:block text-[8px] text-white/80 font-medium">
                Tap Kiosk to Claim
              </div>
            </div>

            {/* Quick App Dock */}
            <div className="flex items-center justify-around py-0.5 sm:py-1 px-1 sm:px-2 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md bg-brand-blue/80 flex items-center justify-center text-[6px] sm:text-[7px] text-white font-bold">
                📱
              </span>
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md bg-amber-400/80 flex items-center justify-center text-[6px] sm:text-[7px] text-white font-bold">
                🎧
              </span>
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md bg-emerald-500/80 flex items-center justify-center text-[6px] sm:text-[7px] text-white font-bold">
                ⚡
              </span>
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md bg-purple-500/80 flex items-center justify-center text-[6px] sm:text-[7px] text-white font-bold">
                ⌚
              </span>
            </div>
          </div>
        </div>

        <span className="mt-1 text-[8px] sm:text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
          Flagship Series
        </span>
      </div>

      {/* LEFT SATELLITE: Smartwatch */}
      <div className="absolute left-1 sm:left-10 top-4 sm:top-5 z-20 animate-gadget-float-delayed flex flex-col items-center">
        <div className="w-20 sm:w-26 h-20 sm:h-26 rounded-2xl sm:rounded-3xl bg-neutral-900 border-[1.5px] sm:border-[2px] border-neutral-600/70 p-1.5 sm:p-2 shadow-xl flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
          <div className="w-full flex-1 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-neutral-950 to-neutral-800 p-1.5 sm:p-2 flex flex-col justify-between border border-white/10">
            <div className="flex items-center justify-between text-[7px] sm:text-[8px] text-neutral-400 font-bold">
              <Watch className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-brand-yellow" />
              <span className="text-emerald-400 font-mono">78 BPM</span>
            </div>

            <div className="text-center my-0.5">
              <div className="text-[10px] sm:text-xs font-black text-white font-mono">
                10,420
              </div>
              <div className="text-[6px] sm:text-[7px] font-bold uppercase text-brand-yellow tracking-wider">
                Steps
              </div>
            </div>

            <div className="w-full bg-neutral-700/50 h-1 sm:h-1.5 rounded-full overflow-hidden flex">
              <div className="w-3/4 bg-brand-yellow h-full" />
              <div className="w-1/4 bg-brand-blue h-full" />
            </div>
          </div>
        </div>

        <span className="mt-1 text-[7px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-white/85 border border-neutral-200 text-neutral-700 shadow-2xs">
          Smartwatches
        </span>
      </div>

      {/* RIGHT SATELLITE: Wireless Audio & Fast Charge */}
      <div className="absolute right-1 sm:right-10 top-5 sm:top-6 z-20 animate-gadget-float flex flex-col items-center">
        <div className="w-18 sm:w-22 h-14 sm:h-18 rounded-2xl bg-gradient-to-b from-white via-neutral-100 to-neutral-200 border border-white shadow-xl flex flex-col items-center justify-center relative p-1">
          <div className="w-full h-0.5 bg-neutral-300 absolute top-5" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow mb-0.5 animate-pulse" />
          <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
          <span className="text-[7px] sm:text-[8px] font-black text-neutral-600 mt-0.5">
            Hi-Res Audio
          </span>
        </div>

        <div className="w-12 sm:w-14 h-5 sm:h-6 rounded-full bg-gradient-to-r from-brand-yellow/60 via-white to-brand-yellow/60 border border-brand-yellow-dark/40 shadow-sm flex items-center justify-center gap-0.5 mt-1 sm:mt-1.5">
          <Zap className="w-2.5 h-2.5 text-brand-dark fill-brand-dark animate-bounce" />
          <span className="text-[7px] font-black text-brand-dark uppercase">
            65W Fast
          </span>
        </div>

        <span className="mt-1 text-[7px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-white/85 border border-neutral-200 text-neutral-700 shadow-2xs">
          Audio & Gear
        </span>
      </div>
    </div>
  );
};
