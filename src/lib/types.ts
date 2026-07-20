import type { Timestamp } from "firebase/firestore";

/** The two content zones. "for" = editorial (admins only). "by" = open contributions. */
export type Zone = "for" | "by";

/** live = visible to everyone. hidden = auto-moderated or admin-hidden, in the review queue. */
export type PostStatus = "live" | "hidden";

export interface Post {
  id: string;
  zone: Zone;
  title: string;
  /** Sanitized-on-render HTML from the Tiptap editor. */
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorPhoto: string | null;
  createdAt: Timestamp | null;
  hearts: number;
  disagrees: number;
  commentCount: number;
  status: PostStatus;
  /** Set when a post was auto-hidden by the community threshold (vs. hidden by an admin). */
  autoHidden?: boolean;
  /** Optional cover image URL; feed cards fall back to the first inline image. */
  cover?: string | null;
}

export type ReactionType = "heart" | "disagree";

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string | null;
  text: string;
  createdAt: Timestamp | null;
  hearts: number;
  disagrees: number;
}

export interface Report {
  id: string;
  postId: string;
  postTitle: string;
  reason: string;
  reporterId: string;
  reporterEmail: string;
  createdAt: Timestamp | null;
  status: "open" | "resolved";
}

/** Auto-moderation thresholds (By the People only). Mirrored in firestore.rules. */
export const AUTO_HIDE_MIN_REACTIONS = 15;
export const AUTO_HIDE_DISAGREE_RATIO = 0.7;
