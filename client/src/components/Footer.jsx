export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-display font-bold text-ink">
          Admission<span className="text-saffron">Walla</span>
        </p>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Fillip Technologies Pvt. Ltd. · Admission
          &amp; Counselling Portal
        </p>
      </div>
    </footer>
  );
}
