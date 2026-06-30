// Shared options for the refresh-token cookie. Use the same options when
// setting and clearing the cookie so the browser actually overwrites it.
//
// NOTE: this requires `cookie-parser` and CORS credentials to be enabled:
//   app.use(cookieParser());
//   app.use(cors({ origin: <client-url>, credentials: true }));
//   res.cookie("refreshToken", token, refreshCookieOptions);

const REFRESH_TOKEN_EXPIRES_IN =
  Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 15 * 24 * 60 * 60;

const isProd = process.env.NODE_ENV === "production";

;

export const cookieOptions = {
  httpOnly: true, 
  secure: isProd, // HTTPS-only in production
  sameSite: isProd ? "none" : "lax", // "none" needed for cross-site SPA + secure
  maxAge: REFRESH_TOKEN_EXPIRES_IN, 
  path: "/", // send on every route; narrow to /api/auth if you prefer
};
