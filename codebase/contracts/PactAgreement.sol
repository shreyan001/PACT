// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAPassComplianceValidator} from "./IAPassComplianceValidator.sol";
import {LegalEventRegistry} from "./LegalEventRegistry.sol";
import {EncumbranceRegistry} from "./EncumbranceRegistry.sol";

/**
 * @title PactAgreement
 * @notice PACT Commercial Agreement State Machine with Cleanverse Validator onchain Enforcement.
 * @dev Enforces Indian Legal Shield Framework:
 *      - Factoring Regulation Act 2011 (Sec 7: Statutory Receivable Assignment)
 *      - Indian Contract Act 1872 (Sec 10 & Sec 2(d): Valid Barter Consideration for Digital Assets)
 *      - Information Technology Act 2000 (Sec 10A & Sec 3A: EIP-191 & Cryptographic Evidence Admissibility)
 */
contract PactAgreement {
    enum AgreementState { DRAFT, ACTIVE, AT_RISK, SUSPENDED, DEFAULTED, COMPLETED }
    enum ObligationState { PENDING, DUE, FULFILLED, LATE, CRYSTALLIZED, ASSIGNED, SETTLED }

    struct JurisdictionConfig {
        string jurisdiction;                 // "IN" (India)
        string legalWrapperVersion;          // "PACT-IN-1"
        string governingLaw;                 // "India (Factoring Act Sec 7 & Contract Act Sec 2(d) Barter)"
        string assignmentFramework;         // "RECEIVABLE_ASSIGNMENT_BARTER"
        string electronicExecutionFramework; // "IT_ACT_2000_SEC_10A_EIP191"
    }

    struct Obligation {
        uint256 id;
        address obligor;       // Buyer (LargeCorp India)
        address beneficiary;   // Supplier (ABC Components)
        uint256 amount;        // e.g. 1,000,000 INR (1e6)
        uint256 dueAt;
        ObligationState state;
        bytes32 evidenceHash;  // SHA-256 hash of delivery receipt / acceptance
    }

    bytes32 public immutable agreementHash;
    address public immutable buyer;
    address public immutable supplier;
    uint256 public immutable totalValue;

    AgreementState public state;
    JurisdictionConfig public jurisdiction;
    
    IAPassComplianceValidator public immutable validator;
    LegalEventRegistry public immutable eventRegistry;
    EncumbranceRegistry public immutable encumbranceRegistry;

    Obligation[] public obligations;

    event AgreementStateChanged(AgreementState previousState, AgreementState newState, string reason);
    event ObligationStateChanged(uint256 indexed obligationId, ObligationState newState);

    modifier onlyCompliant(address user) {
        require(
            validator.complianceVerify(address(this), user),
            "PACT: Cleanverse CVI compliance verification failed"
        );
        _;
    }

    constructor(
        bytes32 agreementHash_,
        address buyer_,
        address supplier_,
        uint256 totalValue_,
        address validator_,
        address eventRegistry_,
        address encumbranceRegistry_
    ) {
        require(validator_ != address(0), "validator=0");
        agreementHash = agreementHash_;
        buyer = buyer_;
        supplier = supplier_;
        totalValue = totalValue_;

        validator = IAPassComplianceValidator(validator_);
        eventRegistry = LegalEventRegistry(eventRegistry_);
        encumbranceRegistry = EncumbranceRegistry(encumbranceRegistry_);

        jurisdiction = JurisdictionConfig({
            jurisdiction: "IN",
            legalWrapperVersion: "PACT-IN-1",
            governingLaw: "India (Factoring Act Sec 7 & Contract Act Sec 2(d) Barter)",
            assignmentFramework: "RECEIVABLE_ASSIGNMENT_BARTER",
            electronicExecutionFramework: "IT_ACT_2000_SEC_10A_EIP191"
        });

        state = AgreementState.DRAFT;
    }

    function addObligation(
        address obligor,
        address beneficiary,
        uint256 amount,
        uint256 dueAt
    ) external returns (uint256 obligationId) {
        obligationId = obligations.length;
        obligations.push(Obligation({
            id: obligationId,
            obligor: obligor,
            beneficiary: beneficiary,
            amount: amount,
            dueAt: dueAt,
            state: ObligationState.PENDING,
            evidenceHash: bytes32(0)
        }));
    }

    function activateAgreement() external onlyCompliant(msg.sender) {
        require(state == AgreementState.DRAFT, "PACT: Agreement not in DRAFT state");
        state = AgreementState.ACTIVE;

        eventRegistry.recordEvent(
            agreementHash,
            keccak256("AGREEMENT_ACTIVATED"),
            msg.sender,
            agreementHash,
            "PACT-IN-1: Agreement Activated under IT Act Sec 10A"
        );

        emit AgreementStateChanged(AgreementState.DRAFT, AgreementState.ACTIVE, "Agreement Activated");
    }

    function completeDeliveryAndAccept(uint256 obligationId, bytes32 evidenceHash) external onlyCompliant(msg.sender) {
        require(state == AgreementState.ACTIVE || state == AgreementState.AT_RISK, "PACT: Agreement not active");
        require(obligationId < obligations.length, "PACT: Invalid obligation ID");
        
        Obligation storage obl = obligations[obligationId];
        require(obl.state == ObligationState.PENDING, "PACT: Obligation not pending");

        obl.state = ObligationState.CRYSTALLIZED;
        obl.evidenceHash = evidenceHash;

        eventRegistry.recordEvent(
            agreementHash,
            keccak256("DELIVERY_ACCEPTED"),
            msg.sender,
            evidenceHash,
            "PACT-IN-1: Delivery Accepted & Receivable Crystallized under Factoring Act Sec 7"
        );

        emit ObligationStateChanged(obligationId, ObligationState.CRYSTALLIZED);
    }

    function assignReceivable(uint256 obligationId, address assignee) external onlyCompliant(msg.sender) returns (bytes32 claimFingerprint) {
        require(obligationId < obligations.length, "PACT: Invalid obligation ID");
        Obligation storage obl = obligations[obligationId];
        require(obl.state == ObligationState.CRYSTALLIZED, "PACT: Obligation not crystallized");

        // Verify & register encumbrance (Prevents double financing)
        claimFingerprint = encumbranceRegistry.registerEncumbrance(
            agreementHash,
            obl.obligor,
            assignee,
            obligationId,
            obl.amount,
            obl.dueAt,
            EncumbranceRegistry.EncumbranceStatus.ASSIGNED
        );

        obl.state = ObligationState.ASSIGNED;
        obl.beneficiary = assignee;

        eventRegistry.recordEvent(
            agreementHash,
            keccak256("RECEIVABLE_ASSIGNED"),
            msg.sender,
            claimFingerprint,
            "PACT-IN-1: Receivable Formally Assigned via Barter Contract"
        );

        emit ObligationStateChanged(obligationId, ObligationState.ASSIGNED);
    }

    function recordDeliveryMissed(uint256 obligationId, bytes32 evidenceHash) external {
        require(obligationId < obligations.length, "PACT: Invalid obligation ID");
        Obligation storage obl = obligations[obligationId];
        require(obl.state == ObligationState.PENDING, "PACT: Obligation not pending");

        obl.state = ObligationState.LATE;
        AgreementState previous = state;
        state = AgreementState.AT_RISK;

        eventRegistry.recordEvent(
            agreementHash,
            keccak256("DELIVERY_MISSED"),
            msg.sender,
            evidenceHash,
            "PACT-IN-1: Delivery Missed - Contract AT_RISK"
        );

        emit AgreementStateChanged(previous, AgreementState.AT_RISK, "Delivery Missed");
        emit ObligationStateChanged(obligationId, ObligationState.LATE);
    }

    function getObligationsCount() external view returns (uint256) {
        return obligations.length;
    }
}
