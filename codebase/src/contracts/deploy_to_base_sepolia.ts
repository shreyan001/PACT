import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function deployToBaseSepolia() {
  console.log('⚡ Base Sepolia Testnet Contract Deployment Tool...\n');

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

  console.log(`🌐 Network RPC URL: ${rpcUrl}`);
  console.log(`🔑 Deployer Public Address: ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  const ethBalance = ethers.formatEther(balance);
  console.log(`💰 Current Wallet ETH Balance: ${ethBalance} ETH`);

  if (balance === 0n) {
    console.log('\n⚠️ Wallet has 0.0 ETH on Base Sepolia!');
    console.log(`👉 Please send Base Sepolia ETH testnet funds to: ${wallet.address}`);
    console.log('🔗 Base Sepolia Faucets:');
    console.log('   - https://www.alchemy.com/faucets/base-sepolia');
    console.log('   - https://faucet.quicknode.com/base/sepolia');
    console.log('   - https://learnweb3.io/faucets/base_sepolia/');
    return;
  }

  console.log('\n📦 Compiling Solidity 0.8.24 contracts with solc...');
  const contractsDir = path.resolve(__dirname, '../../contracts');
  const validatorSource = fs.readFileSync(path.join(contractsDir, 'IAPassComplianceValidator.sol'), 'utf8');
  const legalRegistrySource = fs.readFileSync(path.join(contractsDir, 'LegalEventRegistry.sol'), 'utf8');
  const encumbranceSource = fs.readFileSync(path.join(contractsDir, 'EncumbranceRegistry.sol'), 'utf8');
  const pactAgreementSource = fs.readFileSync(path.join(contractsDir, 'PactAgreement.sol'), 'utf8');
  const pactCapitalSource = fs.readFileSync(path.join(contractsDir, 'PactCapital.sol'), 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'IAPassComplianceValidator.sol': { content: validatorSource },
      'LegalEventRegistry.sol': { content: legalRegistrySource },
      'EncumbranceRegistry.sol': { content: encumbranceSource },
      'PactAgreement.sol': { content: pactAgreementSource },
      'PactCapital.sol': { content: pactCapitalSource }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const fatal = output.errors.filter((e: any) => e.severity === 'error');
    if (fatal.length > 0) {
      console.error('Compiler Errors:', fatal);
      throw new Error('Solidity Compilation Failed!');
    }
  }

  const legalRegistryAbi = output.contracts['LegalEventRegistry.sol']['LegalEventRegistry'].abi;
  const legalRegistryBytecode = output.contracts['LegalEventRegistry.sol']['LegalEventRegistry'].evm.bytecode.object;

  const encumbranceAbi = output.contracts['EncumbranceRegistry.sol']['EncumbranceRegistry'].abi;
  const encumbranceBytecode = output.contracts['EncumbranceRegistry.sol']['EncumbranceRegistry'].evm.bytecode.object;

  console.log('✅ Solidity Compilation Successful!');
  console.log('🚀 Deploying LegalEventRegistry.sol to Base Sepolia Testnet...');

  const LegalFactory = new ethers.ContractFactory(legalRegistryAbi, legalRegistryBytecode, wallet);
  const legalRegistryContract = await LegalFactory.deploy();
  await legalRegistryContract.waitForDeployment();
  const legalRegistryAddress = await legalRegistryContract.getAddress();
  console.log(`🎉 LegalEventRegistry Deployed to Base Sepolia: ${legalRegistryAddress}`);

  console.log('🚀 Deploying EncumbranceRegistry.sol to Base Sepolia Testnet...');
  const EncumbranceFactory = new ethers.ContractFactory(encumbranceAbi, encumbranceBytecode, wallet);
  const encumbranceContract = await EncumbranceFactory.deploy();
  await encumbranceContract.waitForDeployment();
  const encumbranceAddress = await encumbranceContract.getAddress();
  console.log(`🎉 EncumbranceRegistry Deployed to Base Sepolia: ${encumbranceAddress}`);

  console.log('\n====================================================');
  console.log('🌐 BASE SEPOLIA TESTNET DEPLOYMENT SUMMARY:');
  console.log(`● LegalEventRegistry: ${legalRegistryAddress}`);
  console.log(`● EncumbranceRegistry: ${encumbranceAddress}`);
  console.log(`● BaseSepolia Explorer: https://sepolia.basescan.org/address/${encumbranceAddress}`);
  console.log('====================================================\n');
}

deployToBaseSepolia().catch(err => {
  console.error('❌ Base Sepolia Deployment Error:', err);
  process.exit(1);
});
