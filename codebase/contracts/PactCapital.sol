// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PactAgreement} from "./PactAgreement.sol";
import {IAPassComplianceValidator} from "./IAPassComplianceValidator.sol";

/**
 * @title PactCapital
 * @notice Handles capital positions, Cleanverse CVA issuance, and compliance suspense management.
 */
contract PactCapital {
    struct CapitalPosition {
        uint256 positionId;
        bytes32 agreementHash;
        uint256 obligationId;
        address investor;      // Financier holding position (ABC Capital)
        uint256 fundedAmount;   // e.g. 970,000 INR
        uint256 faceValue;      // e.g. 1,000,000 INR
        bool settled;
        bool suspended;
    }

    IAPassComplianceValidator public immutable validator;
    CapitalPosition[] public positions;
    
    mapping(uint256 => uint256) public obligationToPosition;
    uint256 public totalFunded;
    uint256 public totalSuspended;

    event CapitalFunded(uint256 indexed positionId, bytes32 indexed agreementHash, address indexed investor, uint256 fundedAmount);
    event PaymentSuspended(uint256 indexed positionId, address indexed recipient, uint256 amount);
    event PaymentReleased(uint256 indexed positionId, address indexed recipient, uint256 amount);

    constructor(address validator_) {
        require(validator_ != address(0), "validator=0");
        validator = IAPassComplianceValidator(validator_);
    }

    function fundPosition(
        bytes32 agreementHash,
        uint256 obligationId,
        address investor,
        uint256 fundedAmount,
        uint256 faceValue
    ) external returns (uint256 positionId) {
        require(
            validator.complianceVerify(address(this), investor),
            "PactCapital: Investor fails Cleanverse CVI compliance"
        );

        positionId = positions.length;
        positions.push(CapitalPosition({
            positionId: positionId,
            agreementHash: agreementHash,
            obligationId: obligationId,
            investor: investor,
            fundedAmount: fundedAmount,
            faceValue: faceValue,
            settled: false,
            suspended: false
        }));

        obligationToPosition[obligationId] = positionId;
        totalFunded += fundedAmount;

        emit CapitalFunded(positionId, agreementHash, investor, fundedAmount);
    }

    function processSettlementPayment(uint256 positionId, address recipient, uint256 amount) external {
        require(positionId < positions.length, "PactCapital: Invalid position");
        CapitalPosition storage pos = positions[positionId];
        require(!pos.settled, "PactCapital: Position already settled");

        // Verify recipient compliance via Cleanverse Validator
        if (!validator.complianceVerify(address(this), recipient)) {
            // Compliance Failure -> Move to Suspense Pool (Cleanverse Suspense Pattern)
            pos.suspended = true;
            totalSuspended += amount;
            emit PaymentSuspended(positionId, recipient, amount);
        } else {
            // Compliance Pass -> Release Payment
            pos.settled = true;
            if (pos.suspended) {
                pos.suspended = false;
                totalSuspended -= amount;
            }
            emit PaymentReleased(positionId, recipient, amount);
        }
    }

    function restoreAndReleasePayment(uint256 positionId, address recipient, uint256 amount) external {
        require(positionId < positions.length, "PactCapital: Invalid position");
        CapitalPosition storage pos = positions[positionId];
        require(pos.suspended, "PactCapital: Position not suspended");
        
        require(
            validator.complianceVerify(address(this), recipient),
            "PactCapital: Recipient still fails Cleanverse CVI compliance"
        );

        pos.suspended = false;
        pos.settled = true;
        totalSuspended -= amount;

        emit PaymentReleased(positionId, recipient, amount);
    }

    function getPositionsCount() external view returns (uint256) {
        return positions.length;
    }
}
