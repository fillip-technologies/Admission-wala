// Shared options for the refresh-token cookie. Use the same options when
// setting and clearing the cookie so the browser actually overwrites it.
//
// NOTE: this requires `cookie-parser` and CORS credentials to be enabled:
//   app.use(cookieParser());
//   app.use(cors({ origin: <client-url>, credentials: true }));
//   res.cookie("refreshToken", token, refreshCookieOptions);

// Accept a numeric seconds value from the env (e.g. 2592000). A JWT-style
// string like "30d" isn't a number, so we fall back to 30 days.
const REFRESH_TOKEN_EXPIRES_IN_SECONDS =
  Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 30 * 24 * 60 * 60;

const isProd = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd, // HTTPS-only in production
  sameSite: isProd ? "none" : "lax", // "none" needed for cross-site SPA + secure
  // Express expects maxAge in MILLISECONDS.
  maxAge: REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000,
  path: "/", // send on every route; narrow to /api/auth if you prefer
};
