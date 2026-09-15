import { NextResponse } from "next/server";
import {
  createClaimSession,
  findCustomerByPhone,
  getActiveVoucherForCustomer,
  getCampaign,
  recordEvent,
  registerOrGetCustomer,
  updateClaimSession,
} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { action, storeId, phone, sessionId, marketingConsent } = await req.json();
    const campaign = getCampaign();

    if (action === "START_CLAIM") {
      const session = createClaimSession(storeId || "store-101", campaign.id);
      recordEvent(session.sessionId, storeId || "store-101", "CLAIM_START");
      return NextResponse.json({ success: true, session });
    }

    if (action === "SKIP_TO_SOCIAL") {
      const activeSessionId =
        sessionId || `sess-skip-${Date.now()}`;
      recordEvent(activeSessionId, storeId || "store-101", "SKIP_TO_SOCIAL");
      return NextResponse.json({ success: true });
    }

    if (action === "SUBMIT_PHONE") {
      if (!phone) {
        return NextResponse.json(
          { success: false, error: "Mobile number is required" },
          { status: 400 }
        );
      }

      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      if (cleanPhone.length !== 10) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit Indian mobile number" },
          { status: 400 }
        );
      }

      const customer = registerOrGetCustomer(
        cleanPhone,
        "+91",
        marketingConsent !== false
      );

      // Check if this customer already claimed a voucher in this campaign
      const existingVoucher = getActiveVoucherForCustomer(customer.id, campaign.id);

      if (sessionId) {
        updateClaimSession(sessionId, {
          customerId: customer.id,
          phone: cleanPhone,
          status: "PHONE_CAPTURED",
        });
        recordEvent(sessionId, storeId || "store-101", "PHONE_ENTERED", {
          phoneMasked: `${cleanPhone.slice(0, 2)}******${cleanPhone.slice(-2)}`,
        });
      }

      // Sync lead immediately to Google Sheet
      try {
        const { syncLeadToGoogleSheet } = await import("@/lib/google-sheets");
        const { getStores } = await import("@/lib/db");
        const store = getStores().find((s) => s.id === storeId);
        await syncLeadToGoogleSheet({
          timestamp: new Date().toISOString(),
          phone: cleanPhone,
          storeName: store ? store.name : "New SaiKeshav Enterprises",
          storeCode: store ? store.code : "SAI-BRP-01",
          voucherCode: existingVoucher ? existingVoucher.code : "CLAIMING_IN_PROGRESS",
          voucherValue: campaign.rewardAmount || 500,
          status: existingVoucher ? existingVoucher.status : "PHONE_ENTERED",
          marketingConsent: marketingConsent !== false ? "YES" : "NO",
          source: "In-Store QR Kiosk",
        });
      } catch (sheetErr) {
        console.warn("Immediate lead sheet sync notice:", sheetErr);
      }

      return NextResponse.json({
        success: true,
        customer: {
          id: customer.id,
          phone: cleanPhone,
        },
        hasExistingVoucher: !!existingVoucher,
        existingVoucher: existingVoucher || null,
      });
    }

    if (action === "CLICK_REVIEW_CTA") {
      if (sessionId) {
        updateClaimSession(sessionId, { status: "REVIEW_OPENED" });
        recordEvent(sessionId, storeId || "store-101", "REVIEW_CTA_CLICKED");
      }
      return NextResponse.json({ success: true });
    }

    if (action === "CLICK_SOCIAL") {
      if (sessionId) {
        recordEvent(sessionId, storeId || "store-101", "SOCIAL_CLICK");
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
