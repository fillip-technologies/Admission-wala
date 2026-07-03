export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display font-bold text-ink">
            Shri Admission <span className="text-saffron">Gurukul</span>
          </p>
          <p className="mt-1 text-xs text-muted">A unit of <a href="https://www.tribacblue.com/" className="text-blue-400">Tribac Blue.</a></p>
        </div>
        <div className="text-sm text-muted sm:text-right">
          <p className="mt-1 text-xs">Made by <a href="https://filliptechnologies.com/" className="text-blue-400"> Fillip Technologies</a> </p>
        </div>
      </div>
    </footer>
  );
}
