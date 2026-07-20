import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach The People of India - support for anything, letters to the founder, and our Instagram. The team is always here to help.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-saffron">Contact</p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-paper md:text-5xl">
        The team is always here.
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper-dim">
        Whatever it is - a login problem, a question, a correction, a story we
        should see - write to us. We read everything and reply within 24
        hours.
      </p>

      <div className="mt-10 space-y-4">
        <a
          href="mailto:support@thepeopleofindia.org"
          className="group block rounded-2xl border border-line bg-ink-2 p-6 shadow-card transition-colors hover:border-saffron/40"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-paper-faint">
            Help with anything
          </p>
          <p className="mt-1.5 font-display text-xl text-paper transition-colors group-hover:text-saffron-soft">
            support@thepeopleofindia.org
          </p>
          <p className="mt-2 text-sm leading-relaxed text-paper-dim">
            Sign-in trouble, posting issues, takedown requests, corrections,
            press - one address for all of it.
          </p>
        </a>

        <a
          href="mailto:ashutosh@thepeopleofindia.org"
          className="group block rounded-2xl border border-line bg-ink-2 p-6 shadow-card transition-colors hover:border-saffron/40"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-paper-faint">
            Letters to the founder
          </p>
          <p className="mt-1.5 font-display text-xl text-paper transition-colors group-hover:text-saffron-soft">
            ashutosh@thepeopleofindia.org
          </p>
          <p className="mt-2 text-sm leading-relaxed text-paper-dim">
            For anything you'd rather say to a person than a platform - ideas,
            criticism, or a letter worth reading twice.
          </p>
        </a>

        <a
          href="https://instagram.com/thepeople_of_india"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl border border-line bg-ink-2 p-6 shadow-card transition-colors hover:border-saffron/40"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-paper-faint">
            Follow the reporting
          </p>
          <p className="mt-1.5 font-display text-xl text-paper transition-colors group-hover:text-saffron-soft">
            @thepeople_of_india
          </p>
          <p className="mt-2 text-sm leading-relaxed text-paper-dim">
            Ground reports and editorials, as they publish - on Instagram.
          </p>
        </a>
      </div>

      <p className="mt-10 text-sm text-paper-faint">
        Reporting something on a specific post? The fastest route is the{" "}
        <span className="text-paper-dim">Report</span> button on the post
        itself - it goes straight to the review queue. See the{" "}
        <Link href="/guidelines" className="text-saffron underline underline-offset-2">
          guidelines
        </Link>{" "}
        for what we act on.
      </p>
    </div>
  );
}
