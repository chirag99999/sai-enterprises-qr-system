export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  code: string;
}

export interface Campaign {
  id: string;
  name: string;
  headline: string;
  subheadline: string;
  rewardAmount: number;
  minOrderValue: number;
  validDays: number;
  validFrom: string;
  validTo: string;
  terms: string[];
  reviewUrl: string;
  reviewPlatform: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    facebook: string;
    website: string;
    menuUrl: string;
    whatsapp?: string;
    facebookPage?: string;
  };
  enabledStores: string[];
  otpRequired: boolean;
  dailyCapPerStore: number;
  googleSheetUrl?: string;
  googleSheetWebhookUrl?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  phone: string;
  countryCode: string;
  createdAt: string;
  marketingConsent: boolean;
  claimsCount: number;
}

export type ClaimSessionStatus =
  | "STARTED"
  | "PHONE_CAPTURED"
  | "REVIEW_OPENED"
  | "COMPLETED"
  | "REJECTED";

export interface ClaimSession {
  sessionId: string;
  storeId: string;
  campaignId: string;
  customerId?: string;
  phone?: string;
  status: ClaimSessionStatus;
  startedAt: string;
  completedAt?: string;
  voucherId?: string;
}

export type VoucherStatus = "ACTIVE" | "REDEEMED" | "EXPIRED" | "BLOCKED";

export interface Voucher {
  id: string;
  code: string;
  campaignId: string;
  customerId: string;
  phone: string;
  storeId: string;
  value: number;
  minOrderValue: number;
  status: VoucherStatus;
  issuedAt: string;
  expiresAt: string;
  redeemedAt?: string;
  redeemedStoreId?: string;
  posOrderRef?: string;
  syncedToGoogleSheet?: boolean;
}

export interface EngagementEvent {
  id: string;
  sessionId: string;
  storeId: string;
  eventType:
    | "WELCOME_VIEW"
    | "CLAIM_START"
    | "SKIP_TO_SOCIAL"
    | "PHONE_ENTERED"
    | "PHONE_VALIDATED"
    | "REVIEW_CTA_CLICKED"
    | "REVIEW_QR_SCANNED"
    | "SOCIAL_CLICK"
    | "REVIEW_CONFIRMED"
    | "VOUCHER_ISSUED"
    | "VOUCHER_REDEEMED"
    | "VOUCHER_SEARCHED";
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface FunnelStats {
  welcomeViews: number;
  claimStarts: number;
  phoneCaptures: number;
  reviewOpens: number;
  reviewCompletions: number;
  vouchersIssued: number;
  vouchersRedeemed: number;
  skipVisits: number;
  conversionRates: {
    claimStartRate: number; // claimStarts / welcomeViews
    mobileCaptureRate: number; // phoneCaptures / claimStarts
    reviewCtaRate: number; // reviewOpens / phoneCaptures
    completionRate: number; // reviewCompletions / reviewOpens
    voucherIssueRate: number; // vouchersIssued / claimStarts
    redemptionRate: number; // vouchersRedeemed / vouchersIssued
  };
  totalDiscountsGranted: number;
  totalEstimatedOrders: number;
}
