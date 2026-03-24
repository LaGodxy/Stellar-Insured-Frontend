export type PolicyStatus = 'active' | 'pending' | 'expired';
export type PolicyType = 'Health' | 'Auto' | 'Home' | 'Travel';
export type IncidentType = 'wallet-hack' | 'smart-contract' | 'defi-protocol' | 'exchange-hack' | 'phishing' | 'other';

export interface Policy {
  id: string;
  name: string;
  type: PolicyType;
  status: PolicyStatus;
  coverageLimit: number;
  coverageLimitFormatted: string;
  policyNumber: string;
  premium?: number;
  expiryDate?: string;
  description?: string;
  terms?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PolicyCreationRequest {
  name: string;
  type: PolicyType;
  coverageLimit: number;
  description?: string;
  terms?: string[];
}

export interface PolicyUpdateRequest {
  name?: string;
  type?: PolicyType;
  status?: PolicyStatus;
  coverageLimit?: number;
  description?: string;
  terms?: string[];
}

export interface PolicyValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PremiumCalculationRequest {
  policyType: PolicyType;
  coverageLimit: number;
  riskFactors?: {
    age?: number;
    location?: string;
    claimsHistory?: number;
    creditScore?: number;
  };
}

export interface PremiumCalculationResult {
  basePremium: number;
  finalPremium: number;
  riskMultiplier: number;
  breakdown: {
    coverageComponent: number;
    riskComponent: number;
    fees: number;
  };
}

export interface PolicyFilterOptions {
  status?: PolicyStatus;
  type?: PolicyType;
  searchQuery?: string;
  sortBy?: 'name' | 'coverageLimit' | 'expiryDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PolicyServiceResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PolicyListResponse {
  policies: Policy[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
