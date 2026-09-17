import { NextResponse } from "next/server";
import { issueVoucherForSession, recordEvent } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { sessionId, phone, storeId } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required to unlock voucher" },
        { status: 400 }
      );
    }

    const currentSessionId = sessionId || `sess-${Date.now()}`;
    const currentStoreId = storeId || "store-101";

    // Record the confirmation event
    recordEvent(currentSessionId, currentStoreId, "REVIEW_CONFIRMED");

    // Mint or retrieve existing voucher for customer
    const { voucher, isDuplicate } = issueVoucherForSession(
      currentSessionId,
      phone,
      currentStoreId
    );

    // Sync lead to Google Sheet
    try {
      const { syncLeadToGoogleSheet } = await import("@/lib/google-sheets");
      const { getStores } = await import("@/lib/db");
      const store = getStores().find((s) => s.id === currentStoreId);
      await syncLeadToGoogleSheet({
        timestamp: new Date().toISOString(),
        phone: voucher.phone,
        customerName: voucher.customerName || "",
        dob: voucher.dob || "",
        storeName: store ? store.name : currentStoreId,
        storeCode: store ? store.code : "",
        voucherCode: voucher.code,
        voucherValue: voucher.value,
        status: voucher.status,
        marketingConsent: "YES",
        source: "In-Store QR Kiosk",
      });
    } catch (sheetErr) {
      console.warn("Lead sheet sync notice:", sheetErr);
    }

    return NextResponse.json({
      success: true,
      voucher,
      isDuplicate,
      message: isDuplicate
        ? "You already have an active voucher for this campaign! Here are your voucher details."
        : "Congratulations! Your ₹500 voucher has been unlocked and verified.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
