export const env = {
  rpcUrls: {
    ethereum: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL?.trim() || undefined,
    base: process.env.NEXT_PUBLIC_BASE_RPC_URL?.trim() || undefined,
    arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL?.trim() || undefined,
  },
} as const;
