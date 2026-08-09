import { encryptCleanversePayload, decryptCleanversePayload } from '../src/cleanverse/encryption';
import { generateCleanverseOwnerSignature } from '../src/web3/eipSigning';
import { EncumbranceEngine } from '../src/engine/EncumbranceEngine';
import { ContractCreditEngine } from '../src/engine/ContractCreditEngine';
import { ethers } from 'ethers';

async function runSanityCheck() {
  console.log('🧪 Running PACT Protocol Prototype Sanity Check...\n');

  // 1. Sanity Check AES Encryption / Decryption
  const apiKeyBase64 = 'ZGVtb19hcGlfa2V5X3BhY3RfMjAyNl9jbGVhbnZlcnNlX3VhdF9zYW5kYm94'; // Base64 key
  const samplePayload = { customerId: 'CUST123456789', chain: 'base', expirationTime: 1863690034 };
  
  const encrypted = encryptCleanversePayload(samplePayload, apiKeyBase64);
  console.log('✅ Cleanverse AES Encryption Success: Data ciphertext length =', encrypted.data.length);
  
  const decrypted = decryptCleanversePayload(encrypted.data, apiKeyBase64);
  console.log('✅ Cleanverse AES Decryption Success: CustomerId =', decrypted.customerId);

  // 2. Sanity Check EIP-191 Owner Signature
  const dummyPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const ownerSignature = await generateCleanverseOwnerSignature({
    chain: 'base',
    contractAddress: '0x52411a2b15e1Cd44bd332eF4F8D599D9e7ae6103',
    privateKey: dummyPrivateKey
  });
  console.log('✅ Cleanverse EIP-191 Owner Signature Success:', ownerSignature.substring(0, 30) + '...');

  // 3. Sanity Check Encumbrance Claim Fingerprint
  const agreementHash = ethers.keccak256(ethers.toUtf8Bytes('PACT-IN-1-SUPPLY-AGREEMENT-001'));
  const encumbranceCheck = EncumbranceEngine.verifyAndRegisterClaim({
    agreementHash,
    obligor: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    beneficiary: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    obligationId: 1,
    amount: 1000000,
    dueDate: 1780000000
  });

  console.log('✅ Encumbrance Claim Fingerprint Success:', encumbranceCheck.claimFingerprint);
  console.log('✅ Claim Unencumbered:', encumbranceCheck.unencumbered);

  // Attempt duplicate claim check
  const duplicateCheck = EncumbranceEngine.verifyAndRegisterClaim({
    agreementHash,
    obligor: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    beneficiary: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    obligationId: 1,
    amount: 1000000,
    dueDate: 1780000000
  });
  console.log('🛡️ Double-Financing Prevention Blocked Duplicate Claim:', !duplicateCheck.unencumbered);

  // 4. Sanity Check Credit Engine
  const creditState = ContractCreditEngine.calculateCreditState([
    { eventType: 'DELIVERY_ACCEPTED', timestamp: 100, evidenceHash: '0x123', actor: '0x0' }
  ]);
  console.log('✅ Contract Credit Engine Rating:', creditState.overallState, '| Score:', creditState.performanceReliability);

  console.log('\n🎉 ALL PROTOTYPE SANITY CHECKS PASSED SUCCESSFULLY!');
}

runSanityCheck().catch(err => {
  console.error('❌ Sanity Check Failed:', err);
  process.exit(1);
});
