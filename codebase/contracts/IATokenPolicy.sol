// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IATokenPolicy
 * @notice Cleanverse Compliance Protocol (CCP) CVA Asset Policy Interface V2
 */
interface IComplianceRule {
    struct RuleV2 {
        bytes2 allowedGroup;
        bytes2 allowedSubGroup;
        uint8 minTier;
        uint8 minSubTier;
        bool isBlackList;
        uint256 countryBitmap;
    }
}

interface IATokenPolicy is IComplianceRule {
    error TransferNotAllowed();

    function canTransfer(address token, address from, address to, uint256 amount)
        external view returns (bool);

    function setRuleV2(address token, RuleV2 calldata rule) external;
    function addRuleV2(address token, RuleV2 calldata rule) external;
    function removeRuleV2(uint256 index) external;
    function getRulesV2(address token) external view returns (RuleV2[] memory);
}
