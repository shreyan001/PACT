// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAPassComplianceValidator
 * @notice Official Cleanverse Compliance Protocol (CCP) CVI Compliance Validator Interface V2
 */
interface IAPassComplianceValidator {
    struct RuleV2 {
        bytes2 allowedGroup;        // Allowed CVI group (0x0000 = unrestricted)
        bytes2 allowedSubGroup;     // Allowed CVI sub-group (0x0000 = unrestricted)
        uint8 minTier;             // Minimum CVI tier (0-99)
        uint8 minSubTier;          // Minimum sub-tier (0-99)
        bool isBlackList;          // Blacklist flag
        uint256 countryBitmap;     // Country bitmap (0 = unrestricted, bitwise AND)
    }

    // Pool Registration
    function registerV2(address poolAddress, RuleV2 calldata rule) external;
    function registerApass(address poolAddress, address aTokenAddress) external;
    function registerApass(address poolAddress, address aTokenAddress, address feeAddress) external;
    function isRegistered(address poolAddress) external view returns (bool);

    // Rule Management
    function setRuleV2FromContract(RuleV2 calldata rule) external;
    function addRuleV2FromContract(RuleV2 calldata rule) external;
    function removeRuleV2FromContract(uint256 index) external;
    function getRulesV2(address poolAddress) external view returns (RuleV2[] memory);

    // Compliance Verification (No permission required)
    function complianceVerify(address poolAddress, address userAddress) external view returns (bool);
}
