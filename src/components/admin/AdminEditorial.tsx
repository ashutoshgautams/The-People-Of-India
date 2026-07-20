"use client";

// Editorial desk: create / edit / publish / delete For-the-People posts.
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import type { Post } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import Editor from "@/components/Editor";

export default function AdminEditorial() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | "new" | null>(null);
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState<TiptapEditor | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("zone", "==", "for"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(
      q,
      (snap) =>
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post)),
      () => {} // rules not deployed yet - fail quiet, not loud
    );
  }, []);

  const openEditor = (p: Post | "new") => {
    setEditing(p);
    setTitle(p === "new" ? "" : p.title);
  };

  const save = async () => {
    if (!user || !editor || !title.trim() || busy) return;
    setBusy(true);
    try {
      if (editing === "new") {
        await addDoc(collection(db, "posts"), {
          zone: "for",
          title: title.trim().slice(0, 200),
          content: editor.getHTML(),
          authorId: user.uid,
          authorName: "The People of India", // editorial voice, not a personal byline
          authorEmail: user.email ?? "",
          authorPhoto: null,
          createdAt: serverTimestamp(),
          hearts: 0,
          disagrees: 0,
          commentCount: 0,
          status: "live",
        });
      } else if (editing) {
        await updateDoc(doc(db, "posts", editing.id), {
          title: title.trim().slice(0, 200),
          content: editor.getHTML(),
        });
      }
      setEditing(null);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: Post) => {
    if (!confirm(`Permanently delete "${p.title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "posts", p.id));
  };

  if (editing) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setEditing(null)}
            className="text-sm text-paper-faint hover:text-paper"
          >
            ← Back to list
          </button>
          <button
            onClick={save}
            disabled={busy || !title.trim()}
            className="rounded-full bg-saffron px-6 py-2 text-sm font-medium text-white hover:bg-saffron-soft transition disabled:opacity-40"
          >
            {busy ? "Saving…" : editing === "new" ? "Publish" : "Save changes"}
          </button>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Editorial headline"
          className="w-full bg-transparent font-display text-3xl text-paper outline-none placeholder:text-paper-faint"
        />
        <div className="mt-6">
          <Editor
            onReady={setEditor}
            placeholder="Write the editorial…"
            initialContent={editing === "new" ? "" : editing.content}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => openEditor("new")}
        className="mb-6 rounded-full bg-saffron px-5 py-2 text-sm font-medium text-white hover:bg-saffron-soft transition"
      >
        + New editorial
      </button>
      <div className="space-y-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-ink-2 p-4"
          >
            <div className="min-w-0">
              <p className="truncate text-paper">{p.title}</p>
              <p className="text-xs text-paper-faint">
                {timeAgo(p.createdAt)} · ♥ {p.hearts} · ⊘ {p.disagrees}
              </p>
            </div>
            <div className="flex shrink-0 gap-2 text-sm">
              <button onClick={() => openEditor(p)} className="text-paper-dim hover:text-paper">
                Edit
              </button>
              <button onClick={() => remove(p)} className="text-red-400/80 hover:text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-paper-faint">No editorial pieces yet.</p>
        )}
      </div>
    </div>
  );
}
