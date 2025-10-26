type Props = { label: string };
export function TechBadge({ label }: Props) {
  return (
    <span className="inline-flex items-center rounded-lg border border-(--line) px-2.5 py-1 text-xs text-(--text)/90 bg-(--panel)">
      {label}
    </span>
  );
}
