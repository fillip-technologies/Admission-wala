import logo from "../assets/logo.png";

// The Shree Admission Gurukul brand mark. The image already contains the full
// wordmark, so callers just size it via `className` (height is what matters —
// width stays auto to keep the aspect ratio). Kept in one place so the logo can
// be swapped everywhere from a single import.
export default function Logo({ className = "h-10 w-auto" }) {
  return (
    <img
      src={logo}
      alt="Shree Admission Gurukul"
      className={`${className} object-contain`}
    />
  );
}
