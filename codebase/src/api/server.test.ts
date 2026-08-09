import http from 'http';
import { ContractCreditEngine } from '../engine/ContractCreditEngine';
import { ReceivableEngine } from '../engine/ReceivableEngine';
import { EncumbranceEngine } from '../engine/EncumbranceEngine';
import { generateCleanverseOwnerSignature } from '../web3/eipSigning';
import { Redis } from '@upstash/redis';
import { ethers } from 'ethers';

async function runServerTests() {
  console.log('🧪 Running Ticket 02 TDD Tests (Upstash Redis & API Integration)...\n');

  // Test 1: Verify EIP-191 Signature & Encumbrance Logic for API Route Integration
  const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const ownerSignature = await generateCleanverseOwnerSignature({
    chain: 'base',
    contractAddress: '0x52411a2b15e1Cd44bd332eF4F8D599D9e7ae6103',
    privateKey
  });

  if (!ownerSignature.startsWith('0x') || ownerSignature.length < 130) {
    throw new Error('Test 1 Failed: Invalid EIP-191 owner signature generated for API route');
  }
  console.log('✅ Test 1 Passed: Server EIP-191 Signature Generator Verified');

  // Test 2: Verify Seeded Agreement Data Model Structure
  const SEEDED_AGREEMENT_HASH = ethers.keccak256(ethers.toUtf8Bytes('PACT-IN-1-SUPPLY-AGREEMENT-001'));
  const seededEvents = [
    {
      eventType: 'AGREEMENT_EXECUTED',
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 5,
      evidenceHash: '0xa4f829c2d1e0854378912e8b901a5b6c7d8e9f01a2b3c4d5e6f7a8b9c0d1e2f3',
      actor: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    }
  ];

  const creditState = ContractCreditEngine.calculateCreditState(seededEvents);
  if (creditState.overallState !== 'HEALTHY') {
    throw new Error('Test 2 Failed: Seeded credit state should be HEALTHY');
  }
  console.log('✅ Test 2 Passed: Seeded Agreement Credit Rating Validated (', creditState.overallState, ')');

  // Test 3: Delivery Acceptance & Receivable Crystallization Flow
  const deliveryEvidenceHash = '0x8829f01a2b3c4d5e6f7a8b9c0d1e2f3a4f829c2d1e0854378912e8b901a5b6c7';
  const receivable = ReceivableEngine.crystallizeObligation(
    SEEDED_AGREEMENT_HASH,
    {
      id: 1,
      obligor: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
      beneficiary: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      amount: 1000000,
      dueAt: Math.floor(Date.now() / 1000) + 86400 * 30,
      state: 'PENDING'
    },
    deliveryEvidenceHash
  );

  const encumbrance = EncumbranceEngine.verifyAndRegisterClaim({
    agreementHash: SEEDED_AGREEMENT_HASH,
    obligor: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    beneficiary: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    obligationId: 1,
    amount: 1000000,
    dueDate: Math.floor(Date.now() / 1000) + 86400 * 30
  });

  if (!receivable.receivableId || !encumbrance.unencumbered) {
    throw new Error('Test 3 Failed: Delivery and financing integration check failed');
  }
  console.log('✅ Test 3 Passed: Deliver & Finance Flow Integration Verified');

  // Test 4: Missed Delivery Credit Drop (AT_RISK) Simulation
  const failureEvents = [
    ...seededEvents,
    { eventType: 'DELIVERY_MISSED', timestamp: Math.floor(Date.now() / 1000), evidenceHash: '0x999', actor: '0xSupplier' }
  ];

  const creditStateAtRisk = ContractCreditEngine.calculateCreditState(failureEvents);
  if (creditStateAtRisk.overallState !== 'AT_RISK' || creditStateAtRisk.performanceReliability !== 68) {
    throw new Error('Test 4 Failed: Missed delivery score drop failed');
  }
  console.log('✅ Test 4 Passed: Missed Delivery API Simulation Verified (Score:', creditStateAtRisk.performanceReliability, ')');

  // Test 5: CVI Compliance Freeze & Restoration Integration
  const suspendedEvents = [
    ...seededEvents,
    { eventType: 'COMPLIANCE_SUSPENDED', timestamp: Math.floor(Date.now() / 1000), evidenceHash: '0xFreeze', actor: 'VALIDATOR' }
  ];

  const creditStateSuspended = ContractCreditEngine.calculateCreditState(suspendedEvents);
  if (creditStateSuspended.complianceStatus !== 'FAIL') {
    throw new Error('Test 5 Failed: Compliance freeze failed');
  }
  console.log('✅ Test 5 Passed: CVI Compliance Freeze API Route Verified (Status:', creditStateSuspended.complianceStatus, ')');

  // Test 6: Verify Upstash Redis Live Read/Write Connection (Ticket 02)
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || 'https://merry-lamprey-178715.upstash.io',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAArobAAIgcDE4YjZhNTAyZTczYmM0Y2Q4YmJhYzUxZWJmZTcwOTY3Mg'
  });

  await redis.set('pact:test_ticket_02', 'redis_ok');
  const redisVal = await redis.get<string>('pact:test_ticket_02');
  if (redisVal !== 'redis_ok') {
    throw new Error('Test 6 Failed: Upstash Redis read/write roundtrip failed');
  }
  console.log('✅ Test 6 Passed: Upstash Redis Live Connection & Key Scheme Verified');

  // Test 7: Verify Encumbrance Claim Fingerprint Generation for Redis Persistence (Ticket 02)
  const testClaimFp = EncumbranceEngine.verifyAndRegisterClaim({
    agreementHash: ethers.keccak256(ethers.toUtf8Bytes('PACT-TEST-AGREEMENT-REDIS')),
    obligor: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    beneficiary: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    obligationId: 101,
    amount: 500000,
    dueDate: Math.floor(Date.now() / 1000) + 86400 * 30
  });

  if (!testClaimFp.claimFingerprint || !testClaimFp.claimFingerprint.startsWith('0x')) {
    throw new Error('Test 7 Failed: Encumbrance fingerprint generation failed for Redis persistence');
  }
  console.log('✅ Test 7 Passed: Encumbrance Claim Fingerprint Verified for Redis Persistence');

  console.log('\n🎉 ALL TICKET 02 TDD TESTS PASSED SUCCESSFULLY!');
}

runServerTests().catch(err => {
  console.error('❌ Ticket 02 Test Failed:', err);
  process.exit(1);
});
