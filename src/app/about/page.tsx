import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why The People of India exists: a media that is not right, not left, and is not for sale - to anyone.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-saffron">Our mission</p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-paper md:text-5xl">
        Not right. Not left.
        <br />
        Not for sale.
      </h1>

      <div className="prose-tpi mt-10">
        <p>
          This platform exists because both the ruling side and the opposition
          have their own bought-out media - someone far left, someone far
          right. The central idea here is simple: a media that is not right,
          not left, and is not sold - nor ever will be sold - to either.
        </p>
        <p>
          We are equally anti-right as we are anti-left. We hit the BJP as hard
          as we hit the Congress. This is not an anti-Modi or anti-RSS
          publication - and equally, it does not favor Rahul Gandhi or the
          Congress. We dissent from Congress's past mistakes just as much as we
          dissent from what is happening today.
        </p>
        <p>
          When it mattered, we didn't see anyone from the opposition show up on
          the ground either. India needs to grow beyond these two
          parties and find a third alternative. Until that day comes, we offer
          at least an alternative for the media: neither left nor right,
          covering the problems of the people, right at the centre. We show
          what Godi media never will.
        </p>
        <p>
          This is an open-source platform - for the people and by the people.
          It will never be run entirely by one person. Everyone has an equal
          say. Anyone can read everything. Anyone with a Google account and a
          real name can report from the ground in{" "}
          <Link href="/by-the-people">By the People</Link>, instantly, with no
          editor in between. The community - not a boardroom - decides what
          rises.
        </p>
        <blockquote>
          This should not stop here. I will not stop here. You should not stop
          here.
        </blockquote>
        <p>
          If that sentence means something to you, you already belong here.
          Read. React. Report.{" "}
          <Link href="/write">Write what you saw.</Link>
        </p>
      </div>

      <p className="mt-14 border-t border-line pt-6 text-sm text-paper-faint">
        Built by three citizens with zero patrons -{" "}
        <Link href="/founders" className="text-saffron underline underline-offset-2">
          meet the founders
        </Link>
        .
      </p>
    </div>
  );
}
