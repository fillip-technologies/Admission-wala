import { useSearchParams } from "react-router-dom";

export default function Admission() {
  const [params] = useSearchParams();
  const course = params.get("course");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">My Admission</h1>
      <p className="mt-1 text-sm text-muted">
        {course ? `Starting admission for: ${course}` : "Start a new admission application."}
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
        Admission form goes here (board selection, course, document upload, tracking).
      </div>
    </div>
  );
}
