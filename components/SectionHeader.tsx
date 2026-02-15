export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className="h-1 w-8 rounded-full bg-(--gold)" />
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{title}</h2>
      </div>
      {subtitle ? <p className="mt-2 text-(--muted)">{subtitle}</p> : null}
    </div>
  );
}
