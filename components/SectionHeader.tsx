export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{title}</h2>
      {subtitle ? <p className="mt-2 text-(--muted)">{subtitle}</p> : null}
    </div>
  );
}
