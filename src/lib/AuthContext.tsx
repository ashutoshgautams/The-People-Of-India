"use client";

// Session context: current user, admin claim, and blocked status.
// isAdmin comes from the Firebase custom claim `admin: true` on the ID token -
// the same claim firestore.rules checks, so UI state and server enforcement agree.
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

interface AuthState {
  user: User | null;
  /** True while the initial auth handshake is in flight. */
  loading: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  isAdmin: false,
  isBlocked: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Read the admin custom claim off the ID token.
        const token = await u.getIdTokenResult();
        setIsAdmin(token.claims.admin === true);

        // Check the blocklist (keyed by email). Rules allow reading your own entry.
        if (u.email) {
          try {
            const blocked = await getDoc(doc(db, "blocked", u.email));
            setIsBlocked(blocked.exists());
          } catch {
            setIsBlocked(false);
          }
        }

        // Upsert a lightweight profile so admins can browse users.
        try {
          await setDoc(
            doc(db, "users", u.uid),
            {
              name: u.displayName ?? "Anonymous",
              email: u.email ?? "",
              photoURL: u.photoURL ?? null,
              lastSeen: serverTimestamp(),
            },
            { merge: true }
          );
        } catch {
          // Non-fatal - a blocked user may be denied this write.
        }
      } else {
        setIsAdmin(false);
        setIsBlocked(false);
      }
      setLoading(false);
    });
  }, []);

  const signIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, isBlocked, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
