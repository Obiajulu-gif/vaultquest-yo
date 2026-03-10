import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#07120f]/70">
      <div className="page-shell flex flex-col gap-4 py-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          VaultQuest is a trust-first frontend for live YO vault interactions on supported chains.
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/app" className="transition hover:text-white">
            Dashboard
          </Link>
          <a
            href="https://docs.yo.xyz/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            YO docs
          </a>
        </div>
      </div>
    </footer>
  );
}
