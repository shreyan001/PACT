# 01 — Base Cleanverse Client & EIP-191 Signing Infrastructure

**What to build:** End-to-end Cleanverse Cooperate API v5.6 HTTP client with AES/CBC/PKCS5Padding payload encryption, Base64 key normalization, and EIP-191 owner signature generation for onchain gateway authentication.

**Blocked by:** None — can start immediately.

**Status:** COMPLETED ✅

- [x] AES/CBC/PKCS5Padding encryption engine with 16 zero-byte IV and normalized 32-byte key buffer
- [x] Cleanverse Cooperate API v5.6 client supporting `/generate_apass`, `/update_status`, `/atoken/launch`, `/validator/register`, `/validator/set_rule`, `/validator/verify`
- [x] EIP-191 `personal_sign` signature generator for owner signatures (`keccak256(lowercase chain + contractAddress)`)
- [x] Passing unit test suite verifying payload encryption, decryption, and signature generation (`codebase/src/cleanverse/cleanverse.test.ts`)
