"use client";

import React from "react";
import { Campaign } from "@/lib/types";
import { X, ShieldCheck, CheckCircle2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface TermsModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  campaign,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <GlassCard
        elevated
        className="max-w-lg w-full p-6 md:p-8 bg-white/95 relative shadow-2xl border border-white"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-yellow/50 text-brand-dark">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-brand-dark">
                Campaign Terms & Validity
              </h3>
              <p className="text-xs text-neutral-500">
                ₹{campaign.rewardAmount} Voucher Program Rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-3.5 text-sm text-neutral-700">
          <div className="p-3.5 rounded-2xl bg-brand-surface border border-neutral-200/80 flex items-center justify-between">
            <span className="font-semibold text-neutral-600">Reward Value:</span>
            <span className="font-bold text-base text-brand-dark">
              ₹{campaign.rewardAmount} OFF
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-brand-surface border border-neutral-200/80 flex items-center justify-between">
            <span className="font-semibold text-neutral-600">Minimum Order:</span>
            <span className="font-bold text-brand-dark">
              ₹{campaign.minOrderValue}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-brand-surface border border-neutral-200/80 flex items-center justify-between">
            <span className="font-semibold text-neutral-600">Validity Period:</span>
            <span className="font-bold text-brand-dark">
              {campaign.validDays} Days from issuance
            </span>
          </div>

          <div className="pt-2">
            <h4 className="font-semibold text-xs text-neutral-400 uppercase tracking-wider mb-2">
              Key Guidelines
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              {campaign.terms.map((term, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-brand-dark hover:bg-black text-white font-bold text-sm tracking-wide shadow-md transition active:scale-[0.98]"
          >
            I Understand & Agree
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
