# 04 — Protocol Express API Server Integration

**What to build:** Express API protocol server (`codebase/src/api/server.ts` on port 3002) connecting Web UI clients to smart contracts, credit engines, and Cleanverse API hooks.

**Blocked by:** 03 — Core Engines (Contract Credit Rating & Receivable Crystallization)

**Status:** COMPLETED ✅

- [x] `GET /api/agreements/seeded` returning seeded Indian MSME agreement state and contract credit rating
- [x] `POST /api/agreements/activate` activating draft agreement with Cleanverse CVI compliance checks
- [x] `POST /api/agreements/deliver-and-finance` accepting delivery, crystallizing receivable, verifying encumbrance, and generating EIP-191 signature
- [x] `POST /api/agreements/simulate-missed-delivery` dropping credit score to 68 and setting state to `AT_RISK`
- [x] `POST /api/agreements/simulate-cvi-freeze` & `restore-cvi` managing Cleanverse suspense pool
- [x] Integration unit test verifying HTTP responses (`codebase/src/api/server.test.ts`)
