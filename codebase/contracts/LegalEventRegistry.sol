// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LegalEventRegistry
 * @notice On-chain event-sourced ledger recording real-world commercial & legal events linked to SHA-256 evidence hashes.
 */
contract LegalEventRegistry {
    struct LegalEvent {
        uint256 id;
        bytes32 agreementHash;
        bytes32 eventType;       // keccak256("DELIVERY_ACCEPTED"), etc.
        address actor;
        bytes32 evidenceHash;   // SHA-256 hash of underlying document/receipt
        uint256 timestamp;
        string legalReference;  // e.g. "PACT-IN-1: Sec 7 Factoring Act"
    }

    LegalEvent[] public events;
    mapping(bytes32 => uint256[]) public agreementEvents;

    event LegalEventRecorded(
        uint256 indexed eventId,
        bytes32 indexed agreementHash,
        bytes32 indexed eventType,
        address actor,
        bytes32 evidenceHash,
        uint256 timestamp
    );

    function recordEvent(
        bytes32 agreementHash,
        bytes32 eventType,
        address actor,
        bytes32 evidenceHash,
        string calldata legalReference
    ) external returns (uint256 eventId) {
        eventId = events.length;
        
        LegalEvent memory newEvent = LegalEvent({
            id: eventId,
            agreementHash: agreementHash,
            eventType: eventType,
            actor: actor,
            evidenceHash: evidenceHash,
            timestamp: block.timestamp,
            legalReference: legalReference
        });

        events.push(newEvent);
        agreementEvents[agreementHash].push(eventId);

        emit LegalEventRecorded(
            eventId,
            agreementHash,
            eventType,
            actor,
            evidenceHash,
            block.timestamp
        );
    }

    function getEventsCount() external view returns (uint256) {
        return events.length;
    }

    function getAgreementEventIds(bytes32 agreementHash) external view returns (uint256[] memory) {
        return agreementEvents[agreementHash];
    }
}
