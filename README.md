# PACT — Programmable Agreement Capital Technology

> **PACT converts contractual relationships into continuously underwritten, legally attributable financial assets.**

PACT is a contractual financial infrastructure protocol built for the **Cleanverse RWA Issuance Hackathon**. It transforms legally executed commercial agreements into continuously observable economic positions. It records contractual and legal events, derives a live credit state from actual performance evidence, and converts crystallized contractual rights into compliant financial assets through Cleanverse CVA rails.

---

## ⚡ Key Highlights & Core Thesis

- **Underlying Asset**: The underlying asset is **not merely the token** — it is the **verified contractual economic relationship**.
- **Continuous Credit Underwriting**: Derived from verifiable events (`DELIVERY_ACCEPTED`, `PAYMENT_ON_TIME`, `DELIVERY_MISSED`, `COMPLIANCE_SUSPENDED`, `COMPLIANCE_RESTORED`).
- **Statutory Legal Shield**:
  - **`PACT-IN-1` (India Flagship)**: Section 7 of the **Factoring Regulation Act, 2011** (Receivable Assignment), Section 10A of the **IT Act, 2000** (EIP-191 digital signatures), and Section 65B of the **Indian Evidence Act, 1872** (Onchain SHA-256 Audit Trail).
  - **`PACT-SG-1` (Singapore Baseline)**: Cleanverse International Pte. Ltd. native protocol environment (Singapore law & arbitration framework).
- **Anti-Double-Financing Guard**: Computes Keccak-256 `claimFingerprint = keccak256(agreementHash, obligor, beneficiary, obligationId, amount, dueDate)` on `EncumbranceRegistry.sol` to block duplicate factoring claims.
- **Cleanverse Compliance Integration**:
  - CVI Tier 30+ identity verification for counterparties.
  - Single-contract / compliance pool registration with `IAPassComplianceValidator.sol`.
  - CVA ERC-20 token issuance with `RuleV2` policy (`minTier`, `subTier`, `countryBitmap`, `isBlackList`).

---

## 🏗️ Core Architecture & Subsystems

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

## 🚀 Quickstart & Setup

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm** or **npx**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/shreyan001/PACT.git
cd PACT/codebase

# Install dependencies
npm install
```

### 3. Running Unit & TDD Test Suite
```bash
npx tsx src/cleanverse/cleanverse.test.ts
npx tsx src/contracts/contracts.test.ts
npx tsx src/engine/engine.test.ts
npx tsx src/api/server.test.ts
npx tsx src/apps/web.test.ts
```

### 4. Compiling & Testing Smart Contracts on EVM
```bash
npx tsx src/contracts/deploy_and_test_contracts.ts
```

### 5. Running the Express API Server & Web UI
```bash
# Terminal 1: Start Express Protocol API Server (Port 3002)
npx tsx src/api/server.ts

# Terminal 2: Start Vite Web UI (Port 3000)
npx vite apps/web
```
Open **`http://localhost:3000/`** in your browser to interact with the full dApp!

---

## 📜 License
MIT License. Developed for the Cleanverse RWA Issuance Hackathon.
