# 03 — Core Engines (Contract Credit Rating & Receivable Crystallization)

**What to build:** Protocol engines (`ContractCreditEngine.ts` and `ReceivableEngine.ts`) calculating evidence-backed contract credit scores (Payment, Performance, Disputes, Compliance) and crystallizing accepted obligations into `PACT-IN-1` legal assignments.

**Blocked by:** 02 — Smart Contracts & Encumbrance Claim Fingerprinting

**Status:** COMPLETED ✅

- [x] `ContractCreditEngine.ts` calculating evidence-derived score breakdown and contract health rating
- [x] `ReceivableEngine.ts` crystallizing delivery obligations into legally enforceable receivables under `PACT-IN-1` (Indian Factoring Regulation Act, Sec. 7)
- [x] `EncumbranceEngine.ts` claim fingerprint generator and collision detector
- [x] Passing unit tests verifying credit score drops on missed delivery and receivable crystallization (`codebase/src/engine/engine.test.ts`)
