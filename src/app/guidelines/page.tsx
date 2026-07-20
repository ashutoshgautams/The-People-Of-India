import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Community Guidelines" };

export default function GuidelinesPage() {
  return (
    <LegalPage eyebrow="Community" title="Guidelines">
      <p>
        This platform runs on trust. It stays credible only if every report on
        it deserves to be believed. Before you publish, agree to this much:
      </p>
      <h2>Report, don't campaign</h2>
      <ul>
        <li>Write what you saw, heard, and can stand behind - under your real name.</li>
        <li>
          Criticize any party, any leader, any policy - BJP, Congress, or
          anyone else. But criticize what happened, not who someone is.
        </li>
        <li>No party promotional material, from any side.</li>
      </ul>
      <h2>Hard lines</h2>
      <ul>
        <li>No knowingly false or fabricated information.</li>
        <li>No incitement to violence, hate speech, or communal targeting.</li>
        <li>No doxxing or publishing private individuals' personal details.</li>
        <li>No obscene content or harassment.</li>
      </ul>
      <h2>How moderation works</h2>
      <ul>
        <li>
          <strong>Disagree means disagree</strong> - dispute of facts, not
          discomfort. Hearts mean &quot;I stand with this.&quot;
        </li>
        <li>
          A post with at least 15 reactions where 70% or more disagree is
          automatically hidden into the admin review queue - never silently
          deleted.
        </li>
        <li>
          The Report button flags a post directly to administrators for legal
          or guideline violations.
        </li>
        <li>
          Administrators can remove any content and block repeat violators by
          email.
        </li>
      </ul>
      <p>
        That's it. Tell the truth, own your words, and let the people decide.
      </p>
    </LegalPage>
  );
}
