---
name: cleanverse-protocol
description: Authoritative technical reference and integration skill for Cleanverse Compliance Protocol (CCP) v5.6, CVI identity verification, CVA token issuance, RuleV2 policy engine, and IAPassComplianceValidator.
---

# Cleanverse Compliance Protocol (CCP) v5.6 Skill Reference

## 1. Cleanverse Core Architecture
- **Cleanverse Verified Identity (CVI / A-Pass)**: Onchain/gateway identity primitive bound to user wallets. Contains `tier` (0-99), `subTier`, `group`, `subGroup`, and ISO 3166-1 country bitmap tags.
- **Cleanverse Verified Asset (CVA)**: ERC20 compliant asset rail with built-in CVI verification and `RuleV2` compliance hooks.
- **Cleanverse Compliance Validator (`IAPassComplianceValidator`)**: Onchain smart contract gating pool access via `complianceVerify(poolAddress, userAddress)`.
- **RuleV2 Policy Engine**: Rule structure holding allowed CVI group, sub-group, minimum tier, sub-tier, and country bitmap.

---

## 2. RuleV2 Specification
```solidity
struct RuleV2 {
    bytes2  allowedGroup;        // Allowed CVI group (0x0000 = unrestricted)
    bytes2  allowedSubGroup;     // Allowed CVI sub-group (0x0000 = unrestricted)
    uint8   minTier;             // Minimum CVI tier (0-99)
    uint8   minSubTier;          // Minimum sub-tier (0-99)
    uint256 poolCountryBitmap;   // Country bitmap (0 = unrestricted; bitwise AND check)
}
```
* **Evaluation Semantics**: Fields within a single `RuleV2` are `AND`; multiple `RuleV2` structs are `OR`.

---

## 3. Validator Interface (`IAPassComplianceValidator`)
```solidity
interface IAPassComplianceValidator {
    struct RuleV2 {
        bytes2 allowedGroup;
        bytes2 allowedSubGroup;
        uint8 minTier;
        uint8 minSubTier;
        uint256 poolCountryBitmap;
    }

    function registerV2(address poolAddress, RuleV2 calldata rule) external;
    function registerApass(address poolAddress, address aTokenAddress) external;
    function registerApass(address poolAddress, address aTokenAddress, address feeAddress) external;
    function isRegistered(address poolAddress) external view returns (bool);
    function setRuleV2FromContract(RuleV2 calldata rule) external;
    function addRuleV2FromContract(RuleV2 calldata rule) external;
    function removeRuleV2FromContract(uint256 index) external;
    function getRulesV2(address poolAddress) external view returns (RuleV2[] memory);
    function complianceVerify(address poolAddress, address userAddress) external view returns (bool);
}
```

---

## 4. API v5.6 Authentication & Encryption Specification
- **Base URL**:
  - Sandbox: `https://uatapi.cleanverse.com/api/cooperate`
  - Production: `https://api.cleanverse.com/api/cooperate`
- **Headers**:
  - `api-id: <your_api_id>`
  - `X-Request-ID: <uuid_v4>`
  - `Content-Type: application/json`
- **Encryption Engine**:
  - Algorithm: `AES/CBC/PKCS5Padding`
  - IV: 16 zero-bytes (`0x00000000000000000000000000000000`)
  - Key: Base64-decoded `api-key`
  - Body Envelope: `{"data": "<Base64 Ciphertext>"}`
- **Owner Signature Rule**:
  - `owner_signature` for contract registration = EIP-191 `personal_sign` of `keccak256(lowercase chain + contract_address)`.

---

## 5. Standard Integration Endpoints
- `POST /generate_apass` — Creates a new A-Pass account with identity details & ISO country tags.
- `POST /update_status` — Freezes (`status: "2"`) or unfreezes (`status: "1"`) A-Pass accounts.
- `POST /atoken/launch` — Submits CVA token launch application with `RuleV2` policy.
- `POST /validator/register` — Registers compliance pool with validator.
- `POST /validator/set_rule` — Sets `RuleV2` policy for validator pool.
- `POST /validator/verify` — Queries user compliance state (Unencrypted JSON).
