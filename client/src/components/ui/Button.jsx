const variants = {
  primary: "bg-ink text-white hover:bg-ink-soft",
  accent: "bg-saffron text-ink hover:bg-saffron-600 hover:text-white",
  outline: "border border-line bg-white text-ink hover:border-ink/30",
  ghost: "text-ink hover:bg-white",
};

export default function Button({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
