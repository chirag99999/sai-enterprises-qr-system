import { NextResponse } from "next/server";
import { getAllVouchers, getStores, getCampaign } from "@/lib/db";
import { generateGoogleSheetCsv, syncLeadToGoogleSheet, GOOGLE_SHEET_URL } from "@/lib/google-sheets";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    const vouchers = getAllVouchers();
    const stores = getStores();

    if (format === "csv") {
      const csv = generateGoogleSheetCsv(vouchers, stores);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="Sai_Enterprises_QR_leads_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      googleSheetUrl: GOOGLE_SHEET_URL,
      leadsCount: vouchers.length,
      vouchers,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lead, webhookUrl } = body;

    const res = await syncLeadToGoogleSheet(lead, webhookUrl);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
