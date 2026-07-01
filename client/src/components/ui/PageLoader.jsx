import Spinner from "./Spinner";

// Suspense fallback used inside layouts while a lazy page loads.
export default function PageLoader() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <Spinner className="h-7 w-7" />
    </div>
  );
}
