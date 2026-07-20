"use client";

// A live feed of posts for one zone. Firestore onSnapshot - the page ticks
// while you read, no polling.
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Post, Zone } from "@/lib/types";
import PostCard from "./PostCard";

export default function Feed({ zone, max }: { zone: Zone; max?: number }) {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("zone", "==", zone),
      where("status", "==", "live"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
        setPosts(max ? list.slice(0, max) : list);
      },
      // Rules not deployed yet / offline → graceful empty state, not an error.
      () => setPosts([])
    );
  }, [zone, max]);

  if (posts === null) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-ink-2" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-line px-8 py-14 text-center">
        <span className="emblem mb-4 h-12 w-8 text-paper-faint" aria-hidden />
        {zone === "for" ? (
          <>
            <p className="font-display text-lg text-paper-dim">
              The desk is quiet - for now.
            </p>
            <p className="mt-2 max-w-xs text-sm text-paper-faint">
              No editorials have been published yet. The first one is worth
              waiting for.
            </p>
            <Link
              href="/about"
              className="mt-5 rounded-full border border-line px-5 py-1.5 text-sm text-paper-dim transition hover:border-saffron/50 hover:text-saffron"
            >
              Read the mission
            </Link>
          </>
        ) : (
          <>
            <p className="font-display text-lg text-paper-dim">
              No ground reports yet.
            </p>
            <p className="mt-2 max-w-xs text-sm text-paper-faint">
              Someone has to go first. It could be you - it takes a Google
              account and something true.
            </p>
            <Link
              href="/write"
              className="mt-5 rounded-full border border-saffron/50 px-5 py-1.5 text-sm text-saffron transition hover:bg-saffron/10"
            >
              Write the first report
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((p, i) => (
        <PostCard key={p.id} post={p} index={i} />
      ))}
    </div>
  );
}
