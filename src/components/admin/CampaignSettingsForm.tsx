"use client";

import React, { useState } from "react";
import { Campaign, Store } from "@/lib/types";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Settings,
  Link as LinkIcon,
  Tag,
  DollarSign,
  ShieldAlert,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface CampaignSettingsFormProps {
  initialCampaign: Campaign;
  stores: Store[];
  onSaved: (updated: Campaign) => void;
}

export const CampaignSettingsForm: React.FC<CampaignSettingsFormProps> = ({
  initialCampaign,
  stores,
  onSaved,
}) => {
  const [formData, setFormData] = useState<Campaign>(initialCampaign);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/campaign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setSaving(false);

      if (data.success && data.campaign) {
        setStatusMsg({
          type: "success",
          text: "Campaign settings saved and updated across all kiosks immediately!",
        });
        onSaved(data.campaign);
      } else {
        setStatusMsg({
          type: "error",
          text: data.error || "Failed to update campaign",
        });
      }
    } catch (err: any) {
      setSaving(false);
      setStatusMsg({
        type: "error",
        text: err.message || "Network error occurred",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GlassCard elevated className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-dark text-brand-yellow">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-dark text-base">
                Campaign Rules & Reward Economics
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Configure voucher values, expiration, and store boundaries
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-5 rounded-xl bg-brand-dark hover:bg-black text-brand-yellow font-extrabold text-xs tracking-wide shadow-md transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>

        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                : "bg-red-50 border border-red-300 text-red-800"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Section 1: Reward & Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
              Reward Amount (₹)
            </label>
            <input
              type="number"
              value={formData.rewardAmount}
              onChange={(e) =>
                setFormData({ ...formData, rewardAmount: Number(e.target.value) })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 font-bold text-sm text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Default ₹500 voucher
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
              Minimum Order Spend (₹)
            </label>
            <input
              type="number"
              value={formData.minOrderValue}
              onChange={(e) =>
                setFormData({ ...formData, minOrderValue: Number(e.target.value) })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 font-bold text-sm text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Protects unit economics
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
              Validity (Days)
            </label>
            <input
              type="number"
              value={formData.validDays}
              onChange={(e) =>
                setFormData({ ...formData, validDays: Number(e.target.value) })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 font-bold text-sm text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Days until code expires
            </span>
          </div>
        </div>

        {/* Section 2: Copy & Messaging */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
              Kiosk Main Headline
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) =>
                setFormData({ ...formData, headline: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 font-medium text-sm text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
              Kiosk Subheadline
            </label>
            <input
              type="text"
              value={formData.subheadline}
              onChange={(e) =>
                setFormData({ ...formData, subheadline: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 font-medium text-sm text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              required
            />
          </div>
        </div>

        {/* Section 3: Review & Social URLs */}
        <div className="pt-4 border-t border-neutral-200/80 mb-6">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-brand-blue" />
            <span>Destination URLs & External Actions</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-600 mb-1">
                Google Review Destination URL
              </label>
              <input
                type="url"
                value={formData.reviewUrl}
                onChange={(e) =>
                  setFormData({ ...formData, reviewUrl: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-mono text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
                required
              />
              <span className="text-[11px] text-neutral-400 mt-0.5 block">
                Direct link or QR scan target for Google reviews
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      instagram: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.youtube}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      youtube: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      facebook: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">
                Digital Food Menu URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.menuUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      menuUrl: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Anti-Abuse & Guardrails */}
        <div className="pt-4 border-t border-neutral-200/80">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Fraud Prevention & Rate Limiting</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">
                Daily Redemption Cap per Store
              </label>
              <input
                type="number"
                value={formData.dailyCapPerStore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyCapPerStore: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="otpReq"
                checked={formData.otpRequired}
                onChange={(e) =>
                  setFormData({ ...formData, otpRequired: e.target.checked })
                }
                className="w-4 h-4 rounded text-brand-dark focus:ring-brand-blue border-neutral-300"
              />
              <label htmlFor="otpReq" className="text-xs font-bold text-neutral-700">
                Require SMS OTP verification (Recommended OFF for low in-store friction)
              </label>
            </div>
          </div>
        </div>
      </GlassCard>
    </form>
  );
};
