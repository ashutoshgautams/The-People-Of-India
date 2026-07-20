import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy">
      <p>
        We collect the minimum needed to run an accountable publication - and
        we sell none of it, to anyone, ever.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Google account basics</strong> when you sign in: your name,
          email address, and profile photo. These identify your posts,
          comments, and reactions.
        </li>
        <li>
          <strong>Your contributions</strong>: posts, comments, reactions, and
          reports you submit, with timestamps.
        </li>
        <li>
          <strong>Uploaded media</strong>: images and videos you attach to
          posts, stored in Firebase Storage.
        </li>
      </ul>
      <h2>What we don't do</h2>
      <ul>
        <li>No advertising, ad trackers, or third-party analytics.</li>
        <li>No sale, rental, or sharing of personal data with anyone.</li>
        <li>No profiling, no recommendation engine, no dark patterns.</li>
      </ul>
      <h2>Cookies &amp; storage</h2>
      <p>
        We use essential cookies and browser storage only: Firebase
        Authentication session data and a flag remembering that you dismissed
        the consent notice.
      </p>
      <h2>Infrastructure</h2>
      <p>
        Data is stored on Google Firebase (Firestore, Storage,
        Authentication) and the site is served via Vercel. Both process data
        under their own privacy terms as our infrastructure providers.
      </p>
      <h2>Your rights</h2>
      <p>
        You may delete your own comments. To request deletion of your posts,
        media, or account data, contact the administrators; public-interest
        journalism may be archived where the law allows.
      </p>
    </LegalPage>
  );
}
