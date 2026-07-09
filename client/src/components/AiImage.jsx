import { useState } from "react";

// An image slot for AI-generated artwork. Point `src` at a file you drop into
// client/public/img/ (e.g. src="/img/live-classes.png"). Until that file
// exists — or if it fails to load — a clean branded placeholder shows instead,
// so the layout never looks broken. `label` names what the image should show.
export default function AiImage({ src, alt = "", label = "Image", className = "", contain = false }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-ink to-ink-soft text-center ${className}`}
        role="img"
        aria-label={alt || label}
      >
        <div className="px-4">
          <svg className="mx-auto h-10 w-10 text-saffron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <p className="mt-2 text-xs font-semibold text-white/80">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable="false"
      onError={() => setFailed(true)}
      className={`select-none ${contain ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}
