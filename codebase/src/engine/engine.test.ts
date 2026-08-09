import { ContractCreditEngine, LegalEventRecord } from './ContractCreditEngine';
import { ReceivableEngine } from './ReceivableEngine';
import { EncumbranceEngine } from './EncumbranceEngine';
import { ethers } from 'ethers';

async function runEngineTests() {
  console.log('🧪 Running Ticket 03 TDD Tests (Protocol Engines & Credit Scoring)...\n');

  // Test 1: Contract Credit Engine Baseline & Delivery Acceptance
  const initialEvents: LegalEventRecord[] = [
    { eventType: 'AGREEMENT_ACTIVATED', timestamp: 1000, evidenceHash: '0x111', actor: '0xBuyer' },
    { eventType: 'DELIVERY_ACCEPTED', timestamp: 2000, evidenceHash: '0x222', actor: '0xBuyer' }
  ];

  const creditState1 = ContractCreditEngine.calculateCreditState(initialEvents);
  if (creditState1.overallState !== 'HEALTHY' || creditState1.performanceReliability !== 95) {
    throw new Error(`Test 1 Failed: Expected HEALTHY state & 95 score, got ${creditState1.overallState} (${creditState1.performanceReliability})`);
  }
  console.log('✅ Test 1 Passed: Delivery Acceptance Credit Score =', creditState1.performanceReliability, '(', creditState1.overallState, ')');

  // Test 2: Simulated Missed Delivery -> Credit Rating Drop to AT_RISK (68)
  const missedDeliveryEvents: LegalEventRecord[] = [
    ...initialEvents,
    { eventType: 'DELIVERY_MISSED', timestamp: 3000, evidenceHash: '0x333', actor: '0xSupplier' }
  ];

  const creditState2 = ContractCreditEngine.calculateCreditState(missedDeliveryEvents);
  if (creditState2.overallState !== 'AT_RISK' || creditState2.performanceReliability !== 68) {
    throw new Error(`Test 2 Failed: Expected AT_RISK state & 68 score on missed delivery, got ${creditState2.overallState} (${creditState2.performanceReliability})`);
  }
  console.log('✅ Test 2 Passed: Missed Delivery Score Drop Verified =', creditState2.performanceReliability, '(', creditState2.overallState, ')');

  // Test 3: CVI Compliance Suspended & Restoration Cycle
  const suspendedEvents: LegalEventRecord[] = [
    ...initialEvents,
    { eventType: 'COMPLIANCE_SUSPENDED', timestamp: 4000, evidenceHash: '0x444', actor: 'CLEANVERSE_VALIDATOR' }
  ];

  const creditState3 = ContractCreditEngine.calculateCreditState(suspendedEvents);
  if (creditState3.complianceStatus !== 'FAIL' || creditState3.overallState !== 'AT_RISK') {
    throw new Error('Test 3 Failed: Compliance suspension did not trigger FAIL status');
  }
  console.log('✅ Test 3 Passed: CVI Compliance Suspension Handled (Status:', creditState3.complianceStatus, ')');

  const restoredEvents: LegalEventRecord[] = [
    ...suspendedEvents,
    { eventType: 'COMPLIANCE_RESTORED', timestamp: 5000, evidenceHash: '0x555', actor: 'CLEANVERSE_VALIDATOR' }
  ];

  const creditState4 = ContractCreditEngine.calculateCreditState(restoredEvents);
  if (creditState4.complianceStatus !== 'PASS') {
    throw new Error('Test 3 Failed: Compliance restoration failed to set PASS status');
  }
  console.log('✅ Test 3 Passed: CVI Compliance Restoration Handled (Status:', creditState4.complianceStatus, ')');

  // Test 4: Receivable Crystallization Engine under PACT-IN-1
  const agreementHash = ethers.keccak256(ethers.toUtf8Bytes('PACT-IN-1-SUPPLY-AGREEMENT-001'));
  const deliveryEvidenceHash = '0x8829f01a2b3c4d5e6f7a8b9c0d1e2f3a4f829c2d1e0854378912e8b901a5b6c7';
  
  const receivable = ReceivableEngine.crystallizeObligation(
    agreementHash,
    {
      id: 1,
      obligor: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
      beneficiary: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      amount: 1000000,
      dueAt: 1780000000,
      state: 'PENDING'
    },
    deliveryEvidenceHash
  );

  if (!receivable.receivableId || !receivable.assignable) {
    throw new Error('Test 4 Failed: Crystallized receivable invalid');
  }
  console.log('✅ Test 4 Passed: Receivable Crystallization Validated (Legal Wrapper:', receivable.legalWrapper, ')');

  // Test 5: Encumbrance Claim Fingerprint Collision Check
  const params = {
    agreementHash,
    obligor: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    beneficiary: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    obligationId: 1,
    amount: 1000000,
    dueDate: 1780000000
  };

  const fp1 = EncumbranceEngine.computeClaimFingerprint(params);
  const claimReg1 = EncumbranceEngine.verifyAndRegisterClaim(params);
  if (!claimReg1.unencumbered || claimReg1.claimFingerprint !== fp1) {
    throw new Error('Test 5 Failed: Claim fingerprint registration mismatch');
  }

  const claimReg2 = EncumbranceEngine.verifyAndRegisterClaim(params);
  if (claimReg2.unencumbered) {
    throw new Error('Test 5 Failed: Duplicate claim registration was not blocked!');
  }
  console.log('✅ Test 5 Passed: Encumbrance Claim Fingerprint Collision Blocked (FP:', fp1.substring(0, 16), '...)');

  console.log('\n🎉 ALL TICKET 03 TDD TESTS PASSED SUCCESSFULLY!');
}

runEngineTests().catch(err => {
  console.error('❌ Ticket 03 Test Failed:', err);
  process.exit(1);
});
