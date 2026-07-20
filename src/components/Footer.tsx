import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="emblem h-10 w-7 text-paper" aria-hidden />
              <p className="font-display text-lg text-paper">
                The People <span className="text-saffron">of</span> India
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-paper-faint">
              Independent, non-profit, open-source journalism. Neither left nor
              right - the problems of the people, right at the centre.
            </p>
            <p className="mt-4 text-sm italic text-paper-dim">
              “This should not stop here. I will not stop here. You should not
              stop here.”
            </p>
            <a
              href="https://instagram.com/thepeople_of_india"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm text-paper-dim transition hover:border-saffron/50 hover:text-saffron"
            >
              {/* Instagram glyph */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
              </svg>
              Follow @thepeople_of_india
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
            <Link href="/about" className="text-paper-dim hover:text-paper transition-colors">About</Link>
            <Link href="/founders" className="text-paper-dim hover:text-paper transition-colors">Founders</Link>
            <Link href="/contact" className="text-paper-dim hover:text-paper transition-colors">Contact</Link>
            <Link href="/guidelines" className="text-paper-dim hover:text-paper transition-colors">Guidelines</Link>
            <Link href="/terms" className="text-paper-dim hover:text-paper transition-colors">Terms</Link>
            <Link href="/privacy" className="text-paper-dim hover:text-paper transition-colors">Privacy</Link>
            <Link href="/disclaimer" className="text-paper-dim hover:text-paper transition-colors">Disclaimer</Link>
          </div>

          <div className="text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-paper-faint">
              Reach us
            </p>
            <a
              href="mailto:support@thepeopleofindia.org"
              className="mt-2 block text-paper-dim transition-colors hover:text-saffron"
            >
              support@thepeopleofindia.org
            </a>
            <p className="text-xs text-paper-faint">help with anything, 24h</p>
            <a
              href="mailto:ashutosh@thepeopleofindia.org"
              className="mt-3 block text-paper-dim transition-colors hover:text-saffron"
            >
              ashutosh@thepeopleofindia.org
            </a>
            <p className="text-xs text-paper-faint">letters to the founder</p>
          </div>
        </div>
        <p className="mt-10 text-xs text-paper-faint">
          Open source, for the people and by the people. Never sold - to anyone.
        </p>
      </div>
    </footer>
  );
}
