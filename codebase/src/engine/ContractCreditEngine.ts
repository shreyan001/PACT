/**
 * ContractCreditEngine — Evidence-Derived Multi-Dimensional Contract Credit Rating
 * 
 * Computes the creditworthiness of a SPECIFIC contractual economic position based on observable evidence.
 */

export interface CreditScoreBreakdown {
  paymentReliability: number;      // 0 - 100
  performanceReliability: number;  // 0 - 100
  disputeExposure: number;         // 0 - 100 (Lower is better)
  contractStability: number;       // 0 - 100
  complianceStatus: 'PASS' | 'FAIL' | 'UNKNOWN';
  assignmentStatus: 'UNENCUMBERED' | 'ASSIGNED' | 'CONFLICT';
  evidenceIntegrity: 'VERIFIED' | 'DEGRADED' | 'UNKNOWN';
  overallState: 'NEW' | 'HEALTHY' | 'AT_RISK' | 'DEGRADED';
  reasons: string[];
}

export interface LegalEventRecord {
  eventType: string;
  timestamp: number;
  evidenceHash: string;
  actor: string;
}

export class ContractCreditEngine {
  /**
   * Calculates evidence-derived contract credit state from event history
   */
  static calculateCreditState(events: LegalEventRecord[]): CreditScoreBreakdown {
    let paymentReliability = 96;
    let performanceReliability = 93;
    let disputeExposure = 2;
    let contractStability = 98;
    let complianceStatus: 'PASS' | 'FAIL' | 'UNKNOWN' = 'PASS';
    let assignmentStatus: 'UNENCUMBERED' | 'ASSIGNED' | 'CONFLICT' = 'UNENCUMBERED';
    let evidenceIntegrity: 'VERIFIED' | 'DEGRADED' | 'UNKNOWN' = 'VERIFIED';
    
    const reasons: string[] = [];

    for (const evt of events) {
      switch (evt.eventType) {
        case 'DELIVERY_ACCEPTED':
          performanceReliability = Math.min(100, performanceReliability + 2);
          reasons.push(`+ Delivery accepted by buyer (Evidence Hash: ${evt.evidenceHash.substring(0, 10)}...)`);
          break;

        case 'DELIVERY_MISSED':
          performanceReliability = 68; // Severe drop
          reasons.push(`- Delivery missed on scheduled due date (Evidence Hash: ${evt.evidenceHash.substring(0, 10)}...)`);
          break;

        case 'PAYMENT_ON_TIME':
          paymentReliability = Math.min(100, paymentReliability + 3);
          reasons.push(`+ Obligation payment settled on time`);
          break;

        case 'PAYMENT_LATE':
          paymentReliability = Math.max(0, paymentReliability - 25);
          reasons.push(`- Payment obligation overdue`);
          break;

        case 'RECEIVABLE_ASSIGNED':
          assignmentStatus = 'ASSIGNED';
          reasons.push(`+ Receivable assigned under PACT-IN-1 framework`);
          break;

        case 'DUPLICATE_ASSIGNMENT_DETECTED':
          assignmentStatus = 'CONFLICT';
          reasons.push(`- CRITICAL: Duplicate assignment detected in Encumbrance Registry`);
          break;

        case 'COMPLIANCE_SUSPENDED':
          complianceStatus = 'FAIL';
          reasons.push(`- CVI compliance status suspended by Cleanverse Validator`);
          break;

        case 'COMPLIANCE_RESTORED':
          complianceStatus = 'PASS';
          reasons.push(`+ CVI compliance status restored by Cleanverse Validator`);
          break;
      }
    }

    // Determine overall contract credit state
    let overallState: 'NEW' | 'HEALTHY' | 'AT_RISK' | 'DEGRADED' = 'HEALTHY';

    if (events.length === 0) {
      overallState = 'NEW';
    } else if (performanceReliability < 70 || paymentReliability < 70 || complianceStatus === 'FAIL') {
      overallState = 'AT_RISK';
    } else if (assignmentStatus === 'CONFLICT') {
      overallState = 'DEGRADED';
    }

    return {
      paymentReliability,
      performanceReliability,
      disputeExposure,
      contractStability,
      complianceStatus,
      assignmentStatus,
      evidenceIntegrity,
      overallState,
      reasons
    };
  }
}
