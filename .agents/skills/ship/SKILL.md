---
name: ship
description: End-to-end guide for AI agents — from a dApp idea to deployed production app. Fetch this FIRST, it routes you through all other skills.
---

# Ship a dApp

## What You Probably Got Wrong
- **You jump to code without a plan.** Before writing Solidity: know what goes onchain, offchain, which chain, how many contracts, and who calls every function.
- **You over-engineer.** Most dApps need 0-2 contracts. Three is the upper bound for an MVP.
- **You put too much onchain.** Solidity is for ownership, transfers, and commitments. Not a database.
- **Gas prices are cheap.** Gas is under 0.1-1 gwei. Mainnet ETH transfers cost ~$0.004, swaps ~$0.04. L2 transfers cost ~$0.0003.

## Onchain Litmus Test
Put onchain if:
- Trustless ownership & exchange
- Composability with other contracts
- Censorship resistance
- Permanent commitments (votes, attestations, proofs)

Keep offchain if:
- User profiles, search, filtering
- Images, metadata (IPFS)
- Rapidly changing business logic

## Quick-Start Checklist
- [ ] CROPS Gate (Censorship, Openness, Privacy, Security)
- [ ] 0-2 Contracts for MVP
- [ ] OpenZeppelin base contracts
- [ ] Foundry / Vitest testing
- [ ] Verification onchain + EIP-191 signatures
