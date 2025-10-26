export function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-(--line) bg-(--panel) px-2.5 py-1 text-xs text-(--text)/90">
      <strong className="text-(--gold)">{value}</strong>
      <span className="text-(--muted)">{label}</span>
    </span>
  );
}
