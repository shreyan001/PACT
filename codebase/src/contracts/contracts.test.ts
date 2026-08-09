import { EncumbranceEngine } from '../engine/EncumbranceEngine';
import { ContractCreditEngine } from '../engine/ContractCreditEngine';
import { ReceivableEngine } from '../engine/ReceivableEngine';
import { ethers } from 'ethers';

async function runContractsTests() {
  console.log('🧪 Running Ticket 02 TDD Tests (Smart Contracts & Encumbrance Registry)...\n');

  // Test 1: Encumbrance Claim Fingerprint Generation & Uniqueness
  const agreementHash = ethers.keccak256(ethers.toUtf8Bytes('PACT-IN-1-SUPPLY-AGREEMENT-001'));
  const obligor = '0x2546BcD3c84621e976D8185a91A922aE77ECEc30';   // Buyer (LargeCorp India)
  const beneficiary = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'; // Supplier (ABC Components)
  const obligationId = 1;
  const amount = 1000000;
  const dueDate = 1780000000;

  const encumbrance1 = EncumbranceEngine.verifyAndRegisterClaim({
    agreementHash, obligor, beneficiary, obligationId, amount, dueDate
  });

  if (!encumbrance1.unencumbered) {
    throw new Error('Test 1 Failed: First claim registration should be UNENCUMBERED');
  }
  console.log('✅ Test 1 Passed: Claim Fingerprint Generated =', encumbrance1.claimFingerprint);

  // Test 2: Double-Financing Prevention Block
  const duplicateAttempt = EncumbranceEngine.verifyAndRegisterClaim({
    agreementHash, obligor, beneficiary, obligationId, amount, dueDate
  });

  if (duplicateAttempt.unencumbered) {
    throw new Error('Test 2 Failed: Duplicate claim registration was NOT blocked!');
  }
  console.log('✅ Test 2 Passed: Anti-Double-Financing Guard Blocked Duplicate Claim');

  // Test 3: Obligation Crystallization & Receivable Engine
  const deliveryEvidenceHash = '0x8829f01a2b3c4d5e6f7a8b9c0d1e2f3a4f829c2d1e0854378912e8b901a5b6c7';
  const receivable = ReceivableEngine.crystallizeObligation(
    agreementHash,
    { id: 1, obligor, beneficiary, amount, dueAt: dueDate, state: 'PENDING' },
    deliveryEvidenceHash
  );

  if (!receivable.receivableId || receivable.legalWrapper !== 'PACT-IN-1: Indian Factoring Regulation Act (Sec. 7)') {
    throw new Error('Test 3 Failed: Receivable crystallization missing valid PACT-IN-1 legal wrapper');
  }
  console.log('✅ Test 3 Passed: Obligation Crystallized into Receivable (ID:', receivable.receivableId.substring(0, 16), '...)');

  // Test 4: Agreement State Machine & Event Recording Simulation
  const events = [
    { eventType: 'AGREEMENT_EXECUTED', timestamp: 1000, evidenceHash: '0x111', actor: beneficiary },
    { eventType: 'AGREEMENT_ACTIVATED', timestamp: 2000, evidenceHash: '0x222', actor: obligor },
    { eventType: 'DELIVERY_ACCEPTED', timestamp: 3000, evidenceHash: deliveryEvidenceHash, actor: obligor },
    { eventType: 'RECEIVABLE_ASSIGNED', timestamp: 4000, evidenceHash: encumbrance1.claimFingerprint, actor: beneficiary }
  ];

  const creditState = ContractCreditEngine.calculateCreditState(events);
  if (creditState.overallState !== 'HEALTHY' || creditState.assignmentStatus !== 'ASSIGNED') {
    throw new Error(`Test 4 Failed: Expected HEALTHY and ASSIGNED state, got ${creditState.overallState}`);
  }
  console.log('✅ Test 4 Passed: PactAgreement State Machine Transition Verified (Credit Rating:', creditState.overallState, ')');

  console.log('\n🎉 ALL TICKET 02 TDD TESTS PASSED SUCCESSFULLY!');
}

runContractsTests().catch(err => {
  console.error('❌ Ticket 02 Test Failed:', err);
  process.exit(1);
});
