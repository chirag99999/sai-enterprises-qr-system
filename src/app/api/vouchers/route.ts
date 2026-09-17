import { NextResponse } from "next/server";
import { getAllVouchers } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const vouchers = getAllVouchers();
    return NextResponse.json({ success: true, vouchers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
