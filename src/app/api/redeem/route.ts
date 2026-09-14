import { NextResponse } from "next/server";
import { findVoucherByCodeOrPhone, redeemVoucher } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { action, query, code, storeId, posOrderRef } = await req.json();

    if (action === "SEARCH") {
      if (!query) {
        return NextResponse.json(
          { success: false, error: "Please provide a voucher code or phone number to search." },
          { status: 400 }
        );
      }

      const voucher = findVoucherByCodeOrPhone(query);
      if (!voucher) {
        return NextResponse.json({
          success: false,
          found: false,
          message: "No voucher found matching that code or mobile number.",
        });
      }

      return NextResponse.json({
        success: true,
        found: true,
        voucher,
      });
    }

    if (action === "REDEEM") {
      if (!code) {
        return NextResponse.json(
          { success: false, error: "Voucher code is required." },
          { status: 400 }
        );
      }

      const result = redeemVoucher(
        code,
        storeId || "store-101",
        posOrderRef
      );

      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
