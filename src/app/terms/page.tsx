import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Use">
      <p>
        By using The People of India (&quot;the platform&quot;) you agree to
        these terms. The platform is an independent, non-profit, open-source
        publication. It has no commercial owner and sells nothing - including
        your attention.
      </p>
      <h2>Accounts</h2>
      <p>
        Sign-in is via Google only. Your display name and email come from your
        Google account; you publish under your real name. You are responsible
        for everything posted from your account.
      </p>
      <h2>Your content</h2>
      <p>
        You retain ownership of what you publish in By the People. By posting,
        you grant the platform a non-exclusive, worldwide, royalty-free licence
        to display, distribute, and archive your content as part of the
        publication. You warrant that your content is your own and does not
        violate any law or third-party right.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not publish defamation, incitement to violence, hate speech,
        doxxing, knowingly false information, or content that violates Indian
        law. See the <a href="/guidelines">community guidelines</a>. Content
        may be hidden by community signals or removed by administrators;
        accounts may be blocked for violations.
      </p>
      <h2>Moderation</h2>
      <p>
        By-the-People posts publish instantly and may be auto-hidden into an
        admin review queue by community disagreement thresholds, or removed by
        administrators at their sole discretion. Editorial (For the People)
        content is the platform's own.
      </p>
      <h2>Liability</h2>
      <p>
        The platform is provided &quot;as is&quot;, without warranty. Views in
        By-the-People posts are their authors' own - see the{" "}
        <a href="/disclaimer">disclaimer</a>. To the fullest extent permitted
        by law, the platform and its volunteers are not liable for
        user-generated content or for any damages arising from use of the
        platform.
      </p>
      <h2>Changes</h2>
      <p>
        These terms may be updated; continued use after changes constitutes
        acceptance. The governing law is the law of India.
      </p>
    </LegalPage>
  );
}
