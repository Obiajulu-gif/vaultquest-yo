# VaultQuest

Trust-first DeFi savings dashboard powered by live YO vaults.

## Product Overview
VaultQuest turns YO vault access into a consumer savings account experience. Users connect an injected wallet, browse live vault venues, review chain and risk context, deposit idle assets, and redeem positions from one clean dashboard.

The app deliberately avoids mock transaction states and outdated chain assumptions. The core path is short, real, and demo-friendly.

## Why This Exists
Most DeFi savings products still expect users to understand protocol routing, approvals, wallet state, and chain context on their own.

VaultQuest reduces that complexity by making the most important decisions explicit:
- which chain the action will use
- which asset is being supplied or redeemed
- what the estimated output is
- whether the wallet needs to switch networks
- what risks still remain before signing

## How YO Protocol Is Used
VaultQuest uses the official YO SDK packages:
- `@yo-protocol/core` for live vault reads, pricing, balances, activity, and quote helpers
- `@yo-protocol/react` for the wallet-connected deposit and redeem transaction hooks

The dashboard loads the live YO catalog, surfaces real vault metrics, and sends real onchain deposit and redeem transactions through YO when a user signs in their wallet.

## Supported Chains
Wallet and chain handling are restricted to the hackathon-relevant networks:
- Base
- Ethereum
- Arbitrum

Important note:
- The current live YO vault catalog surfaced by the SDK is Base and Ethereum focused.
- Arbitrum is still supported in the wallet and network guardrails, so unsupported-chain handling stays explicit and consistent.

## Core Features
- injected wallet connection and disconnect flow
- supported-chain detection for Base, Ethereum, and Arbitrum
- live YO vault catalog loading
- chain filter and search
- deposit flow with real approval or deposit state handling
- redeem flow with real submission and confirmation handling
- wallet balance and user position snapshots
- portfolio summary with chain exposure
- recent live vault activity panel
- risk and trust messaging embedded in the UI
- mobile-aware responsive layout

## Wallet Connection Flow
1. Open the app and use the header wallet button.
2. Connect an injected browser wallet such as MetaMask, Rabby, Coinbase Extension, or another EIP-1193 wallet.
3. VaultQuest reads the connected address and current chain.
4. If the wallet is on an unsupported chain, the UI blocks actions and prompts the user to switch.

## Deposit Flow
1. Connect a supported wallet.
2. Open a vault card and click `Deposit`.
3. Enter an amount and review the vault chain, route, and preview.
4. Confirm the wallet prompt.
5. VaultQuest surfaces each transaction stage:
   - chain switching if needed
   - token approval if needed
   - deposit submission
   - confirmation
6. After confirmation, the dashboard refetches vault and portfolio data.

## Redeem Flow
1. Connect a supported wallet with an active position.
2. Open a vault card and click `Redeem`.
3. Enter the underlying asset amount to redeem.
4. VaultQuest quotes the share amount required and prompts a chain switch if necessary.
5. Confirm the redeem transaction in the wallet.
6. The modal reports whether the redeem was instant or created an onchain request.

## Risk And Trust Notes
- VaultQuest is a frontend for live onchain YO vault interactions.
- Every deposit or redeem still requires explicit wallet approval.
- Gas fees are external and determined by the active chain.
- Yield is variable and not guaranteed.
- Smart contract risk still exists.
- Users should verify chain, asset, and amount before signing.
- Some redeems may be queued depending on vault liquidity and protocol conditions.

## Tech Stack
- Next.js `16.1.6`
- React `19.2.4`
- Bun `1.3.9`
- Tailwind CSS `3.4.17`
- wagmi `3.5.0`
- viem `2.47.0`
- TanStack Query `5.90.21`
- YO SDK: `@yo-protocol/core` and `@yo-protocol/react`

## Project Structure
```text
app/
  app/page.tsx              Dashboard route
  globals.css               Global visual system
  layout.tsx                Root metadata, fonts, providers
  page.tsx                  Landing page
components/
  layout/                   Header, footer, logo, providers
  savings/                  Dashboard, vault preview, risk panel, transaction modal
  ui/                       Minimal button and modal primitives
  wallet/                   Wallet connection UI
hooks/
  use-hydrated.ts           Hydration-safe mounted state
  use-yo-data.ts            YO catalog, balances, activity, and quote queries
lib/
  chains.ts                 Supported chain metadata and explorer helpers
  env.ts                    Public environment access
  utils.ts                  Formatting and class helpers
  wallet/config.ts          wagmi configuration
  yo/clients.ts             Read-only YO client instances
  yo/types.ts               Flattened vault venue helpers
```

## Local Setup
### Prerequisites
- Bun `1.3.9` or newer
- Node.js `24+`
- An injected browser wallet for testing transactions

### Install
```bash
bun install
```

### Environment Variables
Create `.env.local` from `.env.example` and provide RPC overrides if you want to avoid the default public endpoints.

```bash
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_ETHEREUM_RPC_URL=
NEXT_PUBLIC_ARBITRUM_RPC_URL=
```

## Running The Project
### Development
```bash
bun run dev
```

### Typecheck
```bash
bun run typecheck
```

### Lint
```bash
bun run lint
```

### Production Build
```bash
bun run build
```

Note:
- The build script uses `next build --webpack`.
- On this Windows environment, the default Next 16 Turbopack build completed compilation but failed during cleanup with an `EBUSY` lock inside `.next/export`. The webpack build path completed successfully and is the stable choice here.

### Start Production Server
```bash
bun run start
```

## Demo Guidance
Best demo path:
1. Open `/` and frame VaultQuest as a smart YO-powered savings account.
2. Jump to `/app`.
3. Connect an injected wallet.
4. Filter vaults by Base or Ethereum.
5. Open a deposit modal and walk through chain, amount, and approval messaging.
6. Submit a real deposit.
7. Re-open the modal or a second vault to show redeem messaging and risk notes.

## Why This Fits The YO SDK Hackathon
- Uses the official YO SDK packages directly.
- Loads live YO vault data instead of local mocks.
- Executes real deposit and redeem flows.
- Keeps the UX simple enough for a fast judge demo.
- Adds visible trust messaging around live onchain actions.
- Focuses on a consumer savings use case instead of a protocol toy.

## Future Improvements
- add WalletConnect once the project includes the required connector peer packages and mobile UX polish
- extend per-vault analytics with richer history visualizations
- add richer per-user activity history and exportable savings statements
- support notification flows for queued redeem completion
- layer in smart vault recommendations based on wallet balances and chain preference
