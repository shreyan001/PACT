import { ethers } from 'ethers';

export interface ClaimFingerprintParams {
  agreementHash: string;
  obligor: string;      // Buyer (LargeCorp India)
  beneficiary: string;  // Supplier / Financier
  obligationId: number;
  amount: number;
  dueDate: number;
}

export class EncumbranceEngine {
  private static registeredFingerprints = new Set<string>();

  /**
   * Computes deterministic claim fingerprint as specified in PACT Section 29
   */
  static computeClaimFingerprint(params: ClaimFingerprintParams): string {
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const encoded = abiCoder.encode(
      ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
      [params.agreementHash, params.obligor, params.beneficiary, params.obligationId, params.amount, params.dueDate]
    );
    return ethers.keccak256(encoded);
  }

  /**
   * Verifies if a claim is unencumbered and registers it
   */
  static verifyAndRegisterClaim(params: ClaimFingerprintParams): { claimFingerprint: string; unencumbered: boolean } {
    const fingerprint = this.computeClaimFingerprint(params);

    if (this.registeredFingerprints.has(fingerprint)) {
      return { claimFingerprint: fingerprint, unencumbered: false };
    }

    this.registeredFingerprints.add(fingerprint);
    return { claimFingerprint: fingerprint, unencumbered: true };
  }

  static isClaimRegistered(fingerprint: string): boolean {
    return this.registeredFingerprints.has(fingerprint);
  }
}
