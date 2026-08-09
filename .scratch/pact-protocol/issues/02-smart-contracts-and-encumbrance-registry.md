# 02 — Smart Contracts & Encumbrance Claim Fingerprinting

**What to build:** Onchain Solidity smart contract suite (`PactAgreement.sol`, `PactCapital.sol`, `LegalEventRegistry.sol`, `EncumbranceRegistry.sol`) with real-world claim fingerprinting and `IAPassComplianceValidator.complianceVerify()` onchain gating.

**Blocked by:** 01 — Base Cleanverse Client & EIP-191 Signing Infrastructure

**Status:** COMPLETED ✅

- [x] `EncumbranceRegistry.sol` tracking deterministic claim fingerprints `hash(agreementHash, obligor, beneficiary, obligationId, amount, dueDate)`
- [x] `LegalEventRegistry.sol` recording event-sourced legal records linked to SHA-256 evidence hashes
- [x] `PactAgreement.sol` state machine (`DRAFT`, `ACTIVE`, `AT_RISK`, `SUSPENDED`, `COMPLETED`) with `validator.complianceVerify()` hooks
- [x] `PactCapital.sol` capital position manager and Cleanverse compliance suspense pool
- [x] Passing unit tests verifying state transitions and double-financing block (`codebase/src/contracts/contracts.test.ts`)
