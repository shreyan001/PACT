import { ethers } from 'ethers';

/**
 * EIP Signing & Web3 Utilities compliant with ETHSKILLS & Cleanverse v5.6 Specifications.
 */

export interface EIP191OwnerSignatureInput {
  chain: string;            // e.g. "base"
  contractAddress: string;  // e.g. "0x52411a2b15e1Cd44bd332eF4F8D599D9e7ae6103"
  privateKey: string;
}

/**
 * Generates Cleanverse EIP-191 owner signature for Register CVA / Validator Pool API.
 * Signed Payload: keccak256(lowercase chain + contract_address) via personal_sign (EIP-191).
 */
export async function generateCleanverseOwnerSignature(input: EIP191OwnerSignatureInput): Promise<string> {
  const payloadString = `${input.chain.toLowerCase()}${input.contractAddress.toLowerCase()}`;
  const payloadHash = ethers.keccak256(ethers.toUtf8Bytes(payloadString));
  
  const wallet = new ethers.Wallet(input.privateKey);
  // personal_sign prefixes \x19Ethereum Signed Message:\n32 + payloadHash
  const signature = await wallet.signMessage(ethers.getBytes(payloadHash));
  
  return signature;
}

/**
 * Formats token amounts respecting token decimals (e.g., 6 decimals for CVA/USDC vs 18 for standard ERC20)
 */
export function formatTokenAmount(amountRaw: bigint | number, decimals: number = 6): string {
  return ethers.formatUnits(amountRaw.toString(), decimals);
}

/**
 * Parses human token amount to BigInt raw units respecting token decimals
 */
export function parseTokenAmount(amountHuman: string, decimals: number = 6): bigint {
  return ethers.parseUnits(amountHuman, decimals);
}
