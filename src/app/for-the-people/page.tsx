import type { Metadata } from "next";
import Feed from "@/components/Feed";
import ZoneBar from "@/components/ZoneBar";

export const metadata: Metadata = {
  title: "For the People",
  description:
    "The editorial desk of The People of India - reported, checked, published by the platform.",
};

export default function ForThePeoplePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="mb-10">
        <ZoneBar />
      </div>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-saffron">Editorial</p>
        <h1 className="mt-2 font-display text-4xl text-paper md:text-5xl">
          For the People
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-dim">
          Written by the platform's editorial desk. No party line, no
          patronage - reporting that hits both sides equally hard. React to
          tell us where you stand; comments live in{" "}
          <a href="/by-the-people" className="text-saffron underline underline-offset-2">
            By the People
          </a>
          .
        </p>
      </header>
      <Feed zone="for" />
    </div>
  );
}
