# PACT Domain Glossary & Architecture Context

## Core Terms

### Verified Agreement Asset (VAA)
A protocol-managed financial representation of a verified contractual economic position whose state, performance evidence, financing eligibility, and ownership/assignment history can be continuously verified on-chain.

### Cleanverse Verified Asset (CVA)
The compliance-native ERC-20 asset rail issued under the Cleanverse Compliance Protocol (CCP). Every transfer is gated through Cleanverse Verified Identity (CVI) compliance verification and RuleV2 policy checks.

### Cleanverse Verified Identity (CVI / A-Pass)
The on-chain identity credential bound to participant wallet addresses. Contains verification tier (0-99), sub-tier, allowed group, allowed sub-group, and ISO country bitmap tags.

### RuleV2
The compliance policy data structure used by the Cleanverse compliance engine to evaluate transfer and transaction permissions. Contains `allowedGroup`, `allowedSubGroup`, `minTier`, `minSubTier`, and `poolCountryBitmap`. Fields within a rule are evaluated with `AND` logic; multiple rules are evaluated with `OR` logic.

### Contract Credit State
The evidence-derived risk condition of a specific contractual economic relationship. Differs from entity-level credit or CVI compliance tier. Derived deterministically from observable performance, payment, dispute, and evidence events.

### Receivable Crystallization
The deterministic economic transition of a contractual obligation from a future performance expectation into an immediately claimable and legally enforceable payment obligation upon verified buyer acceptance.

### Encumbrance & Claim Fingerprint
A unique cryptographic fingerprint computed as `hash(agreementHash, obligor, beneficiary, obligationId, amount, dueDate)` used to verify that a real-world contractual claim has not been previously assigned, pledged, or double-financed.

### Jurisdictional Wrapper
The legal translation module (`PACT-IN-1` for Indian MSME Factoring, `PACT-SG-1` for Singapore baseline) that defines how real-world commercial events map into protocol state transitions under specific local laws.

### Legal Event
A structured real-world, legal, or commercial occurrence (`AGREEMENT_EXECUTED`, `DELIVERY_ACCEPTED`, `RECEIVABLE_ASSIGNED`, `DELIVERY_MISSED`, `COMPLIANCE_SUSPENDED`) bound to an immutable off-chain evidence content hash.

---

## Flagship Domain Configuration (`PACT-IN-1`)

### Demo Entity Context
* **Supplier**: ABC Components Pvt Ltd (GSTIN/CVI Verified)
* **Buyer**: LargeCorp India (Corporate CVI Verified, Tier >= 30)
* **Financier**: ABC Capital (Institutional CVI Verified)
* **Underlying Asset**: 12-Month Supply Agreement for Automotive Parts
* **Total Contract Value**: ₹12,000,000 INR (12 Monthly Deliveries of ₹1,000,000 INR, Net-30 payment terms)

### Integration Scope
* **Cleanverse Environment**: Live Cleanverse Cooperate API v5.6 UAT Server (`https://uatapi.cleanverse.com/api/cooperate`)
* **Encryption standard**: AES/CBC/PKCS5Padding with 16 zero-byte IV
* **Validator Enforcement**: Direct on-chain `complianceVerify()` inside `PactAgreement.sol`
