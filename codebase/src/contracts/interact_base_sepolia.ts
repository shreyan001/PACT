import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function interactWithBaseSepolia() {
  console.log('⚡ Base Sepolia Real Onchain Transaction Execution Tool...\n');

  const envPath = path.resolve(__dirname, '../../.env');
  let privateKey = process.env.BASE_SEPOLIA_PRIVATE_KEY;

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/BASE_SEPOLIA_PRIVATE_KEY=(0x[a-fA-F0-9]{64})/);
    if (match) privateKey = match[1];
  }

  if (!privateKey) {
    throw new Error('BASE_SEPOLIA_PRIVATE_KEY not found in .env!');
  }

  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`🌐 Network: Base Sepolia Testnet (${rpcUrl})`);
  console.log(`🔑 Wallet Address: ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  const ethBalance = ethers.formatEther(balance);
  console.log(`💰 Wallet Balance: ${ethBalance} ETH`);

  if (balance === 0n) {
    throw new Error('Wallet balance is 0 ETH on Base Sepolia!');
  }

  // Deployed EncumbranceRegistry Address on Base Sepolia
  const encumbranceAddress = '0x41833fEfCFE9ABE3Fc73cFDeb71AdbD60C624733';
  console.log(`📜 Target Contract Address: ${encumbranceAddress}`);

  // ABI for EncumbranceRegistry
  const abi = [
    "function registerEncumbrance(bytes32 agreementHash, address obligor, address beneficiary, uint256 obligationId, uint256 amount, uint256 dueDate, uint8 newStatus) external returns (bytes32 claimFingerprint)",
    "function isUnencumbered(bytes32 claimFingerprint) external view returns (bool)",
    "event ClaimEncumbered(bytes32 indexed claimFingerprint, bytes32 indexed agreementHash, address indexed beneficiary, uint8 status)"
  ];

  const contract = new ethers.Contract(encumbranceAddress, abi, wallet);

  // Generate unique test agreement hash & parameters
  const testId = `PACT-BS-${Date.now()}`;
  const agreementHash = ethers.keccak256(ethers.toUtf8Bytes(testId));
  const obligor = '0x2546BcD3c84621e976D8185a91A922aE77ECEc30';
  const beneficiary = wallet.address;
  const obligationId = Math.floor(Math.random() * 1000) + 1;
  const amount = 1000000; // 1,000,000 units (6-decimal CVA/USDC)
  const dueDate = Math.floor(Date.now() / 1000) + 86400 * 30;

  console.log(`\n🚀 Broadcasting Real Onchain Transaction to Base Sepolia Network...`);
  console.log(`   Agreement Hash: ${agreementHash}`);
  console.log(`   Obligation ID: #${obligationId}`);
  console.log(`   Amount: ${amount} (6 decimals)`);

  const tx = await contract.registerEncumbrance(
    agreementHash,
    obligor,
    beneficiary,
    obligationId,
    amount,
    dueDate,
    1 // ASSIGNED status
  );

  console.log(`⏳ Transaction Sent! Hash: ${tx.hash}`);
  console.log(`🔗 Basescan Tx URL: https://sepolia.basescan.org/tx/${tx.hash}`);
  console.log('⏳ Waiting for Block Confirmation on Base Sepolia...');

  const receipt = await tx.wait(1);
  console.log(`\n✅ Transaction Confirmed in Block #${receipt.blockNumber}!`);
  console.log(`   Gas Used: ${receipt.gasUsed.toString()} units`);
  console.log(`   Status: SUCCESS (1)`);
  console.log('====================================================\n');
}

interactWithBaseSepolia().catch(err => {
  console.error('❌ Base Sepolia Onchain Tx Error:', err);
  process.exit(1);
});
