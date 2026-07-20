"use client";

// Reports queue - fed by the Report button on By-the-People posts.
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import type { Report } from "@/lib/types";
import { timeAgo } from "@/lib/format";

export default function AdminReports() {
  const [reports, setReports] = useState<Report[] | null>(null);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) =>
        setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Report)),
      () => setReports([]) // rules not deployed yet - fail quiet, not loud
    );
  }, []);

  const resolve = async (r: Report) => {
    await updateDoc(doc(db, "reports", r.id), { status: "resolved" });
  };

  const dismiss = async (r: Report) => {
    await deleteDoc(doc(db, "reports", r.id));
  };

  if (reports === null)
    return <p className="text-sm text-paper-faint">Loading reports…</p>;

  if (reports.length === 0)
    return (
      <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-paper-faint">
        No reports. All quiet.
      </p>
    );

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div
          key={r.id}
          className={`rounded-xl border p-4 ${
            r.status === "open"
              ? "border-saffron/25 bg-ink-2"
              : "border-line bg-ink-2 opacity-60"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-paper-faint">
            <span
              className={
                r.status === "open"
                  ? "rounded-full bg-saffron/10 px-2 py-0.5 text-saffron"
                  : "rounded-full bg-elevate px-2 py-0.5"
              }
            >
              {r.status}
            </span>
            <span>
              by {r.reporterEmail} · {timeAgo(r.createdAt)}
            </span>
          </div>
          <Link
            href={`/by-the-people/${r.postId}`}
            className="mt-2 block text-sm text-paper hover:text-saffron-soft"
          >
            {r.postTitle}
          </Link>
          <p className="mt-1 text-sm text-paper-dim">“{r.reason}”</p>
          <div className="mt-3 flex gap-3 text-xs">
            {r.status === "open" && (
              <button onClick={() => resolve(r)} className="text-saffron hover:text-saffron-soft">
                Mark resolved
              </button>
            )}
            <button onClick={() => dismiss(r)} className="text-paper-faint hover:text-paper-dim">
              Remove report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
