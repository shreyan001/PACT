# PACT Protocol — Functional & Technical Specification

## Problem Statement

Traditional RWA tokenization models attempt to tokenize static PDF invoices *after* they are issued, treating compliance as a superficial frontend badge and ignoring the underlying commercial relationship. This introduces severe systemic risks:
1. **Double-Financing & Fraud**: A supplier can tokenize an invoice onchain while simultaneously factoring it at traditional banks.
2. **Static Compliance**: Compliance is evaluated once during onboarding rather than enforced onchain per transaction.
3. **Lack of Performance Evidence**: Static tokens cannot observe whether the seller actually delivered goods, whether the buyer accepted them, or if performance has degraded.
4. **Unsupported Legal Claims**: Claiming token minting automatically transfers legal ownership without a valid jurisdictional factoring wrapper.

## Solution

**PACT (Programmable Agreement Capital Technology)** is a contract-to-capital infrastructure protocol built on Cleanverse. PACT turns legally executed commercial agreements into continuously observable, programmable economic relationships:
1. Tracks obligations from pre-performance to buyer delivery acceptance.
2. Crystallizes earned payment rights under a jurisdiction-specific legal wrapper (`PACT-IN-1` for Indian MSME Factoring under Section 7 of the Factoring Regulation Act).
3. Verifies real-world claim fingerprints (`claimFingerprint`) in an `EncumbranceRegistry` to block duplicate financing.
4. Maintains an evidence-derived **Contract Credit Engine** evaluating performance reliability, payment reliability, dispute exposure, and evidence integrity.
5. Integrates Cleanverse Verified Assets (`CVA`) and `RuleV2` compliance policies, ensuring every onchain action calls `IAPassComplianceValidator.complianceVerify()` directly.

## User Stories

1. As a Supplier (e.g. ABC Components Pvt Ltd), I want to ingest a signed commercial supply agreement into PACT, so that my 12 monthly delivery obligations are structured into machine-readable contract states.
2. As a Supplier, I want my buyer (LargeCorp India) to be verified via Cleanverse CVI, so that I know my counterparty satisfies institutional compliance tiers.
3. As a Supplier, I want to record delivery fulfillment evidence (SHA-256 content hash) when I complete a shipment, so that my contractual obligation can transition towards crystallization.
4. As a Buyer (LargeCorp India), I want to confirm delivery acceptance onchain, so that the underlying payment obligation officially crystallizes into an enforceable receivable under the `PACT-IN-1` legal wrapper.
5. As a Supplier, I want to legally assign a crystallized receivable to a financier, so that I can access immediate working capital before the 30-day payment term expires.
6. As a Financier (ABC Capital Finance), I want PACT to calculate a unique `claimFingerprint` and check the `EncumbranceRegistry`, so that I am 100% protected against double-financing or duplicate assignments.
7. As a Financier, I want to fund an assigned receivable position and receive a compliance-native `CVA` token, so that my capital position is represented by an asset whose transfers are gated by Cleanverse `RuleV2` policies.
8. As a Financier, I want to observe a real-time, evidence-derived Contract Credit Rating (Payment Reliability, Performance Reliability, Dispute Exposure), so that I can monitor the credit health of the specific contractual relationship.
9. As a Hackathon Judge, I want to simulate a missed delivery event, so that I can observe the Contract Credit score drop live (93 → 68) and the contract state shift to `AT_RISK` with click-to-inspect evidence hashes.
10. As a Cleanverse Compliance Inspector, I want the business contract to call `validator.complianceVerify()` directly during state transitions, so that ineligible callers are automatically blocked onchain.
11. As a Cleanverse Compliance Inspector, I want payments to ineligible or frozen recipients to transition into a `SUSPENDED` suspense pool, so that funds are accounted for without being lost or permanently locked.
12. As a Financier whose CVI eligibility is restored, I want suspended payments to automatically transition to `RELEASED` & settled, so that my capital position settles cleanly once compliance is re-verified.

## Implementation Decisions

### Module Layout (`codebase/`)
All application code lives strictly inside `codebase/`:
* **Smart Contracts** (`codebase/contracts/`):
  * `PactAgreement.sol`: Main agreement state machine (`DRAFT`, `ACTIVE`, `AT_RISK`, `SUSPENDED`, `COMPLETED`) with `IAPassComplianceValidator.complianceVerify()` hooks.
  * `LegalEventRegistry.sol`: Event-sourced legal ledger recording SHA-256 evidence hashes.
  * `EncumbranceRegistry.sol`: Anti-double-financing registry tracking claim fingerprints.
  * `PactCapital.sol`: Capital position vault, CVA minter bridge, and suspense pool manager.
* **Cleanverse API Client** (`codebase/src/cleanverse/`):
  * `encryption.ts`: Cleanverse AES/CBC/PKCS5Padding encryption/decryption module with 16 zero-byte IV and Base64 key normalization.
  * `client.ts`: Cooperate API v5.6 HTTP client (`/generate_apass`, `/update_status`, `/atoken/launch`, `/validator/register`, `/validator/verify`).
* **Web3 Utilities** (`codebase/src/web3/`):
  * `eipSigning.ts`: Generates EIP-191 `personal_sign` owner signatures for Cleanverse contract registration.
* **Protocol Engines** (`codebase/src/engine/`):
  * `ContractCreditEngine.ts`: Evidence-derived credit rating calculator.
  * `ReceivableEngine.ts`: Obligation crystallization engine under `PACT-IN-1`.
  * `EncumbranceEngine.ts`: Claim fingerprint calculation and collision detector.
* **Backend Server** (`codebase/src/api/server.ts`):
  * Express protocol server running on port `3002`.
* **Web Frontend** (`codebase/apps/web/`):
  * Vite + React dashboard built using the **Juicebox (PeopleGPT) Token-Driven Design System**.

### Inlined Prototype Decisions

```solidity
// Encumbrance Claim Fingerprint (Section 29 Decision)
claimFingerprint = keccak256(abi.encodePacked(agreementHash, obligor, beneficiary, obligationId, amount, dueDate));
```

```typescript
// Cleanverse AES Encryption & EIP-191 Owner Signature (Section 67 Decision)
const payloadString = `${chain.toLowerCase()}${contractAddress.toLowerCase()}`;
const signature = await wallet.signMessage(ethers.getBytes(ethers.keccak256(ethers.toUtf8Bytes(payloadString))));
```

## Testing Decisions

### Seam Breakdown
1. **Seam 1 — Prototype & Math Sanity Checks** ([`codebase/.scratch/prototype_sanity_check.ts`](file:///C:/Users/acer/OneDrive/Desktop/PACT/codebase/.scratch/prototype_sanity_check.ts)): Evaluates AES encryption/decryption, EIP-191 signatures, claim fingerprinting, and credit scoring algorithms directly.
2. **Seam 2 — Protocol API Endpoint Integration**: Verifies Express server routes (`/api/agreements/seeded`, `/api/agreements/activate`, `/api/agreements/deliver-and-finance`, `/api/agreements/simulate-missed-delivery`, `/api/agreements/simulate-cvi-freeze`, `/api/agreements/restore-cvi`).
3. **Seam 3 — Production Frontend Build Verification**: Executes `npx vite build apps/web` in `codebase/` to ensure zero compilation or styling errors.

## Out of Scope

* Automated cross-border court litigation execution (flagship demo models legal assignment under Indian Factoring Act `PACT-IN-1`).
* Machine-learning black-box credit scoring (credit ratings are strictly evidence-derived via `ContractCreditEngine.ts`).

## Further Notes

* Adheres strictly to [`AGENTS.md`](file:///C:/Users/acer/OneDrive/Desktop/PACT/AGENTS.md) rules and [`ethskills`](file:///C:/Users/acer/OneDrive/Desktop/PACT/.agents/skills/ethskills/SKILL.md) guidelines (onchain naming, EIP-191 message signing, 6-decimal token formatting, 2-contract core architecture).
