"use client";

// Block / unblock users by email. The blocklist doc's existence is what
// firestore.rules checks - a blocked user's writes fail server-side.
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { timeAgo } from "@/lib/format";
import type { Timestamp } from "firebase/firestore";

interface BlockedEntry {
  email: string;
  reason?: string;
  blockedBy?: string;
  createdAt?: Timestamp | null;
}

export default function AdminBlocklist() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<BlockedEntry[]>([]);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    return onSnapshot(
      collection(db, "blocked"),
      (snap) =>
        setEntries(
          snap.docs.map((d) => ({ email: d.id, ...d.data() }) as BlockedEntry)
        ),
      () => setEntries([]) // rules not deployed yet - fail quiet, not loud
    );
  }, []);

  const block = async () => {
    const target = email.trim().toLowerCase();
    if (!target || !target.includes("@")) return;
    // Doc ID = email → cheap existence check in security rules.
    await setDoc(doc(db, "blocked", target), {
      reason: reason.trim() || "No reason recorded",
      blockedBy: user?.email ?? "",
      createdAt: serverTimestamp(),
    });
    setEmail("");
    setReason("");
  };

  const unblock = async (target: string) => {
    if (!confirm(`Unblock ${target}?`)) return;
    await deleteDoc(doc(db, "blocked", target));
  };

  return (
    <div>
      <div className="mb-8 max-w-md space-y-3 rounded-xl border border-line bg-ink-2 p-5">
        <h3 className="text-sm font-medium text-paper">Block a user</h3>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@gmail.com"
          type="email"
          className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper outline-none placeholder:text-paper-faint focus:border-saffron/50"
        />
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (kept internal)"
          className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper outline-none placeholder:text-paper-faint focus:border-saffron/50"
        />
        <button
          onClick={block}
          disabled={!email.includes("@")}
          className="rounded-full bg-red-400/90 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-red-400 disabled:opacity-40"
        >
          Block
        </button>
        <p className="text-xs text-paper-faint">
          Blocked users can still read, but cannot post, comment, or react.
        </p>
      </div>

      <div className="space-y-2">
        {entries.map((e) => (
          <div
            key={e.email}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-ink-2 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-paper">{e.email}</p>
              <p className="text-xs text-paper-faint">
                {e.reason} · by {e.blockedBy} · {timeAgo(e.createdAt ?? null)}
              </p>
            </div>
            <button
              onClick={() => unblock(e.email)}
              className="shrink-0 text-xs text-saffron hover:text-saffron-soft"
            >
              Unblock
            </button>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-paper-faint">No one is blocked.</p>
        )}
      </div>
    </div>
  );
}
