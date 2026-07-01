import Spinner from "./Spinner";

export default function FullScreenLoader({ label = "Loading…" }) {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <span className="text-sm font-medium text-muted">{label}</span>
      </div>
    </div>
  );
}
