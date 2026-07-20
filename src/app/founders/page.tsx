import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Founders",
  description:
    "The three citizens who built The People of India - engineers by trade, troubled by both the ruling side and the opposition, building an alternative.",
};

const founders = [
  {
    name: "Ashutosh Gautam",
    role: "Engineering & product",
    line: "Believes a platform's incentives matter more than its promises - so this one has none to sell.",
  },
  {
    name: "Anjali Ray",
    role: "Engineering & design",
    line: "Believes credibility is a design problem too: a neutral platform has to look and feel neutral.",
  },
  {
    name: "Abhinash LC",
    role: "Engineering & infrastructure",
    line: "Believes the rails matter: open code, public rules, and nothing that can be quietly bought.",
  },
];

export default function FoundersPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-saffron">Founded by</p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-paper md:text-5xl">
        Three citizens.
        <br />
        Zero patrons.
      </h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {founders.map((f) => (
          <div
            key={f.name}
            className="rounded-2xl border border-line bg-ink-2 p-5 shadow-card"
          >
            <span className="emblem mb-3 block h-8 w-6 text-saffron/60" aria-hidden />
            <p className="font-display text-lg leading-snug text-paper">{f.name}</p>
            <p className="mt-1 text-xs text-paper-faint">{f.role}</p>
            <p className="mt-3 text-xs leading-relaxed text-paper-dim">{f.line}</p>
          </div>
        ))}
      </div>

      <div className="prose-tpi mt-10 text-[0.975rem]">
        <p>
          We are engineers and computer folks by background - and general
          Indian citizens by every other measure. We stand in the same queues,
          ride the same trains, breathe the same air, and watch the same news
          wondering why none of it sounds like the street outside.
        </p>
        <p>
          None of us comes from politics, and none of us wants to. What
          troubles us is simple: the ruling side has its media, the opposition
          has its media, and the people have nobody's. We wanted a newsroom
          that is angry at both when both deserve it - that hits the BJP as
          hard as the Congress, and holds whoever governs next to the same
          flame. We looked for it and couldn't find it. So, being builders, we
          built it.
        </p>
        <p>
          Like a lot of people our age, we are also trying to build things of
          our own - startups, products, small bets on India's future. This
          platform is one of those bets, just not a commercial one. It earns
          nothing, sells nothing, and answers to nobody but its readers. There
          are no investors to please, no advertisers to protect, no party fund
          with our names in its ledger - and there never will be.
        </p>
        <p>
          The code is open source. The moderation rules are public. Every
          report is signed with a real name, including ours. And the day this
          project is still run by only three people will be the day it has
          failed - it is meant to be outgrown by the people who use it.
        </p>
        <blockquote>
          This should not stop here. We will not stop here. You should not
          stop here.
        </blockquote>
        <p>
          Read the <Link href="/about">mission</Link>, or better -{" "}
          <Link href="/write">write what you saw</Link>.
        </p>
      </div>
    </div>
  );
}
