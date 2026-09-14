"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  ExternalLink,
  Download,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  AlertCircle,
  Code2,
  RefreshCw,
  Save,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GOOGLE_SHEET_URL } from "@/lib/constants";

export const GoogleSheetSyncCard: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [savedUrl, setSavedUrl] = useState<string>("");
  const [savingUrl, setSavingUrl] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [testingWebhook, setTestingWebhook] = useState<boolean>(false);
  const [syncingAll, setSyncingAll] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showScript, setShowScript] = useState<boolean>(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/campaign");
        const data = await res.json();
        if (data.success && data.campaign?.googleSheetWebhookUrl) {
          setWebhookUrl(data.campaign.googleSheetWebhookUrl);
          setSavedUrl(data.campaign.googleSheetWebhookUrl);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadConfig();
  }, []);

  const appsScriptCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // If first row is empty, create bold headers
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", 
      "Customer Mobile", 
      "Store Location", 
      "Store Code", 
      "Voucher Code", 
      "Reward (INR)", 
      "Status", 
      "Consent", 
      "Capture Source"
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#F1EA99");
  }
  
  // Append new lead from QR Kiosk
  sheet.appendRow([
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    "+91" + data.phone,
    data.storeName || "Sai Enterprises",
    data.storeCode || "SAI-MG-01",
    data.voucherCode || "SAI500",
    data.voucherValue || 500,
    data.status || "ACTIVE",
    data.marketingConsent || "YES",
    data.source || "In-Store QR Kiosk"
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveWebhook = async () => {
    setSavingUrl(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/campaign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleSheetWebhookUrl: webhookUrl.trim() }),
      });
      const data = await res.json();
      setSavingUrl(false);
      if (data.success) {
        setSavedUrl(webhookUrl.trim());
        setTestResult({
          success: true,
          message: "Webhook URL saved! Future QR lead submissions will auto-append to your sheet.",
        });
      }
    } catch (e: any) {
      setSavingUrl(false);
      setTestResult({ success: false, message: e.message || "Failed to save webhook." });
    }
  };

  const handleTestSync = async () => {
    if (!webhookUrl.trim()) return;
    setTestingWebhook(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          lead: {
            timestamp: new Date().toISOString(),
            phone: "9845012345",
            storeName: "Sai Enterprises - Flagship Tech World",
            storeCode: "SAI-MG-01",
            voucherCode: "SAI500-LIVE01",
            voucherValue: 500,
            status: "ACTIVE",
            marketingConsent: "YES",
            source: "Live Test Sync",
          },
        }),
      });
      const data = await res.json();
      setTestingWebhook(false);
      if (data.success) {
        setTestResult({
          success: true,
          message: "Success! Verified test lead sent to your Google Sheet.",
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || "Could not reach webhook. Please verify your Apps Script deployment.",
        });
      }
    } catch (e: any) {
      setTestingWebhook(false);
      setTestResult({
        success: false,
        message: e.message || "Network test failed.",
      });
    }
  };

  return (
    <GlassCard elevated className="p-6 border-2 border-emerald-500/20 bg-white/95">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-brand-dark text-base">
                Google Sheets Lead Capture & Sync
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Connected
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Live Spreadsheet: <span className="font-bold text-neutral-700">Sai Enterprises QR lead</span>
            </p>
          </div>
        </div>

        <a
          href={GOOGLE_SHEET_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <span>Open Live Google Sheet</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Sync Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Method 1: Instant CSV Export */}
        <div className="p-4 rounded-2xl bg-brand-surface border border-neutral-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-brand-dark uppercase">
                Method A: Direct Lead CSV Export
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white font-bold text-neutral-600">
                Ready Now
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
              Download all captured phone numbers, voucher codes, stores, and timestamps pre-formatted for direct copy-paste or file import into your Google Sheet.
            </p>
          </div>

          <a
            href="/api/leads?format=csv"
            className="w-full py-2.5 px-4 rounded-xl bg-brand-dark hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95 text-center"
          >
            <Download className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Download Formatted Leads CSV</span>
          </a>
        </div>

        {/* Method 2: Real-Time Apps Script Webhook */}
        <div className="p-4 rounded-2xl bg-brand-surface border border-neutral-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-brand-dark uppercase">
                Method B: Automated Sheet Webhook
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 font-bold text-emerald-800">
                Real-Time
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-2 leading-relaxed">
              Every customer mobile submission & voucher unlock instantly appends a new row in your Google Sheet in the background.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="Paste Google Apps Script Web App URL..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleSaveWebhook}
                disabled={savingUrl || !webhookUrl.trim()}
                className="px-3 py-2 rounded-xl bg-brand-dark hover:bg-black text-brand-yellow text-xs font-bold transition flex items-center gap-1 disabled:opacity-40"
                title="Save Webhook to System"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={handleTestSync}
                disabled={testingWebhook || !webhookUrl.trim()}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-40"
                title="Send Test Row"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Test</span>
              </button>
            </div>
            {savedUrl && (
              <span className="text-[10px] text-emerald-700 font-semibold block">
                Active Webhook Configured: {savedUrl.slice(0, 45)}...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Test Status Banner */}
      {testResult && (
        <div
          className={`p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-2 ${
            testResult.success
              ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
              : "bg-red-50 text-red-800 border border-red-300"
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Step-by-Step Instructions */}
      <div className="pt-3 border-t border-neutral-200/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-neutral-700 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-brand-blue" />
            <span>How to Enable Automated Real-Time Appending (10 Seconds)</span>
          </span>
          <button
            type="button"
            onClick={handleCopyScript}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-[11px] font-bold transition active:scale-95"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>

        <ol className="list-decimal list-inside text-xs text-neutral-600 space-y-1 mb-3">
          <li>
            In your Google Sheet, click <strong className="text-brand-dark">Extensions &gt; Apps Script</strong>.
          </li>
          <li>
            Replace any code with the script below and click <strong className="text-brand-dark">Save</strong>.
          </li>
          <li>
            Click <strong className="text-brand-dark">Deploy &gt; New deployment</strong>, select type <strong className="text-brand-dark">Web app</strong>, set <em>Who has access</em> to <strong className="text-emerald-700">Anyone</strong>, and click Deploy.
          </li>
          <li>
            Copy the generated <em>Web app URL</em>, paste it in the box above, and click <strong className="text-brand-dark">Save</strong>.
          </li>
        </ol>

        <div className="p-3.5 rounded-2xl bg-neutral-900 text-neutral-200 text-xs font-mono relative">
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
            {appsScriptCode}
          </pre>
        </div>
      </div>
    </GlassCard>
  );
};
