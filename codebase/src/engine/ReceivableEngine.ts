import { ethers } from 'ethers';

export interface ObligationData {
  id: number;
  obligor: string;      // Buyer (LargeCorp India)
  beneficiary: string;  // Supplier (ABC Components)
  amount: number;       // e.g. 1,000,000 INR
  dueAt: number;        // Timestamp
  state: 'PENDING' | 'DUE' | 'FULFILLED' | 'LATE' | 'CRYSTALLIZED' | 'ASSIGNED' | 'SETTLED';
  evidenceHash?: string;
}

export interface CrystallizedReceivable {
  receivableId: string;
  agreementHash: string;
  obligationId: number;
  amount: number;
  crystallizedAt: number;
  legalWrapper: string;
  assignable: boolean;
}

export class ReceivableEngine {
  /**
   * Evaluates whether a contractual obligation has crystallized into an enforceable receivable.
   */
  static crystallizeObligation(
    agreementHash: string,
    obligation: ObligationData,
    buyerAcceptanceEvidenceHash: string
  ): CrystallizedReceivable {
    if (obligation.state !== 'PENDING' && obligation.state !== 'CRYSTALLIZED') {
      throw new Error(`ReceivableEngine: Obligation #${obligation.id} cannot be crystallized from state ${obligation.state}`);
    }

    const receivableId = ethers.keccak256(
      ethers.toUtf8Bytes(`${agreementHash}-${obligation.id}-${buyerAcceptanceEvidenceHash}`)
    );

    return {
      receivableId,
      agreementHash,
      obligationId: obligation.id,
      amount: obligation.amount,
      crystallizedAt: Math.floor(Date.now() / 1000),
      legalWrapper: 'PACT-IN-1: Indian Factoring Regulation Act (Sec. 7)',
      assignable: true
    };
  }
}
