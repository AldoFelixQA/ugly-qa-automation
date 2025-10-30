export interface OverseerConfig {
  projectId: string;
  serviceName: string;
  overseerUrl: string;
  overseerGrpc: string;
  serviceAccountPath: string;
}


export interface OrderCreationData {
  phoneNumber: string;
  phoneCountryCode: string;
  conversationId: string;
  userId: string;
  beneficiaryId: string;
  deliveryMethodId: string; 
  originAmount: number;
  destinationAmount: number;
  finalAmount: number;
  deliveryMethodType: "BANK" | "CASH";
  fxRate: number;
  promotionId?: string;
}

export interface OrderResult {
  orderId: string;
  workflowId: string;
  message: string;
}

export interface TokenCache {
  [key: string]: {
    token: string;
    expiresAt: number;
  };
}

export const COUNTRIES = {
  UNKNOWN: 0,
  UNITED_STATES: 1,
  MEXICO: 2, 
} as const;

export const CURRENCIES = {
  UNKNOWN: 0,
  MXN: 1,
  USD: 2,
} as const;

export const ORDER_TYPES = {
  REMITTANCE: 1,
} as const;

export const CREATION_SOURCES = {
  CHAT: 1,
} as const;

export const DELIVERY_METHOD_TYPES = {
  DEFAULT: 0,
  CASH: 1,
  BANK: 2,
} as const;

