import { getCampaign, getAllVouchers, getStores } from "./db";

export interface LeadRecord {
  timestamp: string;
  phone: string;
  storeName: string;
  storeCode: string;
  voucherCode: string;
  voucherValue: number;
  status: string;
  marketingConsent: string;
  source: string;
}

export const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1F8t-XiG6khQjM8ql6IjqJUImKUnfCdQc1hVn77OTMSg/edit?usp=sharing";

export const GOOGLE_SHEET_ID = "1F8t-XiG6khQjM8ql6IjqJUImKUnfCdQc1hVn77OTMSg";

/**
 * Dispatches a newly captured lead to the configured Google Sheet Webhook (if set up)
 */
export async function syncLeadToGoogleSheet(
  lead: LeadRecord,
  webhookUrl?: string
): Promise<{ success: boolean; error?: string }> {
  let targetUrl = webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!targetUrl) {
    try {
      const camp = getCampaign();
      targetUrl = camp.googleSheetWebhookUrl;
    } catch {
      // ignore
    }
  }

  if (!targetUrl) {
    return { success: true };
  }

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      redirect: "follow",
    });
    const bodyText = await res.text();
    const isSuccess = res.ok || res.status === 302 || res.status === 200;
    if (!isSuccess || bodyText.includes("accounts.google.com") || bodyText.includes("Sign in")) {
      console.error(
        `[GoogleSheetSync] Webhook failed (status ${res.status}): ${bodyText.slice(0, 300)}`
      );
      return {
        success: false,
        error: `Webhook returned status ${res.status} (Authentication or permission issue).`,
      };
    }
    return { success: true };
  } catch (err: any) {
    console.warn("Could not push lead to Google Sheet webhook:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Returns formatted CSV data matching the Google Sheet columns for direct 1-click import
 */
export function generateGoogleSheetCsv(vouchers: any[], stores: any[]): string {
  const headers = [
    "Timestamp",
    "Customer Mobile",
    "Store Location",
    "Store Code",
    "Voucher Code",
    "Reward Value (INR)",
    "Voucher Status",
    "Marketing Consent",
    "Capture Source",
    "Redeemed At",
    "POS Bill Reference",
  ];

  const rows = vouchers.map((v) => {
    const store = stores.find((s) => s.id === v.storeId);
    const storeName = store ? store.name : v.storeId;
    const storeCode = store ? store.code : "";
    const dateFormatted = new Date(v.issuedAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    return [
      `"${dateFormatted}"`,
      `"+91${v.phone}"`,
      `"${storeName}"`,
      `"${storeCode}"`,
      `"${v.code}"`,
      v.value,
      `"${v.status}"`,
      `"YES"`,
      `"In-Store QR Kiosk"`,
      v.redeemedAt
        ? `"${new Date(v.redeemedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}"`
        : `""`,
      `"${v.posOrderRef || ""}"`,
    ];
  });

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
