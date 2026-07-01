export default function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
      />
    </label>
  );
}
