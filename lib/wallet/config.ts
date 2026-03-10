import { createConfig, http } from "wagmi";
import { injected } from "@wagmi/core";

import { supportedChains } from "@/lib/chains";
import { env } from "@/lib/env";

export const wagmiConfig = createConfig({
  // Client-side discovery is more reliable for injected wallets and EIP-6963 providers.
  ssr: false,
  chains: supportedChains,
  connectors: [
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 4_000,
    }),
  ],
  multiInjectedProviderDiscovery: true,
  transports: {
    1: http(env.rpcUrls.ethereum),
    8453: http(env.rpcUrls.base),
    42161: http(env.rpcUrls.arbitrum),
  },
});
