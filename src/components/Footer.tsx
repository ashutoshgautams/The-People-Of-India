import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
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
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
            <Link href="/about" className="text-paper-dim hover:text-paper transition-colors">About</Link>
            <Link href="/founders" className="text-paper-dim hover:text-paper transition-colors">Founders</Link>
            <Link href="/guidelines" className="text-paper-dim hover:text-paper transition-colors">Guidelines</Link>
            <Link href="/terms" className="text-paper-dim hover:text-paper transition-colors">Terms</Link>
            <Link href="/privacy" className="text-paper-dim hover:text-paper transition-colors">Privacy</Link>
            <Link href="/disclaimer" className="text-paper-dim hover:text-paper transition-colors">Disclaimer</Link>
          </div>
        </div>
        <p className="mt-10 text-xs text-paper-faint">
          Open source, for the people and by the people. Never sold - to anyone.
        </p>
      </div>
    </footer>
  );
}
