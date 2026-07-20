"use client";

// Admin panel. UI-gated by the `admin` custom claim - but the real enforcement
// is in firestore.rules: every write here fails server-side without the claim.
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import AdminEditorial from "@/components/admin/AdminEditorial";
import AdminQueue from "@/components/admin/AdminQueue";
import AdminPosts from "@/components/admin/AdminPosts";
import AdminReports from "@/components/admin/AdminReports";
import AdminBlocklist from "@/components/admin/AdminBlocklist";

const TABS = [
  { id: "editorial", label: "Editorial desk" },
  { id: "queue", label: "Review queue" },
  { id: "posts", label: "All posts" },
  { id: "reports", label: "Reports" },
  { id: "blocklist", label: "Blocklist" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const { user, loading, isAdmin, signIn } = useAuth();
  const [tab, setTab] = useState<TabId>("editorial");

  if (loading) return <div className="min-h-screen" />;

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-3xl text-paper">Admin only</h1>
        <p className="mt-3 max-w-sm text-sm text-paper-dim">
          {user
            ? "This account doesn't carry the admin claim. If it should, run the assignRole script."
            : "Sign in with an admin Google account to continue."}
        </p>
        {!user && (
          <button
            onClick={() => signIn()}
            className="mt-6 rounded-full bg-saffron px-6 py-2.5 text-sm font-medium text-white hover:bg-saffron-soft transition"
          >
            Sign in with Google
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-display text-3xl text-paper">Admin</h1>
      <p className="mt-1 text-sm text-paper-faint">
        Signed in as {user.email} · full override authority
      </p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              tab === t.id
                ? "bg-saffron text-white font-medium"
                : "text-paper-dim hover:bg-elevate hover:text-paper"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "editorial" && <AdminEditorial />}
        {tab === "queue" && <AdminQueue />}
        {tab === "posts" && <AdminPosts />}
        {tab === "reports" && <AdminReports />}
        {tab === "blocklist" && <AdminBlocklist />}
      </div>
    </div>
  );
}
