import type { Metadata } from "next";
import Link from "next/link";
import Feed from "@/components/Feed";
import ZoneBar from "@/components/ZoneBar";

export const metadata: Metadata = {
  title: "By the People",
  description:
    "Open ground reports from anyone, anywhere in India. Sign in and publish - no editors in between.",
};

export default function ByThePeoplePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="mb-10">
        <ZoneBar />
      </div>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-saffron">
          Open contributions
        </p>
        <h1 className="mt-2 font-display text-4xl text-paper md:text-5xl">
          By the People
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-dim">
          Ground reports from anyone with something real to say. Published
          instantly - moderated by the community and reviewed by admins.
          Views are each author's own.
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper-faint">
          And you don't have to type: speak and it becomes text, or record
          your voice and post the audio itself. What happened to you at the
          protest? What should the government fix first - and how? Say it.
        </p>
        <Link
          href="/write"
          className="mt-5 inline-block rounded-full bg-saffron px-6 py-2 text-sm font-medium text-white transition hover:bg-saffron-soft"
        >
          Write a report
        </Link>
      </header>
      <Feed zone="by" />
    </div>
  );
}
