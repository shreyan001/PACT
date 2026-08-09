// Cleanverse Cooperate API v5.6 Types Specification

export interface RuleV2 {
  allowed_group?: string;       // Allowed CVI group (e.g., "AB" or empty)
  allowed_sub_group?: string;   // Allowed CVI sub-group (or empty)
  min_tier: number;             // Minimum CVI tier (0-99, e.g. 30)
  min_sub_tier: number;          // Minimum sub-tier (0-99)
  is_black_list?: boolean;      // Default: false (whitelist matching)
  countries?: string[];         // ISO 3166-1 alpha-2 codes (e.g. ["IN", "SG"])
}

export interface WalletInput {
  address: string;
  chain: string; // solana, base, avalanche, arbitrum, ethereum, polygon, bsc
}

export interface IdentityDataInput {
  idType: 'ID_CARD' | 'PASSPORT' | 'DRIVER_LICENSE' | 'HK_MACAO_TAIWAN_PASS' | 'RESIDENCE_PERMIT';
  fullName: string;
  idNumber?: string;
  validUntil?: string;
  issuingCountryISO2: string; // Derived to ISO country tags
}

export interface BankAccountInput {
  bankCountry: string;
  bankName: string;
  bankAccount?: string;
  bankAccountType?: string;
  balance?: number;
  currency?: string;
}

// Generate A-Pass Payload (Plaintext before AES)
export interface GenerateAPassPayload {
  customerId: string; // 12+ chars alphanumeric
  kycSource?: string;
  kycId?: string;
  subTier?: number;
  subGroup?: string;
  override?: boolean;
  expirationTime: number; // Unix timestamp in seconds
  wallet: WalletInput;
  identityDataList?: IdentityDataInput[];
  bankAccountList?: BankAccountInput[];
}

// Update A-Pass Status Payload
export interface UpdateStatusPayload {
  customerId?: string;
  cvRecordId?: string;
  status: '1' | '2'; // 1 = Activate/Unfreeze, 2 = Freeze
  blacklistReason?: string;
  wallet: WalletInput;
}

// Launch A-Token / CVA Payload
export interface LaunchATokenPayload {
  chain: string;
  token_name: string;
  token_symbol: string;
  decimals: number;
  admin_address: string;
  rule: RuleV2;
  icon: string;
  callback_url?: string;
}

// Register Validator Pool Payload
export interface RegisterValidatorPoolPayload {
  chain: string;
  pool_address: string;
  owner_signature: string;
  rule?: RuleV2;
}

// Set Validator Pool Rules Payload
export interface SetValidatorPoolRulePayload {
  chain: string;
  pool_address: string;
  rule: RuleV2;
}

// Verify User Compliance Payload (Unencrypted)
export interface VerifyUserCompliancePayload {
  chain: string;
  pool_address: string;
  user_address: string;
}

// Cleanverse Standard Response Envelope
export interface CleanverseResponse<T = any> {
  code: string; // "0000" for success
  message: string;
  data: T;
}
