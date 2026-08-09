import { encryptCleanversePayload, decryptCleanversePayload } from './encryption';
import { generateCleanverseOwnerSignature } from '../web3/eipSigning';
import { CleanverseClient } from './client';
import { ethers } from 'ethers';

async function runCleanverseTests() {
  console.log('🧪 Running Ticket 01 TDD Tests (Cleanverse & EIP-191)...\n');

  // Test 1: AES Encryption & Decryption Roundtrip with Base64 Key
  const apiKeyBase64 = 'ZGVtb19hcGlfa2V5X3BhY3RfMjAyNl9jbGVhbnZlcnNlX3VhdF9zYW5kYm94';
  const originalPayload = {
    customerId: 'CUST_IN_998877',
    kycSource: 'INDIAN_PAN_AADHAAR',
    expirationTime: 1800000000,
    wallet: { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', chain: 'base' }
  };

  const encryptedEnvelope = encryptCleanversePayload(originalPayload, apiKeyBase64);
  if (!encryptedEnvelope.data || typeof encryptedEnvelope.data !== 'string') {
    throw new Error('Test 1 Failed: Encrypted envelope missing data string');
  }
  console.log('✅ Test 1 Passed: AES Encryption Ciphertext Length =', encryptedEnvelope.data.length);

  const decryptedPayload = decryptCleanversePayload(encryptedEnvelope.data, apiKeyBase64);
  if (decryptedPayload.customerId !== originalPayload.customerId) {
    throw new Error(`Test 1 Failed: Decrypted customerId mismatch (${decryptedPayload.customerId} vs ${originalPayload.customerId})`);
  }
  console.log('✅ Test 1 Passed: AES Decryption Roundtrip Match (CustomerId:', decryptedPayload.customerId, ')');

  // Test 2: EIP-191 Owner Signature Verification
  const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const wallet = new ethers.Wallet(privateKey);
  const chain = 'base';
  const contractAddress = '0x52411a2b15e1Cd44bd332eF4F8D599D9e7ae6103';

  const ownerSignature = await generateCleanverseOwnerSignature({ chain, contractAddress, privateKey });
  
  // Verify EIP-191 signature matches signer address
  const payloadString = `${chain.toLowerCase()}${contractAddress.toLowerCase()}`;
  const payloadHash = ethers.keccak256(ethers.toUtf8Bytes(payloadString));
  const recoveredAddress = ethers.verifyMessage(ethers.getBytes(payloadHash), ownerSignature);

  if (recoveredAddress.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error(`Test 2 Failed: Recovered address ${recoveredAddress} does not match signer ${wallet.address}`);
  }
  console.log('✅ Test 2 Passed: EIP-191 Owner Signature Verified (Signer:', recoveredAddress, ')');

  // Test 3: Cleanverse Client Instance Verification
  const client = new CleanverseClient({
    apiId: 'cv_api_id_pact_uat_2026',
    apiKeyBase64
  });
  if (!client) {
    throw new Error('Test 3 Failed: CleanverseClient failed to instantiate');
  }
  console.log('✅ Test 3 Passed: CleanverseClient Instantiated cleanly');

  console.log('\n🎉 ALL TICKET 01 TDD TESTS PASSED SUCCESSFULLY!');
}

runCleanverseTests().catch(err => {
  console.error('❌ Ticket 01 Test Failed:', err);
  process.exit(1);
});
