"use client";

import React, { useState } from "react";
import { Voucher, Store } from "@/lib/types";
import {
  Download,
  Search,
  CheckCircle2,
  Clock,
  Ban,
  Calendar,
  Phone,
  Ticket,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface VoucherTableProps {
  vouchers: Voucher[];
  stores: Store[];
}

export const VoucherTable: React.FC<VoucherTableProps> = ({
  vouchers,
  stores,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = vouchers.filter((v) => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "ALL" ? true : v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStoreName = (storeId: string) => {
    const s = stores.find((x) => x.id === storeId);
    return s ? s.name : storeId;
  };

  const exportCsv = () => {
    const headers = [
      "Voucher Code",
      "Value (INR)",
      "Status",
      "Customer Phone",
      "Store ID",
      "Issued At",
      "Expires At",
      "Redeemed At",
      "POS Order Ref",
    ];

    const rows = filtered.map((v) => [
      v.code,
      v.value,
      v.status,
      `+91${v.phone}`,
      v.storeId,
      v.issuedAt,
      v.expiresAt,
      v.redeemedAt || "",
      v.posOrderRef || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vouchers_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GlassCard elevated className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 mb-4">
        <div>
          <h3 className="font-extrabold text-brand-dark text-base flex items-center gap-2">
            <Ticket className="w-4 h-4 text-brand-blue" />
            <span>Voucher Audit Ledger & Activity Log</span>
          </h3>
          <p className="text-xs text-neutral-500 font-medium">
            Track all {vouchers.length} issued codes, customer identities, and redemption states
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="py-2 px-4 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-xs font-bold text-neutral-700 shadow-xs flex items-center gap-2 transition active:scale-95 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-brand-blue" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code or phone number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-brand-dark focus:ring-2 focus:ring-brand-blue outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-brand-surface p-1 rounded-xl border border-neutral-200 text-xs font-bold">
          {["ALL", "ACTIVE", "REDEEMED", "EXPIRED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === st
                  ? "bg-brand-dark text-white shadow-xs"
                  : "text-neutral-600 hover:text-brand-dark"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-brand-surface text-neutral-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">Voucher Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Customer Phone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Issued Date</th>
              <th className="py-3 px-4">Redeemed At</th>
              <th className="py-3 px-4">POS Bill Ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400 font-medium">
                  No vouchers found matching search filters.
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} className="hover:bg-neutral-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-brand-dark">
                    {v.code}
                  </td>
                  <td className="py-3 px-4 font-black text-brand-dark">
                    ₹{v.value}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-700">
                    +91 {v.phone.slice(0, 3)}****{v.phone.slice(-3)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        v.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : v.status === "REDEEMED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-500">
                    {new Date(v.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">
                    {v.redeemedAt
                      ? new Date(v.redeemedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-600">
                    {v.posOrderRef || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
