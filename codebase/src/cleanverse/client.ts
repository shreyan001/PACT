import {
  CleanverseResponse,
  GenerateAPassPayload,
  LaunchATokenPayload,
  RegisterValidatorPoolPayload,
  SetValidatorPoolRulePayload,
  UpdateStatusPayload,
  VerifyUserCompliancePayload
} from './types';
import { encryptCleanversePayload } from './encryption';
import crypto from 'crypto';

export interface CleanverseClientConfig {
  baseUrl?: string;
  apiId: string;
  apiKeyBase64: string;
}

export class CleanverseClient {
  private baseUrl: string;
  private apiId: string;
  private apiKeyBase64: string;

  constructor(config: CleanverseClientConfig) {
    this.baseUrl = config.baseUrl || 'https://uatapi.cleanverse.com/api/cooperate';
    this.apiId = config.apiId;
    this.apiKeyBase64 = config.apiKeyBase64;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'api-id': this.apiId,
      'X-Request-ID': crypto.randomUUID()
    };
  }

  private async postEncrypted<T>(endpoint: string, payload: object): Promise<CleanverseResponse<T>> {
    const encryptedBody = encryptCleanversePayload(payload, this.apiKeyBase64);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(encryptedBody)
    });

    if (!response.ok) {
      throw new Error(`Cleanverse API error [${response.status}]: ${response.statusText}`);
    }

    return (await response.json()) as CleanverseResponse<T>;
  }

  private async postPlain<T>(endpoint: string, payload: object): Promise<CleanverseResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Cleanverse API error [${response.status}]: ${response.statusText}`);
    }

    return (await response.json()) as CleanverseResponse<T>;
  }

  /**
   * Generate A-Pass for User / Institution
   */
  async generateAPass(payload: GenerateAPassPayload): Promise<CleanverseResponse<{ customerId: string; cvRecordId: string; tier: string; wallet: any }>> {
    return this.postEncrypted('/generate_apass', payload);
  }

  /**
   * Update A-Pass Status (Freeze / Unfreeze)
   */
  async updateStatus(payload: UpdateStatusPayload): Promise<CleanverseResponse<{ txHash: string }>> {
    return this.postEncrypted('/update_status', payload);
  }

  /**
   * Launch CVA (Cleanverse Verified Asset)
   */
  async launchAToken(payload: LaunchATokenPayload): Promise<CleanverseResponse<{ requestId: string; issueAssetId: number }>> {
    return this.postEncrypted('/atoken/launch', payload);
  }

  /**
   * Register Compliance Pool with Validator
   */
  async registerValidatorPool(payload: RegisterValidatorPoolPayload): Promise<CleanverseResponse<{ txHash: string }>> {
    return this.postEncrypted('/validator/register', payload);
  }

  /**
   * Set RuleV2 Policy for Validator Pool
   */
  async setValidatorPoolRule(payload: SetValidatorPoolRulePayload): Promise<CleanverseResponse<{ txHash: string }>> {
    return this.postEncrypted('/validator/set_rule', payload);
  }

  /**
   * Verify User Compliance against Validator Pool
   */
  async verifyUserCompliance(payload: VerifyUserCompliancePayload): Promise<CleanverseResponse<{ valid: boolean; message?: string }>> {
    return this.postPlain('/validator/verify', payload);
  }
}
