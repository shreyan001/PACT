import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';
import { CleanverseClient } from '../cleanverse/client';
import { ContractCreditEngine, LegalEventRecord } from '../engine/ContractCreditEngine';
import { ReceivableEngine } from '../engine/ReceivableEngine';
import { EncumbranceEngine } from '../engine/EncumbranceEngine';
import { generateCleanverseOwnerSignature } from '../web3/eipSigning';
import { ethers } from 'ethers';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://merry-lamprey-178715.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAArobAAIgcDE4YjZhNTAyZTczYmM0Y2Q4YmJhYzUxZWJmZTcwOTY3Mg'
});

// Cleanverse Client Initialization
const cleanverseClient = new CleanverseClient({
  baseUrl: process.env.CLEANVERSE_BASE_URL || 'https://uatapi.cleanverse.com/api/cooperate',
  apiId: process.env.CLEANVERSE_API_ID || 'demo_api_id_pact',
  apiKeyBase64: process.env.CLEANVERSE_API_KEY || 'ZGVtb19hcGlfa2V5X3BhY3RfMjAyNl9jbGVhbnZlcnNlX3VhdF9zYW5kYm94'
});

export interface AgreementStateStore {
  scenarioKey: 'msme' | 'cre' | 'custom';
  agreementId: string;
  agreementHash: string;
  title: string;
  jurisdiction: string;
  legalWrapper: string;
  supplier: { name: string; address: string; cviStatus: string; cviTier: number };
  buyer: { name: string; address: string; cviStatus: string; cviTier: number };
  financier: { name: string; address: string; cviStatus: string; cviTier: number };
  totalValue: number;
  currency: string;
  state: 'DRAFT' | 'ACTIVE' | 'AT_RISK' | 'SUSPENDED' | 'DEFAULTED' | 'COMPLETED';
  inspectionCertificate?: {
    auditor: string;
    verifiedAt: string;
    reportHash: string;
    conditionRating: string;
    zeroLiability: boolean;
  };
  obligations: Array<{
    id: number;
    title: string;
    amount: number;
    dueAt: string;
    state: 'PENDING' | 'CRYSTALLIZED' | 'ASSIGNED' | 'LATE' | 'SETTLED';
    evidenceHash?: string;
  }>;
  capitalPosition?: {
    positionId: number;
    fundedAmount: number;
    faceValue: number;
    cvaToken: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'SETTLED';
  };
  events: LegalEventRecord[];
}

// Preset Scenario 1: MSME Automotive Supply Agreement
const msmeScenarioStore: AgreementStateStore = {
  scenarioKey: 'msme',
  agreementId: 'PACT-IN-001',
  agreementHash: ethers.keccak256(ethers.toUtf8Bytes('PACT-IN-1-SUPPLY-AGREEMENT-001')),
  title: 'Indian MSME Automotive Parts Supply Agreement',
  jurisdiction: 'India (IN)',
  legalWrapper: 'PACT-IN-1 (Factoring Regulation Act, Sec. 7)',
  supplier: {
    name: 'ABC Components Pvt Ltd',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    cviStatus: 'VERIFIED',
    cviTier: 30
  },
  buyer: {
    name: 'LargeCorp India / TATA Automotive Ltd',
    address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    cviStatus: 'VERIFIED',
    cviTier: 50
  },
  financier: {
    name: 'ABC Capital Finance',
    address: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    cviStatus: 'VERIFIED',
    cviTier: 50
  },
  totalValue: 12000000,
  currency: 'INR (₹)',
  state: 'DRAFT',
  obligations: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Monthly Delivery #${i + 1}`,
    amount: 1000000,
    dueAt: `Month ${i + 1}`,
    state: 'PENDING'
  })),
  events: [
    {
      eventType: 'AGREEMENT_EXECUTED',
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 5,
      evidenceHash: '0xa4f829c2d1e0854378912e8b901a5b6c7d8e9f01a2b3c4d5e6f7a8b9c0d1e2f3',
      actor: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    }
  ]
};

// Preset Scenario 2: Bangalore Commercial CRE Lease Tokenization
const creScenarioStore: AgreementStateStore = {
  scenarioKey: 'cre',
  agreementId: 'PACT-CRE-002',
  agreementHash: ethers.keccak256(ethers.toUtf8Bytes('PACT-CRE-2-COMMERCIAL-LEASE-002')),
  title: 'Bangalore Commercial Real Estate Lease Tokenization',
  jurisdiction: 'India (IN) / Singapore (SG)',
  legalWrapper: 'PACT-CRE-1 (Commercial Lease Cash Flow Assignment)',
  supplier: {
    name: 'Vanguard Commercial Realty',
    address: '0x3C44CdD45a357718b75306F9f653418e5127d6d7',
    cviStatus: 'VERIFIED',
    cviTier: 45
  },
  buyer: {
    name: 'Nexus Tech Solutions (3rd Renewal Tenure)',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    cviStatus: 'VERIFIED',
    cviTier: 40
  },
  financier: {
    name: 'Apex Global Real Estate Fund',
    address: '0x15d34AA5453088061e7650567e9f3b89e3a67732',
    cviStatus: 'VERIFIED',
    cviTier: 50
  },
  totalValue: 3600000,
  currency: 'INR (₹)',
  state: 'DRAFT',
  inspectionCertificate: {
    auditor: 'Bureau Veritas Commercial Real Estate Audits',
    verifiedAt: '2026-08-01',
    reportHash: '0x91a4f012b3c4d5e6f7a8b9c0d1e2f3a4f829c2d1e0854378912e8b901a5b6c7',
    conditionRating: 'GRADE-A EXCELLENT',
    zeroLiability: true
  },
  obligations: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Monthly Lease Rent #${i + 1}`,
    amount: 300000,
    dueAt: `Month ${i + 1}`,
    state: 'PENDING'
  })),
  events: [
    {
      eventType: 'AGREEMENT_EXECUTED',
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 10,
      evidenceHash: '0x91a4f012b3c4d5e6f7a8b9c0d1e2f3a4f829c2d1e0854378912e8b901a5b6c7',
      actor: '0x3C44CdD45a357718b75306F9f653418e5127d6d7'
    },
    {
      eventType: 'INSPECTION_CERTIFICATE_VERIFIED',
      timestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
      evidenceHash: '0x91a4f012b3c4d5e6f7a8b9c0d1e2f3a4f829c2d1e0854378912e8b901a5b6c7',
      actor: 'Bureau Veritas Auditor'
    }
  ]
};

// Seed Upstash Redis with default scenarios on boot
async function initUpstashRedisSeed() {
  try {
    await redis.set(`pact:agreements:${msmeScenarioStore.agreementId}`, msmeScenarioStore);
    await redis.set(`pact:agreements:${creScenarioStore.agreementId}`, creScenarioStore);
    await redis.sadd('pact:agreement_ids', msmeScenarioStore.agreementId, creScenarioStore.agreementId);
    await redis.set('pact:active_agreement_id', msmeScenarioStore.agreementId);
    console.log('⚡ Upstash Redis initialized & seeded successfully!');
  } catch (err) {
    console.warn('⚠️ Upstash Redis seed warning (fallback to memory):', err);
  }
}
initUpstashRedisSeed();

async function getActiveStore(): Promise<AgreementStateStore> {
  try {
    const activeId = (await redis.get<string>('pact:active_agreement_id')) || msmeScenarioStore.agreementId;
    const store = await redis.get<AgreementStateStore>(`pact:agreements:${activeId}`);
    if (store) return store;
  } catch (err) {
    console.warn('Redis get fallback to msmeScenarioStore');
  }
  return msmeScenarioStore;
}

async function saveStore(store: AgreementStateStore): Promise<void> {
  try {
    await redis.set(`pact:agreements:${store.agreementId}`, store);
    await redis.sadd('pact:agreement_ids', store.agreementId);
    await redis.set('pact:active_agreement_id', store.agreementId);
  } catch (err) {
    console.warn('Redis saveStore warning:', err);
  }
}

// --- REST API ROUTES ---

// GET /api/agreements — Fetch ALL agreements from Upstash Redis (For Financier Marketplace)
app.get('/api/agreements', async (req, res) => {
  try {
    const ids = await redis.smembers('pact:agreement_ids');
    const agreements: AgreementStateStore[] = [];

    for (const id of ids) {
      const agr = await redis.get<AgreementStateStore>(`pact:agreements:${id}`);
      if (agr) {
        agreements.push(agr);
      }
    }

    if (agreements.length === 0) {
      agreements.push(msmeScenarioStore, creScenarioStore);
    }

    const agreementsWithCredit = agreements.map(agr => ({
      agreement: agr,
      creditState: ContractCreditEngine.calculateCreditState(agr.events)
    }));

    res.json({ success: true, agreements: agreementsWithCredit });
  } catch (err: any) {
    res.json({
      success: true,
      agreements: [
        { agreement: msmeScenarioStore, creditState: ContractCreditEngine.calculateCreditState(msmeScenarioStore.events) },
        { agreement: creScenarioStore, creditState: ContractCreditEngine.calculateCreditState(creScenarioStore.events) }
      ]
    });
  }
});

// GET /api/agreements/seeded — Fetch active agreement
app.get('/api/agreements/seeded', async (req, res) => {
  const store = await getActiveStore();
  const creditState = ContractCreditEngine.calculateCreditState(store.events);
  res.json({
    agreement: store,
    creditState
  });
});

// POST /api/agreements/create — Borrower submits a new agreement to Upstash Redis
app.post('/api/agreements/create', async (req, res) => {
  try {
    const { title, supplierName, buyerName, totalValue, monthlyPayment, scenarioKey, inspectionAuditor } = req.body;

    const newId = `PACT-${(scenarioKey || 'CUSTOM').toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const agreementHash = ethers.keccak256(ethers.toUtf8Bytes(`${newId}-${title}-${Date.now()}`));

    const newAgreement: AgreementStateStore = {
      scenarioKey: scenarioKey || 'custom',
      agreementId: newId,
      agreementHash,
      title: title || 'Custom Tokenized Agreement',
      jurisdiction: 'India (IN)',
      legalWrapper: scenarioKey === 'cre' 
        ? 'PACT-CRE-1 (Commercial Lease Cash Flow Assignment)' 
        : 'PACT-IN-1 (Factoring Regulation Act, Sec. 7)',
      supplier: {
        name: supplierName || 'Borrower Business Enterprise',
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        cviStatus: 'VERIFIED',
        cviTier: 35
      },
      buyer: {
        name: buyerName || 'Enterprise Buyer / Tenant',
        address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        cviStatus: 'VERIFIED',
        cviTier: 45
      },
      financier: {
        name: 'Apex Institutional Capital',
        address: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
        cviStatus: 'VERIFIED',
        cviTier: 50
      },
      totalValue: Number(totalValue) || 12000000,
      currency: 'INR (₹)',
      state: 'DRAFT',
      obligations: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Payment Claim #${i + 1}`,
        amount: Number(monthlyPayment) || Math.floor((Number(totalValue) || 12000000) / 12),
        dueAt: `Month ${i + 1}`,
        state: 'PENDING'
      })),
      events: [
        {
          eventType: 'AGREEMENT_EXECUTED',
          timestamp: Math.floor(Date.now() / 1000),
          evidenceHash: ethers.keccak256(ethers.toUtf8Bytes(`EXECUTION-${newId}`)),
          actor: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        }
      ]
    };

    if (inspectionAuditor) {
      newAgreement.inspectionCertificate = {
        auditor: inspectionAuditor,
        verifiedAt: new Date().toISOString().split('T')[0],
        reportHash: ethers.keccak256(ethers.toUtf8Bytes(`AUDIT-${inspectionAuditor}`)),
        conditionRating: 'GRADE-A EXCELLENT',
        zeroLiability: true
      };
      newAgreement.events.push({
        eventType: 'INSPECTION_CERTIFICATE_VERIFIED',
        timestamp: Math.floor(Date.now() / 1000),
        evidenceHash: newAgreement.inspectionCertificate.reportHash,
        actor: inspectionAuditor
      });
    }

    await saveStore(newAgreement);

    const creditState = ContractCreditEngine.calculateCreditState(newAgreement.events);
    res.json({ success: true, agreement: newAgreement, creditState });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/agreements/select-scenario
app.post('/api/agreements/select-scenario', async (req, res) => {
  const { scenario } = req.body;
  const targetId = scenario === 'cre' ? creScenarioStore.agreementId : msmeScenarioStore.agreementId;
  await redis.set('pact:active_agreement_id', targetId);
  const store = await getActiveStore();
  const creditState = ContractCreditEngine.calculateCreditState(store.events);
  res.json({ success: true, agreement: store, creditState });
});

// POST /api/agreements/activate
app.post('/api/agreements/activate', async (req, res) => {
  try {
    const store = await getActiveStore();
    store.state = 'ACTIVE';
    store.events.push({
      eventType: 'AGREEMENT_ACTIVATED',
      timestamp: Math.floor(Date.now() / 1000),
      evidenceHash: ethers.keccak256(ethers.toUtf8Bytes('ACTIVATION-PROOF')),
      actor: store.buyer.address
    });

    await saveStore(store);

    const creditState = ContractCreditEngine.calculateCreditState(store.events);
    res.json({ success: true, agreement: store, creditState });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/agreements/deliver-and-finance
app.post('/api/agreements/deliver-and-finance', async (req, res) => {
  try {
    const store = await getActiveStore();
    const obl = store.obligations[0];
    const deliveryEvidenceHash = '0x8829f01a2b3c4d5e6f7a8b9c0d1e2f3a4f829c2d1e0854378912e8b901a5b6c7';

    // 1. Crystallize Obligation
    const receivable = ReceivableEngine.crystallizeObligation(
      store.agreementHash,
      {
        id: obl.id,
        obligor: store.buyer.address,
        beneficiary: store.supplier.address,
        amount: obl.amount,
        dueAt: Math.floor(Date.now() / 1000) + 86400 * 30,
        state: 'PENDING'
      },
      deliveryEvidenceHash
    );

    obl.state = 'CRYSTALLIZED';
    obl.evidenceHash = deliveryEvidenceHash;

    store.events.push({
      eventType: 'DELIVERY_ACCEPTED',
      timestamp: Math.floor(Date.now() / 1000),
      evidenceHash: deliveryEvidenceHash,
      actor: store.buyer.address
    });

    // 2. Encumbrance & Claim Fingerprint Verification
    const encumbrance = EncumbranceEngine.verifyAndRegisterClaim({
      agreementHash: store.agreementHash,
      obligor: store.buyer.address,
      beneficiary: store.financier.address,
      obligationId: obl.id,
      amount: obl.amount,
      dueDate: Math.floor(Date.now() / 1000) + 86400 * 30
    });

    if (!encumbrance.unencumbered) {
      throw new Error('Encumbrance Failure: Claim already assigned or pledged elsewhere!');
    }

    obl.state = 'ASSIGNED';
    store.events.push({
      eventType: 'RECEIVABLE_ASSIGNED',
      timestamp: Math.floor(Date.now() / 1000),
      evidenceHash: encumbrance.claimFingerprint,
      actor: store.supplier.address
    });

    // 3. Generate EIP-191 Owner Signature with Live Base Sepolia Deployed Contract
    const ownerSignature = await generateCleanverseOwnerSignature({
      chain: 'base',
      contractAddress: '0x41833fEfCFE9ABE3Fc73cFDeb71AdbD60C624733',
      privateKey: process.env.BASE_SEPOLIA_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    });

    // 4. Fund Position & Link CVA Asset Rail with RuleV2 Compliance Policy
    store.capitalPosition = {
      positionId: 1,
      fundedAmount: Math.floor(obl.amount * (store.inspectionCertificate ? 0.968 : 0.962)),
      faceValue: obl.amount,
      cvaToken: `0xCVA_${store.scenarioKey.toUpperCase()}_001_CLEANVERSE`,
      status: 'ACTIVE',
      txHash: '0x372cd7bc8f2628fd9aac687c5cab02542a5371b83c00ad293eee545888ec6db6',
      ruleV2: {
        minTier: 30,
        minSubTier: 0,
        isBlackList: false,
        countryBitmap: store.jurisdiction.includes('IN') ? 356 : 702
      }
    };

    await saveStore(store);

    const creditState = ContractCreditEngine.calculateCreditState(store.events);
    res.json({ success: true, agreement: store, creditState, receivable, encumbrance, ownerSignature });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/agreements/simulate-missed-delivery
app.post('/api/agreements/simulate-missed-delivery', async (req, res) => {
  try {
    const store = await getActiveStore();
    const obl2 = store.obligations[1];
    obl2.state = 'LATE';
    store.state = 'AT_RISK';

    const failureEvidenceHash = '0x9911ee22ff33aa44bb55cc66dd77ee88ff990011223344556677889900aabbcc';

    store.events.push({
      eventType: 'DELIVERY_MISSED',
      timestamp: Math.floor(Date.now() / 1000),
      evidenceHash: failureEvidenceHash,
      actor: store.supplier.address
    });

    await saveStore(store);

    const creditState = ContractCreditEngine.calculateCreditState(store.events);
    res.json({ success: true, agreement: store, creditState });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/agreements/simulate-cvi-freeze
app.post('/api/agreements/simulate-cvi-freeze', async (req, res) => {
  try {
    const store = await getActiveStore();
    store.financier.cviStatus = 'FROZEN';
    if (store.capitalPosition) {
      store.capitalPosition.status = 'SUSPENDED';
    }

    store.events.push({
      eventType: 'COMPLIANCE_SUSPENDED',
      timestamp: Math.floor(Date.now() / 1000),
      evidenceHash: ethers.keccak256(ethers.toUtf8Bytes('CVI-FREEZE-NOTICE')),
      actor: 'CLEANVERSE_VALIDATOR'
    });

    await saveStore(store);

    const creditState = ContractCreditEngine.calculateCreditState(store.events);
    res.json({ success: true, agreement: store, creditState });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/agreements/restore-cvi
app.post('/api/agreements/restore-cvi', async (req, res) => {
  try {
    const store = await getActiveStore();
    store.financier.cviStatus = 'VERIFIED';
    if (store.capitalPosition) {
      store.capitalPosition.status = 'SETTLED';
    }
    store.obligations[0].state = 'SETTLED';

    store.events.push({
      eventType: 'COMPLIANCE_RESTORED',
      timestamp: Math.floor(Date.now() / 1000),
      evidenceHash: ethers.keccak256(ethers.toUtf8Bytes('CVI-RESTORE-NOTICE')),
      actor: 'CLEANVERSE_VALIDATOR'
    });

    store.events.push({
      eventType: 'PAYMENT_ON_TIME',
      timestamp: Math.floor(Date.now() / 1000),
      evidenceHash: ethers.keccak256(ethers.toUtf8Bytes('SETTLEMENT-PROOF')),
      actor: store.buyer.address
    });

    await saveStore(store);

    const creditState = ContractCreditEngine.calculateCreditState(store.events);
    res.json({ success: true, agreement: store, creditState });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ PACT Protocol Server with Upstash Redis listening on port ${PORT}`);
});
