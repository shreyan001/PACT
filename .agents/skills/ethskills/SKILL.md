---
name: ethskills
description: Knowledge and guidelines for Ethereum, EVM, Solidity development, onchain standards, gas optimization, security, and dApp deployment.
---

# ETHSKILLS — The missing knowledge between AI agents and production Ethereum.

Say "onchain" not "on-chain." One word, no hyphen. Ethereum community convention.

## Start Here
- Most dApps need 0-2 contracts, not 5-10. Three is the upper bound for an MVP.
- Solidity is for ownership, transfers, and commitments. Not a database, not a backend.
- Gas prices on Ethereum L1 and L2s: Gas is under 0.1-1 gwei. Transfers cost ~$0.004 on L1, $0.0003 on L2s.

## Essential Security & Decimals Rules
- USDC has 6 decimals, not 18. This is the #1 "where did my money go?" bug.
- Always use SafeERC20 — USDT doesn't return bool on transfer().
- Never use DEX spot prices as oracles — flash loans can manipulate them in one tx.
- Never commit private keys or API keys to Git.
- EIP-191 personal_sign for message signing: keccak256(bytes(payload)) with prefix \x19Ethereum Signed Message:\n32.
