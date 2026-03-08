import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { WalletControls } from "@/components/wallet/wallet-controls";
import { Button } from "@/components/ui/button";

interface SiteHeaderProps {
  showDashboardLink?: boolean;
}

export function SiteHeader({ showDashboardLink = true }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#071713]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          {showDashboardLink ? (
            <Link href="/app" className="hidden md:block">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : null}
          <WalletControls />
        </div>
      </div>
    </header>
  );
}
