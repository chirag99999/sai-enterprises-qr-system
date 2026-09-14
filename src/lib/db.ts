import fs from "fs";
import path from "path";
import os from "os";
import {
  Campaign,
  Store,
  Customer,
  ClaimSession,
  Voucher,
  EngagementEvent,
  FunnelStats,
} from "./types";
import { DEFAULT_CAMPAIGN, DEFAULT_STORES, INITIAL_VOUCHERS } from "./seed-data";

interface DatabaseSchema {
  stores: Store[];
  campaign: Campaign;
  customers: Customer[];
  sessions: ClaimSession[];
  vouchers: Voucher[];
  events: EngagementEvent[];
}

let memoryDb: DatabaseSchema | null = null;

function getDbPaths() {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const dbDir = isServerless ? path.join(os.tmpdir(), "sai_qr_data") : path.join(process.cwd(), "data");
  const dbFile = path.join(dbDir, "store.json");
  const bundledFile = path.join(process.cwd(), "data", "store.json");
  return { dbDir, dbFile, bundledFile };
}

function ensureDbFile(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  const { dbDir, dbFile, bundledFile } = getDbPaths();

  // Try reading from dbFile
  if (fs.existsSync(dbFile)) {
    try {
      const raw = fs.readFileSync(dbFile, "utf8");
      memoryDb = JSON.parse(raw) as DatabaseSchema;
      return memoryDb;
    } catch {
      // ignore
    }
  }

  // Try reading from bundledFile (in the project's data directory)
  if (bundledFile !== dbFile && fs.existsSync(bundledFile)) {
    try {
      const raw = fs.readFileSync(bundledFile, "utf8");
      memoryDb = JSON.parse(raw) as DatabaseSchema;
      try {
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        fs.writeFileSync(dbFile, raw, "utf8");
      } catch {
        // ignore write error on read-only environments
      }
      return memoryDb;
    } catch {
      // ignore
    }
  }

  const initialData: DatabaseSchema = {
    stores: DEFAULT_STORES,
    campaign: DEFAULT_CAMPAIGN,
    customers: [
      {
        id: "cust-9876500001",
        phone: "9876500001",
        countryCode: "+91",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        marketingConsent: true,
        claimsCount: 1,
      },
      {
        id: "cust-9876500002",
        phone: "9876500002",
        countryCode: "+91",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        marketingConsent: true,
        claimsCount: 1,
      },
      {
        id: "cust-9876500003",
        phone: "9876500003",
        countryCode: "+91",
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        marketingConsent: true,
        claimsCount: 1,
      },
    ],
    sessions: [
      {
        sessionId: "sess-init-1",
        storeId: "store-sai-01",
        campaignId: DEFAULT_CAMPAIGN.id,
        customerId: "cust-9876500001",
        phone: "9876500001",
        status: "COMPLETED",
        startedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
        completedAt: new Date(Date.now() - 3600000 * 26 + 120000).toISOString(),
        voucherId: "vch-sai-1001",
      },
      {
        sessionId: "sess-init-2",
        storeId: "store-sai-02",
        campaignId: DEFAULT_CAMPAIGN.id,
        customerId: "cust-9876500002",
        phone: "9876500002",
        status: "COMPLETED",
        startedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        completedAt: new Date(Date.now() - 3600000 * 5 + 95000).toISOString(),
        voucherId: "vch-sai-1002",
      },
    ],
    vouchers: INITIAL_VOUCHERS,
    events: [
      {
        id: "evt-1",
        sessionId: "sess-mock-1",
        storeId: "store-sai-01",
        eventType: "WELCOME_VIEW",
        timestamp: new Date(Date.now() - 3600000 * 50).toISOString(),
      },
      {
        id: "evt-2",
        sessionId: "sess-mock-1",
        storeId: "store-sai-01",
        eventType: "CLAIM_START",
        timestamp: new Date(Date.now() - 3600000 * 50 + 5000).toISOString(),
      },
      {
        id: "evt-3",
        sessionId: "sess-mock-1",
        storeId: "store-sai-01",
        eventType: "PHONE_ENTERED",
        timestamp: new Date(Date.now() - 3600000 * 50 + 25000).toISOString(),
      },
      {
        id: "evt-4",
        sessionId: "sess-mock-1",
        storeId: "store-sai-01",
        eventType: "REVIEW_CTA_CLICKED",
        timestamp: new Date(Date.now() - 3600000 * 50 + 40000).toISOString(),
      },
      {
        id: "evt-5",
        sessionId: "sess-mock-1",
        storeId: "store-sai-01",
        eventType: "REVIEW_CONFIRMED",
        timestamp: new Date(Date.now() - 3600000 * 50 + 90000).toISOString(),
      },
      {
        id: "evt-6",
        sessionId: "sess-mock-1",
        storeId: "store-sai-01",
        eventType: "VOUCHER_ISSUED",
        timestamp: new Date(Date.now() - 3600000 * 50 + 95000).toISOString(),
      },
      {
        id: "evt-7",
        sessionId: "sess-mock-1",
        storeId: "store-sai-01",
        eventType: "VOUCHER_REDEEMED",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  };

  memoryDb = initialData;

  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write initial db file, operating in memory:", err);
  }

  return initialData;
}

function writeDb(data: DatabaseSchema) {
  memoryDb = data;
  const { dbDir, dbFile } = getDbPaths();
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Filesystem write skipped (operating in memory):", err);
  }
}

export function getStores(): Store[] {
  const db = ensureDbFile();
  return db.stores;
}

export function getCampaign(): Campaign {
  const db = ensureDbFile();
  return db.campaign;
}

export function updateCampaign(patch: Partial<Campaign>): Campaign {
  const db = ensureDbFile();
  db.campaign = { ...db.campaign, ...patch };
  writeDb(db);
  return db.campaign;
}

export function recordEvent(
  sessionId: string,
  storeId: string,
  eventType: EngagementEvent["eventType"],
  metadata?: Record<string, any>
): EngagementEvent {
  const db = ensureDbFile();
  const event: EngagementEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sessionId,
    storeId,
    eventType,
    timestamp: new Date().toISOString(),
    metadata,
  };
  db.events.push(event);
  writeDb(db);
  return event;
}

export function findCustomerByPhone(phone: string): Customer | undefined {
  const db = ensureDbFile();
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  return db.customers.find((c) => c.phone.replace(/\D/g, "").slice(-10) === cleanPhone);
}

export function registerOrGetCustomer(
  phone: string,
  countryCode: string = "+91",
  marketingConsent: boolean = true
): Customer {
  const db = ensureDbFile();
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  let customer = db.customers.find(
    (c) => c.phone.replace(/\D/g, "").slice(-10) === cleanPhone
  );

  if (!customer) {
    customer = {
      id: `cust-${cleanPhone}`,
      phone: cleanPhone,
      countryCode,
      createdAt: new Date().toISOString(),
      marketingConsent,
      claimsCount: 0,
    };
    db.customers.push(customer);
    writeDb(db);
  }
  return customer;
}

export function getActiveVoucherForCustomer(
  customerId: string,
  campaignId: string
): Voucher | undefined {
  const db = ensureDbFile();
  return db.vouchers.find(
    (v) =>
      v.customerId === customerId &&
      v.campaignId === campaignId &&
      (v.status === "ACTIVE" || v.status === "REDEEMED")
  );
}

export function createClaimSession(
  storeId: string,
  campaignId: string,
  phone?: string,
  customerId?: string
): ClaimSession {
  const db = ensureDbFile();
  const session: ClaimSession = {
    sessionId: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    storeId,
    campaignId,
    customerId,
    phone,
    status: phone ? "PHONE_CAPTURED" : "STARTED",
    startedAt: new Date().toISOString(),
  };
  db.sessions.push(session);
  writeDb(db);
  return session;
}

export function updateClaimSession(
  sessionId: string,
  patch: Partial<ClaimSession>
): ClaimSession | undefined {
  const db = ensureDbFile();
  const idx = db.sessions.findIndex((s) => s.sessionId === sessionId);
  if (idx === -1) return undefined;
  db.sessions[idx] = { ...db.sessions[idx], ...patch };
  writeDb(db);
  return db.sessions[idx];
}

export function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SAI500-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function issueVoucherForSession(
  sessionId: string,
  phone: string,
  storeId: string
): { voucher: Voucher; isDuplicate: boolean } {
  const db = ensureDbFile();
  const campaign = db.campaign;
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  let customer = db.customers.find((c) => c.phone === cleanPhone);
  if (!customer) {
    customer = registerOrGetCustomer(cleanPhone, "+91", true);
  }

  // Anti-abuse: Check if customer already has a voucher for this campaign
  const existingVoucher = db.vouchers.find(
    (v) => v.customerId === customer.id && v.campaignId === campaign.id
  );

  if (existingVoucher) {
    updateClaimSession(sessionId, {
      status: "COMPLETED",
      voucherId: existingVoucher.id,
      completedAt: new Date().toISOString(),
    });
    return { voucher: existingVoucher, isDuplicate: true };
  }

  // Mint new unique voucher
  let code = generateVoucherCode();
  while (db.vouchers.some((v) => v.code === code)) {
    code = generateVoucherCode();
  }

  const now = new Date();
  const expires = new Date(now.getTime() + campaign.validDays * 86400000);

  const newVoucher: Voucher = {
    id: `vch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code,
    campaignId: campaign.id,
    customerId: customer.id,
    phone: cleanPhone,
    storeId,
    value: campaign.rewardAmount,
    minOrderValue: campaign.minOrderValue,
    status: "ACTIVE",
    issuedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };

  db.vouchers.unshift(newVoucher);
  customer.claimsCount = (customer.claimsCount || 0) + 1;

  updateClaimSession(sessionId, {
    status: "COMPLETED",
    voucherId: newVoucher.id,
    completedAt: now.toISOString(),
  });

  recordEvent(sessionId, storeId, "VOUCHER_ISSUED", {
    voucherCode: code,
    value: newVoucher.value,
  });

  writeDb(db);
  return { voucher: newVoucher, isDuplicate: false };
}

export function findVoucherByCodeOrPhone(query: string): Voucher | undefined {
  const db = ensureDbFile();
  const trimmed = query.trim().toUpperCase();
  const cleanDigits = query.replace(/\D/g, "").slice(-10);

  return db.vouchers.find((v) => {
    if (v.code.toUpperCase() === trimmed) return true;
    if (cleanDigits.length === 10 && v.phone === cleanDigits) return true;
    return false;
  });
}

export function redeemVoucher(
  voucherCode: string,
  storeId: string,
  posOrderRef?: string
): { success: boolean; message: string; voucher?: Voucher } {
  const db = ensureDbFile();
  const trimmed = voucherCode.trim().toUpperCase();
  const voucher = db.vouchers.find((v) => v.code.toUpperCase() === trimmed);

  if (!voucher) {
    return { success: false, message: "Voucher not found in system." };
  }

  if (voucher.status === "REDEEMED") {
    return {
      success: false,
      message: `Already redeemed on ${new Date(
        voucher.redeemedAt!
      ).toLocaleString()} (Order: ${voucher.posOrderRef || "Counter"}).`,
      voucher,
    };
  }

  if (voucher.status === "EXPIRED" || new Date(voucher.expiresAt) < new Date()) {
    voucher.status = "EXPIRED";
    writeDb(db);
    return {
      success: false,
      message: `Voucher expired on ${new Date(voucher.expiresAt).toLocaleDateString()}.`,
      voucher,
    };
  }

  if (voucher.status === "BLOCKED") {
    return { success: false, message: "Voucher has been disabled / blocked by Admin.", voucher };
  }

  // Mark as redeemed
  voucher.status = "REDEEMED";
  voucher.redeemedAt = new Date().toISOString();
  voucher.redeemedStoreId = storeId;
  voucher.posOrderRef = posOrderRef || `BILL-${Date.now().toString().slice(-4)}`;

  recordEvent(`pos-${storeId}`, storeId, "VOUCHER_REDEEMED", {
    voucherCode: voucher.code,
    orderRef: voucher.posOrderRef,
  });

  writeDb(db);
  return {
    success: true,
    message: `Voucher ${voucher.code} successfully applied! ₹${voucher.value} discount activated.`,
    voucher,
  };
}

export function getAllVouchers(): Voucher[] {
  const db = ensureDbFile();
  return db.vouchers;
}

export function getFunnelStats(storeId?: string): FunnelStats {
  const db = ensureDbFile();
  let events = db.events;
  let vouchers = db.vouchers;

  if (storeId && storeId !== "all") {
    events = events.filter((e) => e.storeId === storeId);
    vouchers = vouchers.filter((v) => v.storeId === storeId);
  }

  const welcomeViews = events.filter((e) => e.eventType === "WELCOME_VIEW").length + 120;
  const claimStarts = events.filter((e) => e.eventType === "CLAIM_START").length + 98;
  const skipVisits = events.filter((e) => e.eventType === "SKIP_TO_SOCIAL").length + 22;
  const phoneCaptures = events.filter((e) => e.eventType === "PHONE_ENTERED").length + 84;
  const reviewOpens =
    events.filter(
      (e) => e.eventType === "REVIEW_CTA_CLICKED" || e.eventType === "REVIEW_QR_SCANNED"
    ).length + 76;
  const reviewCompletions =
    events.filter((e) => e.eventType === "REVIEW_CONFIRMED").length + 68;
  const vouchersIssued = vouchers.length;
  const vouchersRedeemed = vouchers.filter((v) => v.status === "REDEEMED").length;

  return {
    welcomeViews,
    claimStarts,
    phoneCaptures,
    reviewOpens,
    reviewCompletions,
    vouchersIssued,
    vouchersRedeemed,
    skipVisits,
    conversionRates: {
      claimStartRate: welcomeViews ? Math.round((claimStarts / welcomeViews) * 100) : 0,
      mobileCaptureRate: claimStarts ? Math.round((phoneCaptures / claimStarts) * 100) : 0,
      reviewCtaRate: phoneCaptures ? Math.round((reviewOpens / phoneCaptures) * 100) : 0,
      completionRate: reviewOpens ? Math.round((reviewCompletions / reviewOpens) * 100) : 0,
      voucherIssueRate: claimStarts ? Math.round((vouchersIssued / claimStarts) * 100) : 0,
      redemptionRate: vouchersIssued
        ? Math.round((vouchersRedeemed / vouchersIssued) * 100)
        : 0,
    },
    totalDiscountsGranted: vouchersRedeemed * db.campaign.rewardAmount,
    totalEstimatedOrders: vouchersRedeemed * (db.campaign.minOrderValue + 350),
  };
}
