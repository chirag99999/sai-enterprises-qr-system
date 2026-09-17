import { NextResponse } from "next/server";
import { getCampaign, getStores, updateCampaign } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const campaign = getCampaign();
    const stores = getStores();
    return NextResponse.json({ success: true, campaign, stores });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

async function handleUpdate(req: Request) {
  try {
    const body = await req.json();
    const updated = updateCampaign(body);
    return NextResponse.json({ success: true, campaign: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return handleUpdate(req);
}

export async function POST(req: Request) {
  return handleUpdate(req);
}
