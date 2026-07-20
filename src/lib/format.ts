import type { Timestamp } from "firebase/firestore";

/** "2 hours ago" style relative time for feed cards and comments. */
export function timeAgo(ts: Timestamp | null): string {
  if (!ts) return "just now";
  const seconds = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return ts.toDate().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fullDate(ts: Timestamp | null): string {
  if (!ts) return "";
  return ts.toDate().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** First inline image in a post's HTML, used as the feed-card cover. */
export function firstImage(html: string): string | null {
  const m = html.match(/<img[^>]+src="([^"]+)"/);
  return m ? m[1] : null;
}

/** Strip tags for plain-text excerpts on feed cards. */
export function excerpt(html: string, length = 180): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? text.slice(0, length).trimEnd() + "…" : text;
}
