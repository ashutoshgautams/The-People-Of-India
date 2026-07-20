import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <LegalPage eyebrow="Legal" title="Disclaimer">
      <h2>By-the-People content</h2>
      <p>
        Every post in the By the People section is published directly by its
        author, without prior editorial review. The views, claims, and media in
        those posts are <strong>the author's own</strong> and do not represent
        the views, endorsement, or verification of The People of India
        platform, its volunteers, or its contributors. The platform acts as an
        intermediary hosting user-generated content.
      </p>
      <h2>Editorial content</h2>
      <p>
        For-the-People pieces are the platform's editorial voice. We aim for
        accuracy and fairness toward all parties - and we correct errors
        openly when found.
      </p>
      <h2>Neutrality</h2>
      <p>
        The People of India is not affiliated with, funded by, or aligned with
        any political party, government, or organization - ruling or
        opposition. Criticism published here targets actions and policies, not
        allegiance.
      </p>
      <h2>No professional advice</h2>
      <p>
        Nothing on this platform constitutes legal, financial, or professional
        advice.
      </p>
      <h2>Takedowns</h2>
      <p>
        Content that violates law or our <a href="/guidelines">guidelines</a>{" "}
        can be reported via the Report button on any By-the-People post and
        will be reviewed by administrators.
      </p>
    </LegalPage>
  );
}
