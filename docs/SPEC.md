# PACT Protocol v2.0 — Comprehensive Functional & Technical Specification

## 1. Executive Protocol Overview

**PACT (Programmable Agreement Capital Technology)** is an institutional contract-to-capital infrastructure protocol built on the **Cleanverse Compliance Protocol (CCP v5.6)**. PACT converts legally executed commercial agreements into continuously observable, programmable economic relationships and turns their crystallized contractual rights into compliance-native financial assets (`CVA`).

Unlike traditional RWA tokenization platforms that attempt to tokenize static PDF invoices *after* issuance, PACT operates upstream across the entire contractual lifecycle:

```text
LEGAL AGREEMENT (PDF / Indian MSME Supply Agreement or CRE Lease)
       │
       ▼
VERIFIED PARTIES (Cleanverse CVI Tier Verification)
       │
       ▼
12 STRUCTURED OBLIGATIONS (Monthly Deliveries / Lease Rent Claims)
       │
       ▼
ONCHAIN LEGAL EVENTS (LegalEventRegistry.sol + SHA-256 Hashes)
       │
       ▼
CONTRACT CREDIT ENGINE (Evidence-Derived Scores: Payment 96, Performance 93 → 68)
       │
       ▼
RECEIVABLE CRYSTALLIZATION (ReceivableEngine.ts: PENDING → CRYSTALLIZED)
       │
       ▼
STATUTORY LEGAL ASSIGNMENT (`PACT-IN-1` Factoring Act Sec 7 & IT Act Sec 10A)
       │
       ▼
ANTI-DOUBLE-FINANCING GUARD (EncumbranceRegistry.sol: Keccak-256 claimFingerprint)
       │
       ▼
COMPLIANT CAPITAL ASSET (Cleanverse CVA ERC20 + RuleV2 Policy)
```

---

## 2. Core Subsystem Architecture

### A. Borrower Contract Tokenization & AI Extraction Subsystem
1. **Preset Demonstration Scenarios**:
   - **Scenario 1: MSME Automotive Parts Supply Agreement (`PACT-IN-001`)**: *ABC Components Pvt Ltd* $\leftrightarrow$ *LargeCorp / TATA India* (₹1.2 Crore total value, 12 monthly deliveries @ ₹1,000,000 / mo).
   - **Scenario 2: Commercial Real Estate Lease Tokenization (`PACT-CRE-002`)**: *Vanguard Commercial Realty* $\leftrightarrow$ *Nexus Tech Solutions* (₹36 Lakh 3-year commercial rental income stream, 3rd contract renewal tenure, Bureau Veritas 3rd-party structural inspection report hash attached).
2. **AI LLM Extraction Engine**: Parses contract obligations, payment terms, deposit guarantees, renewal tenure history, and 3rd-party inspection audit report SHA-256 hashes (`0x91a4f0...`).
3. **Borrower Demo Stepper**:
   - Step 1: Select Preset Contract Scenario (MSME Supply vs CRE Lease)
   - Step 2: Ingest Signed PDF Document & Verify Document SHA-256 Hash
   - Step 3: Extract Contract Parameters, Clauses & Proof Attachments
   - Step 4: Verify Backend Directories (Cleanverse CVI Tier 30+, `IAPassComplianceValidator` Registration, `EncumbranceRegistry` Anti-Double-Financing Guard) $\rightarrow$ Tokenize & Publish to Financier Marketplace.

### B. Upstash Redis Real-Time Multi-Agreement Persistence
- **Storage Layer**: Uses `@upstash/redis` to persist active contract state stores under key `pact:agreements:<id>` and tracks all listings in the Redis set `pact:agreement_ids`.
- **Marketplace Sync**: When a borrower tokenizes a contract, it is saved to Upstash Redis in real time (`POST /api/agreements/create`). The Financier Marketplace dynamically queries `GET /api/agreements` to display live active listings.

### C. Cleanverse CVI & RuleV2 Policy Engine
- **Identity Gating**: Counterparties (Supplier/Assignor, Buyer/Obligor, Financier/Assignee) must hold Cleanverse Verified Identity (`CVI`) Tier 30+ ratings.
- **RuleV2 Compliance Policy Struct**:
  ```solidity
  struct RuleV2 {
      bytes2 allowedGroup;       // Allowed CVI group
      bytes2 allowedSubGroup;    // Allowed CVI sub-group
      uint8 minTier;             // Minimum CVI tier (0-99)
      uint8 minSubTier;          // Minimum sub-tier (0-99)
      bool isBlackList;          // Blacklist flag
      uint256 countryBitmap;     // Country bitmap (e.g. 356 for India, 702 for Singapore)
  }
  ```
- **Single-Contract Validator Hook**: Every state transition calls `IAPassComplianceValidator.complianceVerify(poolAddress, userAddress)` onchain. Failed compliance automatically redirects payments into the Cleanverse `SUSPENDED` suspense pool without losing funds.

### D. Evidence-Derived Contract Credit Engine (`ContractCreditEngine.ts`)
Calculates multi-dimensional risk scores from observable legal events:
- **Payment Reliability**: 0 - 100 (Increased on `PAYMENT_ON_TIME`, decreased on `PAYMENT_LATE`).
- **Performance Reliability**: 0 - 100 (Increased on `DELIVERY_ACCEPTED`, degraded to 68 on `DELIVERY_MISSED`).
- **Dispute Exposure**: 0 - 100 (Decreased when clean, increased on `DISPUTE_OPENED`).
- **Contract Stability**: 0 - 100 (Higher for multi-renewal tenures and Grade-A 3rd-party property audit certificates).
- **Compliance Status**: `PASS` | `FAIL`.
- **Assignment Integrity**: `UNENCUMBERED` | `ASSIGNED` | `CONFLICT`.

### E. Encumbrance & Anti-Double-Financing Guard (`EncumbranceRegistry.sol`)
Computes an immutable Keccak-256 fingerprint for every payment claim before financing:
```solidity
claimFingerprint = keccak256(abi.encodePacked(
    agreementHash, obligor, beneficiary, obligationId, amount, dueDate
));
```
Rejects duplicate registration attempts if a claim is already assigned or pledged elsewhere.

### F. Statutory Legal Enforceability Wrappers
- **`PACT-IN-1` (India Flagship)**:
  - **Factoring Regulation Act, 2011 (Sec 7)**: Statutory assignment of crystallized receivables to financier with binding notice to debtor.
  - **Information Technology Act, 2000 (Sec 10A & 3A)**: EIP-191 `personal_sign` digital signatures on electronic contracts.
  - **Indian Evidence Act, 1872 (Sec 65B)**: Onchain SHA-256 evidence hashes producing court-admissible certificates.
- **`PACT-SG-1` (Singapore Baseline)**: Cleanverse International Pte. Ltd. native protocol environment under Singapore law & arbitration.

---

## 3. End-to-End User Journeys

### Borrower / Contract Creator Journey
1. Open **Borrower Portal** and select a contract scenario (Option 1: MSME Automotive Supply Agreement or Option 2: Commercial Real Estate Lease).
2. Inspect the PDF agreement document, document SHA-256 hash, and launch the **AI Clause & Risk Extraction Pipeline**.
3. Review extracted contract parameters, payment terms, deposit guarantees, and attached 3rd-party property inspection certificates (Bureau Veritas Grade-A Report `0x91a4f0...`).
4. Execute **Backend Directory Checks** (Cleanverse CVI Tier 30+, `IAPassComplianceValidator` Registration, `EncumbranceRegistry` Anti-Double-Financing Guard).
5. Click **Tokenize & Publish to Financier Marketplace** to persist the contract in Upstash Redis and make it available to lenders.

### Financier / Institutional Lender Journey
1. Open **Financier Marketplace Dashboard** to view all active tokenized listings fetched in real time from Upstash Redis (`GET /api/agreements`).
2. Inspect the credit scorecard (Payment Reliability, Performance Score, Tenant/Buyer Rating, 3rd-party inspection proofs, legal wrapper).
3. Click **Underwrite & Fund CVA Capital Position** to execute the onchain funding transaction, issuing CVA ERC-20 tokens at a 3.0% - 4.5% APR yield discount.
4. Monitor live portfolio performance, track escrow disbursements, and trigger compliance freeze/unfreeze actions via the Cleanverse Suspense Pool.

---

## 4. Technology Stack & Directory Structure

```text
codebase/
├── contracts/
│   ├── PactAgreement.sol               # State machine (DRAFT, ACTIVE, AT_RISK, SUSPENDED, SETTLED)
│   ├── EncumbranceRegistry.sol         # Anti-double-financing Keccak-256 claim fingerprint guard
│   ├── LegalEventRegistry.sol          # Onchain legal event ledger linked to SHA-256 evidence hashes
│   ├── PactCapital.sol                 # CVA capital vault & suspense pool manager
│   ├── IATokenPolicy.sol               # Cleanverse CVA RuleV2 policy interface
│   └── IAPassComplianceValidator.sol   # Cleanverse compliance validator interface
├── src/
│   ├── api/
│   │   ├── server.ts                   # Express server on port 3002 with Upstash Redis persistence
│   │   └── server.test.ts              # API server integration test suite
│   ├── cleanverse/
│   │   ├── client.ts                   # Cooperate API v5.6 client
│   │   ├── encryption.ts               # AES-256 payload encryption & Base64 key handler
│   │   └── types.ts                    # RuleV2 & Cleanverse v5.6 TypeScript types
│   ├── engine/
│   │   ├── ContractCreditEngine.ts     # Multi-dimensional evidence-derived credit engine
│   │   ├── ReceivableEngine.ts         # Obligation crystallization pipeline (PENDING -> CRYSTALLIZED)
│   │   └── EncumbranceEngine.ts        # Claim fingerprint calculation & collision detector
│   └── web3/
│       └── eipSigning.ts               # EIP-191 personal_sign owner signature generator
└── apps/web/
    ├── index.html                      # Entry HTML with Tailwind CSS & Juicebox design tokens
    ├── src/
    │   ├── App.tsx                     # Multi-role dApp UI (Landing Page, Borrower Portal, Financier Marketplace)
    │   ├── index.css                   # Juicebox design system framing (.jb-framed-container, .jb-purple-canvas)
    │   └── main.tsx                    # React DOM renderer
    └── vite.config.ts                  # Vite proxy config (Target: http://localhost:3002)
```
