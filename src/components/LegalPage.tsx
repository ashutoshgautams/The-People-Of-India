// Shared shell for legal/informational prose pages.
export default function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-saffron">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl text-paper">{title}</h1>
      <div className="prose-tpi mt-8 text-[0.975rem]">{children}</div>
    </div>
  );
}
