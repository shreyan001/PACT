# PACT
# Programmable Agreement Capital Technology

## Deep Integration & Build Specification
### Cleanverse RWA Issuance Hackathon
### Version: PACT Protocol Architecture v2

---

# 0. AGENT DIRECTIVE

You are building **PACT — Programmable Agreement Capital Technology**.

This repository is a hackathon implementation, but the architecture must be designed around a serious long-term protocol thesis.

Do not build a generic RWA tokenization dashboard.

Do not build "AI reads PDF → mint token."

Do not build an invoice marketplace with a different frontend.

Do not treat compliance as a frontend badge.

The intended protocol is:

> **PACT converts legally executed agreements into continuously observable, programmable economic relationships and turns their crystallized contractual rights into compliance-native financial assets.**

The important insight is that the **underlying asset is not merely the token**.

The underlying asset is the:

> **verified contractual economic relationship**

and its evolving:

- obligations
- performance
- legal events
- evidence
- credit state
- payment rights
- assignments
- compliance state
- settlement state

The Cleanverse CVA is the compliant financial-asset rail around that economic position.

---

# 1. SOURCE MATERIAL IS AUTHORITATIVE

The repository will be accompanied by the following source documents.

Read them before implementing their corresponding integrations.

## Cleanverse sources

### 1. Cleanverse Compliance Protocol — CVA Integration Guide

File:

`Cleanverse Compliance Protocol (CCP) CVA Integration Guide.txt`

Use it for:

- CVA architecture
- RuleV2
- CVA issuance
- API Launch
- custom CVA path
- Cleanverse review
- MINTER_ROLE
- compliance hooks
- CVA operational controls

The guide describes CVA as the compliant ERC-20 asset standard with CVI verification and RuleV2-based transfer compliance. It supports both API Launch and custom-contract integration.

The guide explicitly says that API Launch is appropriate when the developer already has backend infrastructure and wants automated issuance without maintaining CVA contract code.

Prefer the official API Launch path for the hackathon unless actual integration constraints require the custom path.

---

### 2. Cleanverse Compliance Protocol — CVI Compliance Validator Guide

File:

`Cleanverse_Compliance_Protocol_CCP_Integration_Guide_For_CVI_Compliance (1).md`

Use it for:

- `IAPassComplianceValidator`
- RuleV2
- compliance pools
- `registerV2`
- `registerApass`
- `complianceVerify`
- single-contract mode
- factory mode
- business-contract enforcement

The guide explicitly describes a single-contract integration in which:

```text
deploy business contract
        ↓
register contract with validator
        ↓
configure rules
        ↓
user calls business method
        ↓
business contract calls complianceVerify()
        ↓
pass → execute
fail → revert
```

PACT should follow this architecture.

---

### 3. Cleanverse API v5.6

File:

`cleanverse_api_docs.md`

Use it for exact:

- endpoint names
- request schemas
- response schemas
- authentication
- encryption
- request IDs
- A-Pass operations
- A-Token/CVA operations
- Validator operations
- status queries
- transaction queries

Do not invent API endpoints.

Do not rely on old Cleanverse API examples if v5.6 provides the current implementation.

The source document identifies itself as Cleanverse API v5.6 and includes A-Pass Management, A-Token Management, Validator Compliance, transaction queries, Travel Rule reports and other modules.

---

### 4. Hackathon project listing

The supplied project listing contains the original PACT concept.

The original PACT proposal says:

- contracts are static documents;
- future contractual cash flows remain illiquid;
- PACT introduces Verified Agreement Assets (VAAs);
- AI extracts counterparties, obligations, payment schedules and metadata;
- parties complete CVI;
- the agreement becomes a CVA;
- compliance rules attach from issuance;
- investors hold compliant exposure;
- agreement state evolves through Healthy / At Risk / Default / Completed.

That is the **starting point**, not the final architecture.

The architecture in this document deliberately deepens the original idea by adding:

- Contract Credit State
- Legal Event Registry
- legal execution/assignment layer
- receivable crystallization
- jurisdictional wrappers
- evidence provenance
- duplicate/encumbrance controls
- financing eligibility

Do not remove the VAA concept.

Refine its meaning.

---

# 2. THE CORE THESIS

PACT is not an RWA marketplace.

PACT is a:

> **contract-to-capital infrastructure protocol.**

The economic pipeline is:

```text
LEGAL AGREEMENT
      ↓
VERIFIED PARTIES
      ↓
STRUCTURED OBLIGATIONS
      ↓
LEGAL / ECONOMIC EVENTS
      ↓
CONTRACT STATE
      ↓
CONTRACT CREDIT STATE
      ↓
PERFORMED / CRYSTALLIZED RIGHTS
      ↓
LEGAL ASSIGNMENT / FINANCING
      ↓
VERIFIED AGREEMENT ASSET
      ↓
CVA
      ↓
COMPLIANT CAPITAL
      ↓
SETTLEMENT
      ↓
NEW CONTRACT EVENT
      ↓
CREDIT STATE UPDATE
```

This is the fundamental loop.

---

# 3. WHY EXISTING RWA TOKENIZATION IS INSUFFICIENT

Traditional RWA tokenization usually begins with something already financialized:

```text
invoice
bond
property
fund share
warehouse receipt
receivable
```

and turns it into:

```text
token
```

PACT starts earlier.

```text
contract
 ↓
obligation
 ↓
performance
 ↓
economic right
 ↓
financialization
```

This matters because most commercial relationships contain economic value before they become invoices or receivables.

A contract may contain:

- future payments
- delivery obligations
- purchase commitments
- service obligations
- penalties
- renewal rights
- termination rights
- performance conditions
- acceptance conditions
- payment triggers

PACT makes those states machine-readable and eventually financeable.

---

# 4. THE MOST IMPORTANT CORRECTION

Do NOT assume:

```text
future contractual promise
=
receivable
```

These are different legal/economic states.

PACT must distinguish:

## State A — Future contractual right

Example:

```text
12 deliveries
₹1.2M total
```

The supplier has contractual rights subject to future performance.

This may be valuable and underwriteable, but it is not automatically the same thing as an immediately due receivable.

---

## State B — Earned / crystallized payment obligation

Example:

```text
delivery completed
buyer accepted delivery
payment condition satisfied
₹100,000 now payable
```

The contractual obligation has crystallized into a stronger payment claim.

---

## State C — Assigned receivable / financing position

Example:

```text
supplier
   ↓
legal assignment
   ↓
financier
```

Now the financier has the legally documented economic right defined by the assignment structure.

PACT should record this transition.

---

# 5. THIS IS THE COMMERCIAL BREAKTHROUGH

The primary PACT flow should be:

```text
PURCHASE AGREEMENT
       ↓
DELIVERY
       ↓
ACCEPTANCE
       ↓
PAYMENT OBLIGATION
       ↓
RECEIVABLE
       ↓
ASSIGNMENT
       ↓
FINANCING
```

not:

```text
PDF
 ↓
NFT
```

This gives PACT a much stronger position than generic RWA tokenization.

---

# 6. FLAGSHIP USE CASE

## Indian MSME supply-chain financing

Use this as the primary commercial demonstration.

Example:

```text
Supplier:
ABC Components Pvt Ltd

Buyer:
LargeCorp India

Contract:
12-month supply agreement

Total contract value:
₹12,000,000

Monthly delivery:
₹1,000,000

Payment:
30 days after acceptance
```

PACT ingests the signed agreement.

It creates:

```text
12 contractual obligations
```

Then:

```text
delivery #1
   ↓
accepted
   ↓
₹1M payable
   ↓
receivable crystallized
   ↓
assignment to financier
   ↓
compliant financial exposure
```

This is the vertical.

The protocol underneath must remain generic.

---

# 7. WHY INDIA IS THE BEST FLAGSHIP

India is useful because there is already a real legal/regulatory ecosystem around receivables assignment and factoring.

The Factoring Regulation Act provides a framework for assignment of receivables, including assignment, notice, rights and obligations, registration of certain assignments, and related matters.

Section 7 specifically addresses written assignment of receivables and the rights/remedies that vest in the assignee.

RBI regulations also address registration of assignments of receivables transactions through TReDS.

PACT should therefore not invent the legal concept of receivable assignment.

Instead:

> **PACT should become the programmable infrastructure connecting the underlying commercial agreement, its performance evidence, receivable crystallization, legal assignment, financing and compliant on-chain representation.**

Do not claim PACT itself is a factor, TReDS, bank, NBFC or regulated financier.

The demo can model the workflow.

Production deployment would require appropriate regulated entities and legal counsel.

---

# 8. JURISDICTION STRATEGY

PACT must be jurisdiction-aware.

Do NOT make PACT globally "Indian."

Do NOT make PACT globally "American."

Do NOT hard-code a single legal system into the core protocol.

Use:

```text
PACT CORE
    │
    ├── PACT-SG
    ├── PACT-IN
    └── PACT-US
```

The protocol core is jurisdiction-neutral.

---

# 9. BASELINE JURISDICTION

## Singapore

Use Singapore as the **protocol baseline**.

Reason:

Cleanverse's official Terms identify Cleanverse as operated by **Cleanverse International Pte. Ltd., incorporated in Singapore**, and the Terms specify Singapore law and Singapore courts for the Cleanverse service relationship.

This does NOT mean PACT automatically becomes a Singapore legal instrument.

It means:

> Singapore is the natural Cleanverse-native protocol environment.

The PACT architecture should therefore define:

```text
PACT-SG
```

as the baseline legal wrapper.

---

# 10. INDIA AS FLAGSHIP

The actual commercial demo should be:

```text
PACT-IN
```

for an Indian MSME supply agreement.

This gives the project:

```text
Cleanverse-native baseline
        +
real Indian financing problem
        +
real receivables framework
```

This is better than pretending the entire protocol is Indian.

---

# 11. USA SHOULD NOT BE THE MVP BASELINE

Do not choose the USA as the primary implementation.

The US creates a very large legal surface:

- securities law
- UCC
- assignment restrictions
- securities exemptions
- state-level issues
- investment company considerations
- money transmission
- federal/state regulatory questions

PACT-US can exist as a future wrapper.

Do not spend hackathon time implementing it.

---

# 12. JURISDICTION CONFIGURATION

Every PACT agreement should conceptually have:

```typescript
type JurisdictionConfig = {
    jurisdiction: string;
    legalWrapperVersion: string;
    governingLaw: string;
    disputeMechanism: string;
    assignmentFramework: string;
    electronicExecutionFramework: string;
};
```

Example:

```json
{
  "jurisdiction": "IN",
  "legalWrapperVersion": "PACT-IN-1",
  "governingLaw": "India",
  "assignmentFramework": "RECEIVABLE_ASSIGNMENT",
  "electronicExecutionFramework": "ELECTRONIC_EXECUTION"
}
```

This is metadata and protocol configuration.

It is not a substitute for legal advice.

---

# 13. LEGAL WRAPPER

PACT needs a first-class concept called:

```text
Legal Wrapper
```

The wrapper defines how the real-world agreement maps into the financial workflow.

It may define:

- governing law
- assignment mechanism
- consent requirements
- debtor acknowledgement
- notice requirements
- payment direction
- dispute mechanism
- amendment process
- default mechanism
- electronic execution
- evidence requirements
- data handling
- blockchain-record acknowledgement

The smart contract records the relevant state.

It does not magically create legal validity.

---

# 14. CRITICAL LEGAL PRINCIPLE

Never design:

```text
TOKEN MINTED
     ↓
therefore
LEGAL OWNERSHIP EXISTS
```

Instead:

```text
LEGAL EVENT
     ↓
legal evidence / agreement / assignment
     ↓
PACT records corresponding event
     ↓
economic state changes
     ↓
financial instrument represents that state
```

The blockchain is the technical execution/evidence layer.

The applicable legal wrapper determines the legal relationship.

---

# 15. LEGAL EVENT REGISTRY

Create a first-class PACT module:

```text
LegalEventRegistry
```

Every meaningful real-world/legal event should become a structured event.

Examples:

```text
AGREEMENT_EXECUTED
PARTY_VERIFIED
AGREEMENT_ACTIVATED
OBLIGATION_CREATED
DELIVERY_PERFORMED
DELIVERY_ACCEPTED
PAYMENT_OBLIGATION_CRYSTALLIZED
RECEIVABLE_CREATED
RECEIVABLE_ASSIGNED
ASSIGNMENT_ACKNOWLEDGED
ASSIGNMENT_NOTIFIED
FINANCING_EXECUTED
PAYMENT_MADE
PAYMENT_LATE
DISPUTE_OPENED
DISPUTE_RESOLVED
CONTRACT_AMENDED
CONTRACT_TERMINATED
DEFAULT_DECLARED
COMPLIANCE_SUSPENDED
COMPLIANCE_RESTORED
```

Each event should contain conceptually:

```text
eventId
agreementId
eventType
actor
counterparties
timestamp
evidenceHash
previousState
newState
financialImpact
legalReference
onChainTransaction
```

---

# 16. LEGAL EVENT ≠ BLOCKCHAIN EVENT

Never conflate them.

Example:

```text
REAL WORLD:

Buyer accepts delivery
```

is the legal/commercial event.

Then:

```text
PACT:

DELIVERY_ACCEPTED
```

is the protocol event.

The architecture should connect them:

```text
REAL-WORLD EVENT
      ↓
evidence
      ↓
authorized attestation
      ↓
PACT event
      ↓
smart-contract transition
      ↓
economic consequences
```

This is essential.

---

# 17. EVIDENCE MODEL

Every material event should have evidence.

Examples:

- signed agreement
- digitally signed addendum
- delivery receipt
- buyer acceptance
- invoice
- payment confirmation
- assignment agreement
- acknowledgement
- dispute document
- legal notice

Store large/private documents off-chain.

Store:

```text
content hash
document identifier
event identifier
timestamp
```

on-chain or in a verifiable registry.

The chain should be able to prove:

> "This event refers to this exact evidence artifact."

---

# 18. AI'S ROLE

AI is the **contract compiler**.

It should:

```text
PDF
 ↓
OCR
 ↓
contract understanding
 ↓
structured agreement
```

Extract:

```text
parties
obligations
amounts
dates
conditions
penalties
payment schedules
termination
assignment clauses
jurisdiction
```

AI may also monitor new documents and identify potential events.

But AI is NOT the final authority.

Correct:

```text
AI detects event
     ↓
event proposal
     ↓
authorized confirmation / oracle
     ↓
PACT transition
```

Incorrect:

```text
AI thinks contract defaulted
     ↓
AI transfers money
```

---

# 19. CONTRACT CREDIT STATE

This is a core PACT subsystem.

Do NOT call it simply:

```text
AI Credit Score
```

Do NOT pretend CVI tier is a credit score.

The competitor landscape itself demonstrates the importance of distinguishing compliance/eligibility from creditworthiness.

Covenant, for example, explicitly describes Cleanverse trust tier as a compliance/eligibility proxy rather than a credit score.

PACT should maintain its own:

# Contract Credit State

This represents the condition of the **contractual economic relationship**.

---

# 20. WHAT CONTRACT CREDIT MEANS

Contract Credit State answers:

> **How trustworthy and financeable is the contractual economic position right now, based on observable evidence and performance?**

Inputs can include:

```text
payment history
delivery history
acceptance history
late events
default events
disputes
amendments
termination
counterparty compliance
counterparty identity tenure
assignment status
encumbrance status
evidence integrity
contract maturity
remaining exposure
```

Do not initially reduce all of this to one magical number.

Use multiple dimensions.

---

# 21. CONTRACT CREDIT DIMENSIONS

Recommended:

```text
Payment Reliability
Performance Reliability
Counterparty Reliability
Dispute Exposure
Contract Stability
Compliance Status
Assignment Integrity
Evidence Integrity
Exposure Concentration
Remaining Term
```

Example:

```text
PACT CONTRACT CREDIT

Payment Reliability       96
Performance Reliability   93
Counterparty Reliability  91
Dispute Exposure           4
Contract Stability        98
Compliance                PASS
Assignment Integrity     PASS
Evidence Integrity       PASS

State:
HEALTHY
```

The numerical implementation can evolve.

For MVP, prioritize event-driven state transitions over sophisticated scoring.

---

# 22. THE CREDIT ENGINE MUST BE EVIDENCE-DERIVED

Do not allow:

```text
admin:
"set credit = 95"
```

without evidence.

Instead:

```text
payment on time
      ↓
positive event
      ↓
credit history update
```

and:

```text
payment late
      ↓
negative event
      ↓
credit history update
```

Every score/state change should be explainable.

---

# 23. CREDIT EVENT EXAMPLES

Example:

```text
PAYMENT_ON_TIME
```

may improve payment reliability.

```text
PAYMENT_LATE
```

degrades payment reliability.

```text
DELIVERY_ACCEPTED
```

improves performance reliability.

```text
DELIVERY_MISSED
```

degrades performance reliability.

```text
DISPUTE_OPENED
```

increases dispute exposure.

```text
DISPUTE_RESOLVED_IN_FAVOR
```

reduces dispute exposure.

```text
CONTRACT_TERMINATED
```

may cause severe state degradation.

```text
RECEIVABLE_ASSIGNED
```

changes ownership/assignment state.

```text
DUPLICATE_ASSIGNMENT_DETECTED
```

must block new financing.

---

# 24. CONTRACT CREDIT IS NOT BORROWER CREDIT

This distinction is mandatory.

PACT is not initially creating a universal credit bureau.

There are:

```text
PERSON / COMPANY CREDIT
```

and:

```text
CONTRACT CREDIT
```

PACT's unique object is:

> **the creditworthiness / integrity of a particular contractual economic position.**

A company can have:

```text
good company-level credit
```

but:

```text
bad specific contract
```

because of:

- dispute
- weak buyer
- poor collateral
- assignment conflict
- termination clause
- performance failure

PACT should understand the contract-level state.

---

# 25. CONTRACT CREDIT GRAPH

Long-term, PACT can construct:

```text
Buyer
 ├── Contract A
 │     ├── payments
 │     └── deliveries
 │
 ├── Contract B
 │     ├── payments
 │     └── disputes
 │
 └── Contract C
       ├── payments
       └── default
```

This becomes:

```text
Contract Credit Graph
```

It can eventually support underwriting.

Do not build a global credit bureau for the hackathon.

Build the event infrastructure that could produce one.

---

# 26. RECEIVABLE CRYSTALLIZATION ENGINE

Create a PACT module:

```text
ReceivableEngine
```

Its purpose:

> determine when an agreement obligation has transitioned from future contractual expectation into an enforceable/claimable payment state under the selected legal/business model.

Example:

```text
DELIVERY_PENDING
       ↓
DELIVERY_COMPLETED
       ↓
BUYER_ACCEPTED
       ↓
PAYMENT_CONDITION_SATISFIED
       ↓
RECEIVABLE_CRYSTALLIZED
```

The exact legal semantics must come from the jurisdictional wrapper.

Do not universally assume that every obligation becomes a receivable.

---

# 27. ASSIGNMENT ENGINE

Create:

```text
AssignmentRegistry
```

It should record:

```text
assignor
assignee
underlying obligation
amount
assignment type
effective time
evidence hash
debtor acknowledgement
notice state
legal wrapper
status
```

Example:

```text
Supplier
   ↓
assigns ₹1M receivable
   ↓
Financier
```

PACT records:

```text
RECEIVABLE_ASSIGNED
```

The CVA then represents the appropriate compliant financial exposure.

---

# 28. DUPLICATE FINANCING / ENCUMBRANCE

This is another critical systemic problem.

A real-world receivable can potentially be:

```text
financed twice
assigned twice
pledged twice
tokenized twice
```

Blockchain prevents double-spending of the token.

It does NOT automatically prevent the same real-world claim from being represented by two unrelated systems.

The competitor listing contains dedicated projects attacking this problem.

PACT therefore needs an:

```text
EncumbranceRegistry
```

concept.

Before financing:

```text
underlying claim fingerprint
        ↓
encumbrance check
        ↓
clean?
```

If already assigned/pledged:

```text
REJECT
```

For MVP this can be a simple registry.

Long-term it becomes a cross-platform institutional registry.

---

# 29. CLAIM FINGERPRINT

Conceptually:

```text
claimFingerprint =
hash(
    agreementHash,
    creditor,
    debtor,
    obligationId,
    amount,
    dueDate
)
```

Do not use only invoice number.

The fingerprint should bind the economic claim to its underlying agreement.

This is a major future differentiator.

---

# 30. VAA DEFINITION

VAA means:

# Verified Agreement Asset

Do not define VAA as simply:

> "a CVA representing a PDF."

Define it as:

> **A PACT-managed financial representation of a verified contractual economic position whose state, evidence, eligibility and ownership/assignment history can be continuously verified.**

VAA has:

```text
agreement identity
+
legal wrapper
+
event history
+
credit state
+
economic rights
+
assignment state
+
compliance state
+
CVA representation
```

---

# 31. VAA VS CVA

These are not synonyms.

## PACT VAA

Application/protocol abstraction.

Represents:

```text
contractual economic position
```

## Cleanverse CVA

Compliance-native transferable asset standard.

Represents:

```text
compliant financial asset
```

Relationship:

```text
PACT Agreement
       ↓
PACT economic position
       ↓
VAA
       ↓
CVA representation
```

Do not claim that PACT has replaced CVA.

---

# 32. CLEANVERSE'S ROLE

Cleanverse is not the legal system.

Cleanverse is the compliance infrastructure.

Use:

```text
CVI
```

for participant identity/eligibility.

Use:

```text
Validator / CCP
```

for protocol-level compliance gates.

Use:

```text
CVA
```

for compliant transferable financial assets.

Use:

```text
RuleV2
```

for eligibility policy.

---

# 33. CLEANVERSE COMPLIANCE ARCHITECTURE

The intended architecture:

```text
                PACT
                  │
       ┌──────────┴──────────┐
       │                     │
Agreement Layer        Capital Layer
       │                     │
       ▼                     ▼
Validator              CVA / RuleV2
       │                     │
       ▼                     ▼
"Can this actor       "Can this wallet
perform this action?"  hold/transfer?"
```

This is stronger than using Cleanverse only during onboarding.

---

# 34. VALIDATOR INTEGRATION

PACT's business contract should be registered as a Cleanverse compliance pool.

Use the exact Cleanverse interface from the attached Validator guide.

Core call:

```solidity
complianceVerify(
    address poolAddress,
    address userAddress
)
```

Use it at economically meaningful actions.

Examples:

```text
activate agreement
capitalize
assign financial exposure
transfer VAA/CVA
release payment
resume suspended position
```

Do not rely only on frontend API checks.

---

# 35. BUSINESS CONTRACT ENFORCEMENT

Correct:

```text
User
 ↓
PACT smart contract
 ↓
Cleanverse Validator
 ↓
CVI
 ↓
PASS / FAIL
 ↓
state transition
```

Weak:

```text
Frontend
 ↓
Cleanverse API says true
 ↓
Frontend sends transaction
```

The latter can be bypassed.

The business contract must be authoritative.

---

# 36. CVA TRANSFER ENFORCEMENT

The Cleanverse CVA guide shows the compliance hook architecture:

```solidity
_update(...)
    ↓
policy.canTransfer(...)
    ↓
revert if not allowed
    ↓
super._update(...)
```

PACT should rely on the official CVA implementation rather than recreate compliance behavior unnecessarily.

---

# 37. CVA ISSUANCE

Preferred:

```text
PACT backend
      ↓
Cleanverse CVA Launch API
      ↓
Cleanverse review
      ↓
CVA activated
      ↓
optional MINTER_ROLE
      ↓
PACT capital contract
```

The attached CVA guide explicitly describes API Launch as the suitable path for automated issuance workflows and existing backend systems.

Follow the exact API v5.6 schema.

---

# 38. MINTER_ROLE

If PACT needs to mint the CVA from its capital contract:

```text
CVA
 │
 └── MINTER_ROLE
          ↓
 PactCapital
```

Never give minting authority to the frontend.

Use a dedicated contract.

---

# 39. RULEV2

RuleV2 contains:

```solidity
bytes2  allowedGroup;
bytes2  allowedSubGroup;
uint8   minTier;
uint8   minSubTier;
uint256 poolCountryBitmap;
```

Fields within one rule are ANDed.

Multiple RuleV2 rules are ORed.

Use the exact semantics from the attached Cleanverse source.

Example:

```text
minTier >= 30
AND
permitted jurisdiction
```

The compliance rule must actually affect the demo.

Do not configure an unrestricted rule merely to claim integration.

---

# 40. CLEANVERSE DOES NOT PROVIDE PACT'S CREDIT SCORE

This is a critical conceptual boundary.

Cleanverse provides:

```text
identity
eligibility
compliance
asset transfer policy
```

PACT provides:

```text
contract performance
economic state
credit state
assignment state
```

Do not conflate:

```text
CVI tier
```

with:

```text
PACT Contract Credit
```

CVI eligibility can be one input into the contract state.

It is not the contract's creditworthiness.

---

# 41. LEGAL + CLEANVERSE + CREDIT

The full model:

```text
             LEGAL AGREEMENT
                    │
                    ▼
             PACT AGREEMENT
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼
      Legal      Events    Compliance
      Wrapper    +Evidence     │
          │         │           ▼
          │         │          CVI
          │         │           │
          └────┬────┴───────────┘
               ▼
       Contract Credit State
               │
               ▼
      Receivable Crystallization
               │
               ▼
          Assignment
               │
               ▼
              VAA
               │
               ▼
              CVA
               │
               ▼
           Financier
               │
               ▼
           Settlement
               │
               ▼
          New Event
               │
               └──────→ Credit State
```

This is the architecture.

---

# 42. THE PEAK COMMERCIAL USE CASE

The strongest demo is:

# Indian MSME contract-to-capital financing

Example:

```text
ABC Components
        │
        │ supply agreement
        ▼
LargeCorp India
```

Contract:

```text
₹12M total
12 deliveries
₹1M each
30-day payment after acceptance
```

PACT:

```text
contract
 ↓
verified parties
 ↓
12 obligations
 ↓
performance history
 ↓
credit state
 ↓
delivery #1
 ↓
acceptance
 ↓
₹1M receivable
 ↓
assignment
 ↓
financier
 ↓
CVA
 ↓
payment
```

This is much stronger than rental.

---

# 43. WHY THIS USE CASE IS COMMERCIAL

The supplier needs working capital.

The buyer has a contractual obligation.

The financier needs confidence that:

```text
the contract exists
+
the parties are real
+
the obligation exists
+
performance happened
+
the claim is not duplicated
+
the claim was legally assigned
+
the counterparty remains eligible
```

PACT's entire architecture answers these questions.

---

# 44. THE HERO DEMO

The demo should be:

# "Finance a contract, then break it."

Not:

# "Tokenize a PDF."

---

## STEP 1 — Contract creation

Upload:

```text
signed_supply_agreement.pdf
```

PACT extracts:

```text
Buyer
Supplier
12 obligations
₹12M
payment terms
delivery terms
jurisdiction
assignment terms
```

Show:

```text
Agreement hash
```

---

## STEP 2 — Identity

Show:

```text
Buyer       CVI ✓
Supplier    CVI ✓
Financier   CVI ✓
```

---

## STEP 3 — Activate

Create PACT Agreement on-chain.

Show:

```text
Agreement ID
Contract address
Agreement hash
Transaction
Jurisdiction: IN
Legal Wrapper: PACT-IN-1
```

---

## STEP 4 — Contract Credit

Initial state:

```text
CONTRACT CREDIT

Payment reliability:
N/A

Performance:
N/A

Compliance:
PASS

Evidence:
VERIFIED

Assignment:
UNENCUMBERED

State:
NEW / HEALTHY
```

Do not fabricate a historical credit score.

---

## STEP 5 — Perform delivery

Mark:

```text
Delivery #1 accepted
```

This creates:

```text
DELIVERY_ACCEPTED
```

and:

```text
PAYMENT_OBLIGATION_CRYSTALLIZED
```

---

## STEP 6 — Finance

The supplier assigns the crystallized receivable under the selected legal wrapper.

PACT records:

```text
RECEIVABLE_ASSIGNED
```

Then:

```text
financier
 ↓
PACT capital position
 ↓
CVA
```

---

# 45. THE KILLER MOMENT

Now simulate:

```text
Delivery #2 missed
```

PACT records:

```text
DELIVERY_MISSED
```

Then:

```text
ACTIVE
 ↓
AT_RISK
```

Contract Credit changes:

```text
Performance Reliability
93 → 68
```

The important part:

**the number is not the story.**

The evidence is.

Click:

```text
Why did this change?
```

Show:

```text
Delivery #2
Due: Aug 12
Status: MISSED
Evidence: 0x...
Transaction: 0x...
```

---

# 46. COMPLIANCE FAILURE

Now change the relevant participant's eligibility.

Attempt a payment or capital action.

The contract checks:

```text
complianceVerify()
```

and fails.

PACT records:

```text
COMPLIANCE_SUSPENDED
```

Do not destroy the payment.

Keep it accounted for.

---

# 47. SUSPENDED PAYMENT

Use a state:

```text
PENDING
SUSPENDED
RELEASED
```

Example:

```text
₹100,000 payment
       ↓
CVI fails
       ↓
SUSPENDED
       ↓
₹100,000 remains accounted for
```

After eligibility restoration:

```text
CVI PASS
       ↓
release
       ↓
₹100,000 paid
```

The Cleanverse project listing contains a dedicated Suspense submission demonstrating this exact general pattern: failed eligibility creates a suspended, accounted-for allocation that can later be released after re-verification.

PACT should use this pattern as **one component of the broader contract lifecycle**, not as its entire product.

---

# 48. FINAL CONTRACT STATE

After the demo:

```text
PACT AGREEMENT #001

Jurisdiction:
India

Underlying:
Supply Agreement

Contract Value:
₹12,000,000

Financed:
₹1,000,000

Current State:
AT_RISK

Contract Credit:
DEGRADED

Cleanverse:
PASS

CVA:
ACTIVE

Assignment:
RECORDED

Events:
17

Evidence:
17 linked artifacts
```

The judge should be able to inspect the entire causal chain.

---

# 49. COMPETITIVE DIFFERENTIATION

The current competition means PACT must avoid several territories.

### Trellis

Trellis turns shareholder-agreement rules into executable share-transfer restrictions.

PACT should NOT become another:

```text
agreement → transfer restrictions
```

PACT owns:

```text
agreement → ongoing economic state → capital
```

---

### CleanRail

CleanRail focuses on trade documentation, digital title and escrow settlement.

PACT should NOT become another shipping escrow.

PACT owns:

```text
contract → performance → receivable → assignment → capital
```

---

### Covenant

Covenant requires an obligor to counter-sign debt before a receivable can exist and uses CVI eligibility in funding.

PACT should go deeper into:

```text
entire agreement lifecycle
+
performance evidence
+
credit state
+
crystallization
+
assignment
```

Do not duplicate Covenant's exact mechanism.

---

### CleanACE

CleanACE focuses strongly on CVI/CVA enforcement and protocol-level compliance.

PACT should not compete merely on:

```text
"our token checks CVI"
```

Cleanverse already gives you that primitive.

PACT differentiates through:

```text
legal agreement
+
event history
+
credit state
+
economic lifecycle
```

---

### Suspense

Suspense owns the general pattern:

```text
ineligible recipient
 ↓
suspend
 ↓
recheck
 ↓
release
```

PACT can use this as a lifecycle component.

It must not be the entire product.

---

### Mordant / Lien

These projects attack:

```text
duplicate financing
duplicate claims
encumbrance
```

PACT should incorporate an EncumbranceRegistry so this systemic risk is not ignored.

Do not claim that a blockchain token alone solves duplicate real-world claims.

---

# 50. SYSTEMIC RISK MODEL

PACT must understand that tokenization introduces systemic risks.

Track:

```text
identity risk
legal validity risk
performance risk
counterparty risk
payment risk
assignment risk
duplicate-financing risk
compliance risk
jurisdiction risk
evidence risk
oracle risk
concentration risk
```

Each risk should map to an actual data source or event.

---

# 51. CONTRACT STATE SHOULD NOT EQUAL CREDIT SCORE

Use:

```text
ContractState
```

for deterministic lifecycle:

```text
DRAFT
ACTIVE
AT_RISK
SUSPENDED
DEFAULTED
COMPLETED
```

Use:

```text
ContractCreditState
```

for evidence-derived risk/integrity.

Example:

```text
Agreement State:
AT_RISK

Contract Credit:
DEGRADED

Reason:
delivery missed
```

This separation is important.

---

# 52. CONTRACT STATE TRANSITIONS

Recommended:

```text
DRAFT
  ↓
ACTIVE

ACTIVE
  ├── performance issue → AT_RISK
  ├── compliance issue → SUSPENDED
  └── all obligations complete → COMPLETED

AT_RISK
  ├── cured → ACTIVE
  └── unresolved/default → DEFAULTED

SUSPENDED
  └── eligibility restored → ACTIVE
```

Use explicit transition functions.

Do not allow arbitrary state mutation.

---

# 53. AGREEMENT CONTRACT

Conceptual structure:

```solidity
contract PactAgreement {

    bytes32 public agreementHash;

    JurisdictionConfig public jurisdiction;

    AgreementState public state;

    address public buyer;
    address public supplier;

    mapping(uint256 => Obligation) public obligations;

    address public validator;
    address public capitalAsset;

    // state-changing functions
}
```

Do not over-engineer.

The hackathon contract should be small enough to audit.

---

# 54. OBLIGATION MODEL

Conceptually:

```solidity
struct Obligation {
    uint256 id;
    address obligor;
    address beneficiary;
    uint256 amount;
    uint256 dueAt;
    ObligationState state;
    bytes32 evidenceHash;
}
```

Recommended states:

```text
PENDING
DUE
FULFILLED
LATE
DISPUTED
CRYSTALLIZED
ASSIGNED
SETTLED
DEFAULTED
```

---

# 55. LEGAL EVENT MODEL

Conceptually:

```solidity
struct LegalEvent {
    uint256 id;
    uint256 agreementId;
    bytes32 eventType;
    address actor;
    bytes32 evidenceHash;
    uint256 timestamp;
}
```

Do not put confidential legal documents on-chain.

Use hashes and references.

---

# 56. CREDIT ENGINE

The first MVP implementation can be deterministic.

Example:

```text
EVENT                    EFFECT

PAYMENT_ON_TIME          +payment reliability
DELIVERY_ACCEPTED        +performance
PAYMENT_LATE             -payment reliability
DELIVERY_MISSED          -performance
DISPUTE_OPENED           +dispute exposure
DISPUTE_RESOLVED         -dispute exposure
DEFAULT                  severe degradation
TERMINATION              severe degradation
COMPLIANCE_FAILURE       eligibility failure
ASSIGNMENT_CONFLICT      financing blocked
```

Do not use arbitrary machine learning.

The first version should be explainable.

---

# 57. EVENT-SOURCED CREDIT

The preferred model:

```text
event ledger
    ↓
derived contract credit state
```

not:

```text
AI
 ↓
random score
```

This makes the system auditable.

---

# 58. EVENT SOURCES

Potential future event sources:

```text
ERP
accounting system
bank/payment rail
e-invoice
logistics oracle
digital signature
document upload
buyer acceptance
CVI
Cleanverse API
legal notice
court/arbitration system
TReDS/factoring infrastructure
```

For the hackathon, only use a few.

Prefer:

```text
user-attested demo event
+
document evidence
+
on-chain event
```

rather than building ten unreliable integrations.

---

# 59. CREDIT DATA MODEL

Example:

```typescript
type ContractCreditState = {
    paymentReliability: number;
    performanceReliability: number;
    disputeExposure: number;
    contractStability: number;

    complianceStatus:
        | "PASS"
        | "FAIL"
        | "UNKNOWN";

    assignmentStatus:
        | "UNENCUMBERED"
        | "ASSIGNED"
        | "CONFLICT";

    evidenceIntegrity:
        | "VERIFIED"
        | "DEGRADED"
        | "UNKNOWN";

    state:
        | "NEW"
        | "HEALTHY"
        | "AT_RISK"
        | "DEFAULTED";
};
```

This is application-level data.

Only critical state needs to be committed on-chain.

---

# 60. CAPITAL ENGINE

Create:

```text
PactCapital
```

Responsibilities:

- accept financing
- track investor exposure
- interact with CVA
- prevent over-issuance
- track allocations
- interact with PACT agreement
- respect compliance
- respect assignment/encumbrance state

Do not build a full lending market.

---

# 61. CAPITAL ACCOUNTING

Maintain invariants.

At minimum:

```text
funded amount
=
outstanding
+
settled
+
suspended
+
returned
```

and:

```text
issued financial exposure
≤
legally/contractually available exposure
```

Never allow:

```text
₹1M receivable
↓
₹1M token
↓
another ₹1M token
```

without an explicit and valid new economic claim.

---

# 62. ENCUMBRANCE INVARIANT

Before financing:

```text
claimFingerprint
        ↓
EncumbranceRegistry
```

If:

```text
UNENCUMBERED
```

allow.

If:

```text
ASSIGNED
PLEDGED
FINANCED
DISPUTED
```

apply the appropriate restriction.

For the MVP:

```text
already financed
→ reject
```

is sufficient.

---

# 63. JURISDICTION-AWARE CREDIT

The contract's credit engine should know:

```text
jurisdiction
```

because legal meaning changes across jurisdictions.

Example:

```text
RECEIVABLE_CRYSTALLIZED
```

must not have identical legal assumptions everywhere.

Therefore:

```text
LegalWrapper
```

should define:

```text
what event means
what evidence is required
who can attest
what rights arise
what assignment means
```

---

# 64. PACT-SG

Initial conceptual wrapper:

```text
PACT-SG-1
```

Use for:

- Singapore-governed agreements
- Cleanverse-native baseline
- future cross-border infrastructure

Do not implement an elaborate Singapore legal engine in the hackathon.

---

# 65. PACT-IN

Primary demo wrapper:

```text
PACT-IN-1
```

Focus on:

```text
commercial agreement
delivery
acceptance
receivable crystallization
assignment
financing
settlement
```

The production legal clauses require counsel.

The hackathon should demonstrate the architecture, not make an unsupported legal claim.

---

# 66. CROSS-BORDER FUTURE

Long-term:

```text
Indian supplier
       ↓
PACT-IN
       ↓
contractual receivable
       ↓
legal assignment
       ↓
international financier
       ↓
Cleanverse compliance
       ↓
PACT-SG / cross-border wrapper
```

This creates the possibility of:

> cross-border contractual-finance infrastructure.

Do not build this now.

Architect for it.

---

# 67. CLEANVERSE API MODULE

Create:

```text
src/
  cleanverse/
    client.ts
    auth.ts
    encryption.ts
    apass.ts
    cva.ts
    validator.ts
    transactions.ts
    types.ts
```

Never scatter Cleanverse API calls through random application code.

---

# 68. API SERVICE RESPONSIBILITIES

### A-Pass

Use for:

- identity creation/query
- identity status
- verification

### CVA

Use for:

- launch
- status
- rules
- registration
- operational queries

### Validator

Use for:

- pool registration
- RuleV2
- compliance verification
- pool state

Follow API v5.6 exactly.

---

# 69. ENVIRONMENT

Use:

```env
CLEANVERSE_API_ID=
CLEANVERSE_API_SECRET=
CLEANVERSE_BASE_URL=

RPC_URL=
CHAIN_ID=

DEPLOYER_PRIVATE_KEY=

VALIDATOR_ADDRESS=
CVA_ADDRESS=
```

Never commit secrets.

Never put private keys in frontend code.

---

# 70. DEVELOPMENT ENVIRONMENT

Prefer:

```text
TypeScript
Solidity ^0.8.24
OpenZeppelin v5
Foundry
```

Use the chain required by the hackathon/Cleanverse environment.

Do not hardcode a chain assumption until the supplied environment and deployment requirements are confirmed.

---

# 71. REPOSITORY STRUCTURE

Recommended:

```text
pact/
│
├── apps/
│   ├── web/
│   └── api/
│
├── contracts/
│   ├── PactAgreement.sol
│   ├── PactAgreementFactory.sol
│   ├── LegalEventRegistry.sol
│   ├── ContractCreditRegistry.sol
│   ├── EncumbranceRegistry.sol
│   └── PactCapital.sol
│
├── src/
│   ├── cleanverse/
│   ├── agreements/
│   ├── credit/
│   ├── legal/
│   ├── capital/
│   └── evidence/
│
├── test/
│
├── scripts/
│
├── docs/
│
└── README.md
```

---

# 72. DO NOT OVERBUILD THE CONTRACT SYSTEM

For the hackathon, the minimum contracts should probably be:

```text
PactAgreement
LegalEventRegistry
EncumbranceRegistry
PactCapital
```

Cleanverse provides:

```text
Validator
CVA
CVI
RuleV2
```

Do not create redundant Cleanverse primitives.

---

# 73. AGREEMENT FACTORY

Optional:

```text
PactAgreementFactory
```

Use it to create standardized agreement contracts.

This is useful if time permits.

The first demo can deploy a single agreement directly.

---

# 74. API ENDPOINTS

Minimum backend:

```text
POST /agreements
GET /agreements/:id

POST /agreements/:id/activate

GET /agreements/:id/state

GET /agreements/:id/events

GET /agreements/:id/credit

POST /agreements/:id/obligations/:obligationId/fulfill

POST /agreements/:id/obligations/:obligationId/crystallize

POST /agreements/:id/obligations/:obligationId/assign

POST /agreements/:id/capitalize

POST /agreements/:id/payments/:id/distribute

POST /agreements/:id/payments/:id/release

GET /agreements/:id/compliance
```

Only implement what the vertical demo needs.

---

# 75. FRONTEND INFORMATION ARCHITECTURE

Main page:

```text
PACT
Contract → Capital
```

Agreement page:

```text
Agreement
Parties
Obligations
Contract Credit
Legal Events
Capital
Compliance
Evidence
```

This is more important than a generic token dashboard.

---

# 76. AGREEMENT PAGE

Show:

```text
PACT AGREEMENT #001

INDIAN SUPPLY AGREEMENT

ABC Components
↕
LargeCorp India

₹12,000,000

ACTIVE
```

Then:

```text
CONTRACT CREDIT

Performance      93
Payment          96
Dispute           2
Evidence        VERIFIED
Assignment      CLEAN
Compliance      PASS
```

---

# 77. EVENT TIMELINE

Show:

```text
Agreement signed
       ↓
Parties verified
       ↓
Agreement activated
       ↓
Delivery #1 completed
       ↓
Buyer accepted
       ↓
Receivable crystallized
       ↓
Assigned to financier
       ↓
CVA exposure created
       ↓
Payment received
```

Each event should be clickable.

---

# 78. CREDIT EXPLANATION

When clicking the credit state:

```text
WHY IS THIS CONTRACT HEALTHY?

+ Delivery #1 accepted
+ Payment #1 made on time
+ Buyer verified
+ Assignment verified

No active disputes
No active encumbrance
No compliance failures
```

When it deteriorates:

```text
WHY IS THIS CONTRACT AT RISK?

- Delivery #2 missed
- Payment #2 overdue

Evidence:
delivery_report_002.pdf
hash: 0x...

Transaction:
0x...
```

This is the product's "intelligence."

---

# 79. LEGAL EVENT VIEW

Show:

```text
LEGAL EVENT

RECEIVABLE_ASSIGNED

Assignor:
ABC Components

Assignee:
ABC Finance

Amount:
₹1,000,000

Evidence:
assignment_addendum.pdf

Evidence hash:
0x...

Jurisdiction:
India

Legal wrapper:
PACT-IN-1

On-chain record:
0x...
```

This is much more powerful than a token balance.

---

# 80. CAPITAL VIEW

Show:

```text
PACT CAPITAL POSITION

Underlying agreement:
#001

Underlying claim:
Obligation #1

Amount:
₹1,000,000

Assigned:
YES

CVA:
0x...

Investor:
CVI ✓

Status:
ACTIVE
```

---

# 81. COMPLIANCE VIEW

Show:

```text
CLEANVERSE

Buyer:
CVI ✓

Supplier:
CVI ✓

Financier:
CVI ✓

Validator:
REGISTERED

RuleV2:
ACTIVE

CVA:
ACTIVE
```

Provide actual links to transactions.

---

# 82. FAILURE DEMO

The application should include explicit demo controls.

Example:

```text
SIMULATE DELIVERY FAILURE
```

This creates an actual event.

Then:

```text
ACTIVE
 ↓
AT_RISK
```

Another:

```text
SIMULATE COMPLIANCE FAILURE
```

Then:

```text
COMPLIANCE FAIL
 ↓
SUSPENDED
```

Another:

```text
RESTORE ELIGIBILITY
```

Then:

```text
SUSPENDED
 ↓
ACTIVE
```

These controls must invoke actual state transitions.

---

# 83. NO FAKE BADGES

If UI says:

```text
CVI ✓
```

there should be an actual source.

If UI says:

```text
CVA ACTIVE
```

there should be an actual CVA.

If UI says:

```text
Validator REGISTERED
```

there should be an actual registration.

If something is mocked:

```text
DEMO SIMULATION
```

must be visible.

---

# 84. TESTS

Test:

### Agreement

- creation
- activation
- unauthorized activation
- state transitions
- completion

### Obligations

- creation
- fulfillment
- late
- crystallization
- assignment
- settlement

### Legal events

- authorization
- evidence hash
- event ordering
- duplicate prevention

### Credit

- event changes state
- evidence linked
- no arbitrary score mutation

### Encumbrance

- first financing succeeds
- duplicate financing fails

### Compliance

- eligible user succeeds
- ineligible user fails
- compliance failure blocks business action
- restored eligibility allows action

### Capital

- no over-issuance
- no double distribution
- accounting invariants

---

# 85. SECURITY

Never:

- let AI directly transfer funds
- trust frontend compliance
- store private legal documents on-chain
- store private keys in frontend
- allow arbitrary credit-state mutation
- allow arbitrary legal-event creation
- allow duplicate financing
- allow double assignment
- allow arbitrary minting
- allow double distribution
- allow compliance bypass

---

# 86. ACCOUNTING INVARIANTS

At minimum:

```text
funded
=
outstanding
+
settled
+
suspended
+
returned
```

And:

```text
financed claim
≤
available contractual economic right
```

And:

```text
one claim
cannot be simultaneously
unencumbered + assigned + pledged
```

---

# 87. LEGAL SAFETY

The application must not state:

> "This token is legally enforceable because it is on-chain."

Instead state:

> "PACT records and executes the contractual and financial workflow under the selected jurisdictional/legal wrapper."

The legal wrapper defines the actual legal relationship.

Production deployment requires legal review.

---

# 88. WHAT THE HACKATHON MVP DOES NOT CLAIM

Do not claim:

- universal legal enforceability
- that CVA itself creates the underlying receivable
- that Cleanverse is a financier
- that CVI is a credit score
- that AI determines legal truth
- that blockchain alone prevents duplicate real-world claims
- that PACT is a factor
- that PACT is TReDS
- that PACT is a bank/NBFC
- that PACT replaces lawyers
- that every contractual promise is automatically a receivable
- that a token automatically transfers legal title

The sophistication of the project comes partly from knowing these boundaries.

---

# 89. HACKATHON PRIORITIES

If time is limited:

## P0 — Must work

```text
PACT agreement
+
Cleanverse Validator
+
real CVI check
+
real CVA
+
on-chain state
```

## P1

```text
Legal Event Registry
+
Contract Credit State
+
receivable crystallization
+
assignment
```

## P2

```text
EncumbranceRegistry
+
suspension/recovery
```

## P3

```text
AI extraction
+
beautiful UX
```

Do not reverse this order.

---

# 90. MOST IMPORTANT VERTICAL SLICE

The finished system must demonstrate:

```text
1.
Upload signed Indian supply agreement

2.
Extract:
buyer
supplier
obligations
payments
jurisdiction

3.
Verify parties with CVI

4.
Create PACT Agreement

5.
Register agreement with Cleanverse Validator

6.
Configure RuleV2

7.
Activate agreement

8.
Perform delivery

9.
Buyer accepts delivery

10.
Receivable crystallizes

11.
Legal assignment is recorded

12.
Encumbrance check passes

13.
Financier funds

14.
CVA represents compliant financial exposure

15.
Payment settles

16.
New positive credit event is recorded

17.
Next delivery fails

18.
Contract becomes AT_RISK

19.
Compliance becomes invalid

20.
Payment becomes SUSPENDED

21.
Eligibility is restored

22.
Payment releases

23.
Credit/event history explains every transition
```

This is the MVP.

---

# 91. THE SINGLE MOST IMPORTANT DEMO SCREEN

The agreement command center should show:

```text
┌──────────────────────────────────────────────┐
│ PACT AGREEMENT #001                         │
│ Indian Supply Agreement                     │
│                                              │
│ ₹12,000,000                  AT RISK         │
├──────────────────────────────────────────────┤
│ PARTIES                                      │
│ Buyer       CVI ✓                            │
│ Supplier    CVI ✓                            │
│ Financier   CVI ✓                            │
├──────────────────────────────────────────────┤
│ CONTRACT CREDIT                              │
│ Payment       96                             │
│ Performance  68  ↓                           │
│ Disputes      2                              │
│ Assignment   CLEAN                            │
│ Evidence     VERIFIED                         │
├──────────────────────────────────────────────┤
│ OBLIGATIONS                                  │
│ ✓ Delivery 1 — ₹1M — Paid                   │
│ ⚠ Delivery 2 — ₹1M — Late                   │
│ ○ Delivery 3 — ₹1M — Pending                │
├──────────────────────────────────────────────┤
│ CAPITAL                                      │
│ Assigned: ₹1M                               │
│ CVA: 0x...                                   │
│ Investor: CVI ✓                             │
├──────────────────────────────────────────────┤
│ LEGAL EVENTS                                 │
│ Agreement executed                           │
│ Delivery accepted                            │
│ Receivable crystallized                      │
│ Assignment executed                          │
│ Financing executed                           │
│ Payment settled                              │
│ Delivery missed                              │
├──────────────────────────────────────────────┤
│ CLEANVERSE                                   │
│ Validator ✓                                  │
│ RuleV2 ✓                                     │
│ CVA ✓                                        │
└──────────────────────────────────────────────┘
```

The entire PACT thesis should be understandable from this screen.

---

# 92. LONG-TERM PROTOCOL THESIS

The hackathon implementation is one supply agreement.

The protocol should eventually support:

```text
Supply contracts
Purchase agreements
Rental agreements
Subscription contracts
Service contracts
Construction contracts
Energy offtake
Royalty agreements
Equipment leases
Franchise agreements
Purchase orders
Trade contracts
Other contractual cash-flow relationships
```

The common abstraction is:

```text
AGREEMENT
+
OBLIGATION
+
EVENT
+
EVIDENCE
+
CREDIT
+
LEGAL RIGHT
+
CAPITAL
```

---

# 93. THE FUTURE MARKET

The long-term product is not:

```text
RWA marketplace
```

It is:

# Contractual Capital Market

Instead of investors seeing:

```text
Tokenized Property #102
```

they eventually see:

```text
VERIFIED CONTRACTUAL EXPOSURE

₹10M supply agreement

Buyer:
Verified

Supplier:
Verified

Remaining term:
18 months

Performance:
97%

Payment history:
98%

Current state:
HEALTHY

Assignment:
CLEAN

Compliance:
PASS

Expected contractual cash flow:
₹600K/month
```

This is a fundamentally different RWA market.

---

# 94. THE CREDIT NETWORK EFFECT

Once PACT has many agreements:

```text
agreement events
       ↓
contract histories
       ↓
performance data
       ↓
underwriting intelligence
       ↓
better financing
       ↓
more agreements
       ↓
more data
```

This creates a network effect.

The protocol gradually becomes a source of:

> **verified contractual performance data**

rather than merely a token registry.

---

# 95. THE THREE-LAYER CREDIT MODEL

Long term, PACT can distinguish:

```text
ENTITY CREDIT
     │
     ▼
COUNTERPARTY HISTORY
     │
     ▼
CONTRACT CREDIT
     │
     ▼
CLAIM CREDIT
```

For MVP only implement:

```text
CONTRACT CREDIT
```

and use CVI as an eligibility input.

Do not attempt to become a universal credit bureau during the hackathon.

---

# 96. THE REAL PACT FLYWHEEL

```text
More agreements
      ↓
More verified events
      ↓
Better contract histories
      ↓
Better underwriting
      ↓
Lower financing friction
      ↓
More capital
      ↓
More agreements
```

This is the commercial moat.

The token itself is not the moat.

---

# 97. WHY CLEANVERSE IS FUNDAMENTAL

Cleanverse should not be bolted onto the product.

The architecture depends on:

```text
CVI
```

for:

```text
trusted counterparties
```

```text
Validator
```

for:

```text
permission to participate in PACT economic actions
```

```text
CVA
```

for:

```text
compliant financial representation
```

```text
RuleV2
```

for:

```text
programmable eligibility
```

The attached Cleanverse Validator guide explicitly supports direct business-contract compliance checks at key business steps.

The CVA guide provides the compliant asset transfer architecture.

PACT's contribution is the layer connecting those primitives to contractual state, credit and capital.

---

# 98. THE MOST IMPORTANT ARCHITECTURAL BOUNDARY

Cleanverse answers:

```text
WHO?
CAN THEY PARTICIPATE?
CAN THEY HOLD/TRANSFER THE ASSET?
```

PACT answers:

```text
WHAT DID THEY AGREE TO?
WHAT HAS HAPPENED?
WHAT IS CURRENTLY OWED?
WHAT RIGHTS HAVE CRYSTALLIZED?
WHO HAS BEEN ASSIGNED THE RIGHT?
HOW HEALTHY IS THE CONTRACT?
WHAT ECONOMIC ACTION SHOULD HAPPEN NEXT?
```

The legal wrapper answers:

```text
WHAT DOES THAT EVENT MEAN LEGALLY?
```

This three-way separation is fundamental.

---

# 99. FINAL SYSTEM ARCHITECTURE

```text
                         REAL WORLD
                             │
                             ▼
                    LEGAL AGREEMENT
                             │
                             ▼
                    PACT LEGAL WRAPPER
                     SG / IN / future US
                             │
                             ▼
                    AGREEMENT COMPILER
                         AI / Parser
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
           Parties       Obligations      Conditions
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    PACT AGREEMENT
                             │
                    ┌────────┴─────────┐
                    │                  │
                    ▼                  ▼
             LEGAL EVENT          EVIDENCE
              REGISTRY              HASHES
                    │                  │
                    └────────┬─────────┘
                             ▼
                    CONTRACT STATE
                             │
                             ▼
                  CONTRACT CREDIT ENGINE
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
               Risk State       Performance
                    │                 │
                    └────────┬────────┘
                             ▼
                  RECEIVABLE ENGINE
                             │
                       crystallized
                             │
                             ▼
                  ASSIGNMENT REGISTRY
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
               Encumbrance       Legal evidence
                 check
                    │
                    ▼
                PACT VAA
                    │
                    ▼
             CLEANVERSE CVA
                    │
             ┌──────┴──────┐
             ▼             ▼
           CVI          RuleV2 / CCP
             │             │
             └──────┬──────┘
                    ▼
                FINANCIER
                    │
                    ▼
                SETTLEMENT
                    │
                    ▼
               LEGAL EVENT
                    │
                    └───────────────→ CREDIT UPDATE
```

---

# 100. PRODUCT DEFINITIONS

### PACT

Programmable Agreement Capital Technology.

The protocol.

### Agreement

The underlying legally executed relationship.

### Legal Event

A real-world/legal/economic event that changes the meaning or state of the agreement.

### Evidence

A verifiable artifact supporting a legal/economic event.

### Contract State

Deterministic lifecycle state.

### Contract Credit State

Evidence-derived condition of the contractual economic position.

### VAA

Verified Agreement Asset.

PACT's conceptual representation of a verified contractual economic position.

### CVA

Cleanverse Verified Asset.

The Cleanverse compliant transferable asset rail.

### CVI

Cleanverse Verified Identity.

The identity/eligibility primitive.

### Validator

Cleanverse on-chain compliance enforcement.

### RuleV2

Cleanverse policy primitive.

### Encumbrance

A claim, assignment, pledge or financing relationship that restricts additional use of an underlying economic claim.

---

# 101. ONE-SENTENCE PACT

> **PACT turns legally executed commercial agreements into continuously verifiable economic positions, tracks their real-world performance and credit state, and converts crystallized contractual rights into compliance-native capital.**

---

# 102. ONE-SENTENCE CLEANVERSE INTEGRATION

> **Cleanverse provides verified counterparties through CVI, on-chain eligibility enforcement through the Validator, and compliant transferable financial assets through CVA and RuleV2; PACT supplies the contractual state, legal-event, credit and capital lifecycle around those primitives.**

---

# 103. ONE-SENTENCE COMMERCIAL THESIS

> **PACT is infrastructure for financing contractual cash flows before and as they crystallize into traditional receivables, while continuously preserving evidence of performance, legal assignment, compliance and economic state.**

---

# 104. ONE-SENTENCE BLOCKCHAIN THESIS

> **Blockchain makes the contractual state transitions, ownership/assignment records and compliance-gated financial actions independently auditable and executable rather than leaving the entire lifecycle in PDFs, spreadsheets and private databases.**

---

# 105. ONE-SENTENCE LEGAL THESIS

> **PACT does not claim that minting a token creates a legal right; it maps legally defined events such as execution, performance, crystallization and assignment into an auditable on-chain economic state under a jurisdiction-specific legal wrapper.**

---

# 106. AGENT PRIORITIES

When making implementation decisions:

1. Read the attached Cleanverse source first.
2. Use exact Cleanverse interfaces.
3. Use API v5.6 for API behavior.
4. Keep jurisdiction logic separate from protocol logic.
5. Keep legal events separate from blockchain events.
6. Keep contract credit separate from CVI eligibility.
7. Keep VAA separate from CVA.
8. Keep AI separate from enforcement.
9. Keep accounting deterministic.
10. Keep evidence traceable.
11. Prevent duplicate financing.
12. Make compliance checks happen inside business contracts.
13. Prefer real on-chain functionality over UI simulation.
14. Prefer one deep commercial use case over many shallow ones.
15. Do not build a generic RWA marketplace.
16. Do not turn PACT into an invoice clone.
17. Do not build a generic KYC dashboard.
18. Do not claim legal enforceability without a legal wrapper and appropriate counsel.
19. Do not treat CVI tier as a credit score.
20. Do not treat tokenization as the legal event.

---

# 107. DEFINITION OF DONE

PACT is ready when a judge can observe:

```text
SIGNED AGREEMENT
      ↓
PARTIES VERIFIED
      ↓
AGREEMENT REGISTERED
      ↓
CONTRACT OBLIGATIONS CREATED
      ↓
REAL-WORLD PERFORMANCE EVENT
      ↓
EVIDENCE ATTACHED
      ↓
CONTRACT CREDIT UPDATED
      ↓
PAYMENT RIGHT CRYSTALLIZED
      ↓
ASSIGNMENT RECORDED
      ↓
ENCUMBRANCE CHECK
      ↓
FINANCING
      ↓
CVA
      ↓
COMPLIANT CAPITAL
      ↓
SETTLEMENT
      ↓
NEW EVENT
      ↓
CREDIT UPDATE
```

Then demonstrate:

```text
DELIVERY FAILURE
      ↓
AT_RISK
      ↓
CREDIT DEGRADES
```

and:

```text
CVI FAILURE
      ↓
COMPLIANCE SUSPENSION
      ↓
PAYMENT HELD BUT ACCOUNTED FOR
      ↓
REVERIFICATION
      ↓
PAYMENT RELEASE
```

Every important step must have:

```text
state
+
event
+
evidence
+
transaction
```

where applicable.

---

# 108. FINAL AGENT INTENT

The project should feel like a new financial primitive, not a new frontend for tokenization.

The primitive is:

```text
CONTRACTUAL ECONOMIC POSITION
```

PACT makes it:

```text
VERIFIED
+
OBSERVABLE
+
CREDIT-AWARE
+
LEGALLY MAPPED
+
ASSIGNABLE
+
COMPLIANCE-AWARE
+
FINANCEABLE
+
SETTLEABLE
```

The hackathon demo is only one instance:

```text
INDIAN MSME SUPPLY AGREEMENT
```

But the protocol should make the judge understand the broader possibility:

```text
CONTRACT
   ↓
PACT
   ↓
CONTRACT CREDIT
   ↓
CAPITAL
```

The long-term category is not:

> tokenized real-world assets.

It is:

# **programmable contractual capital.**

The goal of the MVP is to make the judge ask:

> **"Why does a legally valuable commercial agreement have to remain a PDF until someone eventually turns it into an invoice?"**

That question is the product.