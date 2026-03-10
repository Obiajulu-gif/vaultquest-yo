import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SavingsDashboard } from "@/components/savings/dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="page-shell page-stack">
        <SavingsDashboard />
      </main>
      <SiteFooter />
    </div>
  );
}
