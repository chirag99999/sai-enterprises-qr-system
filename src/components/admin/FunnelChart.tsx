"use client";

import React from "react";
import { FunnelStats } from "@/lib/types";
import {
  TrendingUp,
  Users,
  Smartphone,
  Star,
  CheckCircle,
  Ticket,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface FunnelChartProps {
  stats: FunnelStats;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ stats }) => {
  const steps = [
    {
      title: "Welcome Views",
      count: stats.welcomeViews,
      icon: Users,
      color: "bg-blue-50 text-brand-blue-dark border-brand-blue/30",
      dropoff: `${stats.conversionRates.claimStartRate}% Started Claim`,
    },
    {
      title: "Claim Starts",
      count: stats.claimStarts,
      icon: TrendingUp,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      dropoff: `${stats.conversionRates.mobileCaptureRate}% Submitted Phone`,
    },
    {
      title: "Mobile Captured",
      count: stats.phoneCaptures,
      icon: Smartphone,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dropoff: `${stats.conversionRates.reviewCtaRate}% Clicked Review`,
    },
    {
      title: "Review CTA Opened",
      count: stats.reviewOpens,
      icon: Star,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dropoff: `${stats.conversionRates.completionRate}% Confirmed Review`,
    },
    {
      title: "Vouchers Issued",
      count: stats.vouchersIssued,
      icon: Ticket,
      color: "bg-brand-yellow/30 text-brand-dark border-brand-yellow-dark/40",
      dropoff: `${stats.conversionRates.redemptionRate}% Redeemed at POS`,
    },
    {
      title: "Redeemed at Counter",
      count: stats.vouchersRedeemed,
      icon: Receipt,
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      dropoff: `Final Converted Orders`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* High-level Funnel KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard className="p-4 sm:p-5 border border-white">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Mobile Capture Rate
          </span>
          <div className="text-2xl sm:text-3xl font-black text-brand-dark mt-1">
            {stats.conversionRates.mobileCaptureRate}%
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            {stats.phoneCaptures} of {stats.claimStarts} visitors
          </p>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 border border-white">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Review Completion
          </span>
          <div className="text-2xl sm:text-3xl font-black text-brand-dark mt-1">
            {stats.conversionRates.completionRate}%
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            {stats.reviewCompletions} verified reviews
          </p>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 border border-white">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Counter Redemption
          </span>
          <div className="text-2xl sm:text-3xl font-black text-brand-dark mt-1">
            {stats.conversionRates.redemptionRate}%
          </div>
          <p className="text-[11px] text-neutral-500 font-bold mt-1">
            {stats.vouchersRedeemed} total redemptions
          </p>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 border border-white">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Discounts Granted
          </span>
          <div className="text-2xl sm:text-3xl font-black text-brand-dark mt-1">
            ₹{stats.totalDiscountsGranted.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-indigo-600 font-bold mt-1">
            Est. Sales: ₹{stats.totalEstimatedOrders.toLocaleString("en-IN")}
          </p>
        </GlassCard>
      </div>

      {/* Funnel Progress Sequence */}
      <GlassCard elevated className="p-6">
        <h3 className="text-base font-extrabold text-brand-dark mb-4">
          Customer In-Store Conversion Funnel
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const percentageOfTotal =
              stats.welcomeViews > 0
                ? Math.round((step.count / stats.welcomeViews) * 100)
                : 0;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${step.color} flex flex-col justify-between relative`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 opacity-80" />
                    <span className="text-xs font-extrabold opacity-70">
                      Step {idx + 1}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black">{step.count}</div>
                  <div className="text-xs font-bold mt-0.5">{step.title}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-current/20 text-[11px] font-semibold opacity-90 leading-tight">
                  {step.dropoff}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
