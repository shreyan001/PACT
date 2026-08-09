// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EncumbranceRegistry
 * @notice Protects against duplicate financing and double assignment by tracking real-world claim fingerprints.
 */
contract EncumbranceRegistry {
    enum EncumbranceStatus { UNENCUMBERED, ASSIGNED, PLEDGED, FINANCED, DISPUTED }

    struct ClaimRecord {
        bytes32 claimFingerprint;
        bytes32 agreementHash;
        address obligor;       // Buyer (LargeCorp India)
        address beneficiary;   // Supplier / Financier
        uint256 obligationId;
        uint256 amount;
        uint256 dueDate;
        EncumbranceStatus status;
        uint256 registeredAt;
    }

    mapping(bytes32 => ClaimRecord) public claims;

    event ClaimEncumbered(
        bytes32 indexed claimFingerprint,
        bytes32 indexed agreementHash,
        address indexed beneficiary,
        EncumbranceStatus status
    );

    function computeFingerprint(
        bytes32 agreementHash,
        address obligor,
        address beneficiary,
        uint256 obligationId,
        uint256 amount,
        uint256 dueDate
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(agreementHash, obligor, beneficiary, obligationId, amount, dueDate));
    }

    function registerEncumbrance(
        bytes32 agreementHash,
        address obligor,
        address beneficiary,
        uint256 obligationId,
        uint256 amount,
        uint256 dueDate,
        EncumbranceStatus newStatus
    ) external returns (bytes32 claimFingerprint) {
        claimFingerprint = computeFingerprint(agreementHash, obligor, beneficiary, obligationId, amount, dueDate);
        
        ClaimRecord storage claim = claims[claimFingerprint];
        require(
            claim.status == EncumbranceStatus.UNENCUMBERED,
            "EncumbranceRegistry: Claim already assigned or financed (Duplicate Financing Blocked)"
        );

        claims[claimFingerprint] = ClaimRecord({
            claimFingerprint: claimFingerprint,
            agreementHash: agreementHash,
            obligor: obligor,
            beneficiary: beneficiary,
            obligationId: obligationId,
            amount: amount,
            dueDate: dueDate,
            status: newStatus,
            registeredAt: block.timestamp
        });

        emit ClaimEncumbered(claimFingerprint, agreementHash, beneficiary, newStatus);
    }

    function isUnencumbered(bytes32 claimFingerprint) external view returns (bool) {
        return claims[claimFingerprint].status == EncumbranceStatus.UNENCUMBERED;
    }
}
