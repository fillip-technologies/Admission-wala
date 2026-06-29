import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Session } from "../modules/auth/models/session.model.js";


const REFRESH_TOKEN_EXPIRES_IN =
  Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 30 * 24 * 60 * 60;


const MAX_DEVICES = Number(process.env.MAX_DEVICES) || 5;

const signRefreshToken = (userId, jti) => {
  return jwt.sign({ id: userId, jti }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

// Hash a token before it touches the DB. SHA-256 is enough here because the
// refresh token is already high-entropy (a signed JWT), unlike a password.
export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Enforce the per-user device cap. If the user is already at the limit,
 * delete their oldest (least-recently-used) sessions so room is freed for
 * `incoming` new ones.
 */
const evictExcessSessions = async (userId, incoming = 1) => {
  const active = await Session.countDocuments({ user: userId });
  const overflow = active + incoming - MAX_DEVICES;
  if (overflow <= 0) return;

  const stale = await Session.find({ user: userId })
    .sort({ lastUsedAt: 1 })
    .limit(overflow)
    .select("_id");

  await Session.deleteMany({ _id: { $in: stale.map((s) => s._id) } });
};

/**
 * Create a fresh session for a device login and return its refresh token.
 * meta: { userAgent, ip }
 */
export const createSession = async (user, meta = {}) => {
  await evictExcessSessions(user._id);

  const jti = crypto.randomUUID();
  const refreshToken = signRefreshToken(user._id, jti);

  const session = await Session.create({
    user: user._id,
    jti,
    refreshTokenHash: hashToken(refreshToken),
    userAgent: meta.userAgent,
    ip: meta.ip,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000),
  });

  return { refreshToken, jti, sessionId: session._id };
};

/**
 * Rotate a session's refresh token: issue a new token for the same device
 * (same session doc) and update its hash + sliding expiry. Returns the new
 * refresh token, or null if the session no longer exists.
 */
export const rotateSession = async (jti, userId, meta = {}) => {
  const refreshToken = signRefreshToken(userId, jti);

  const session = await Session.findOneAndUpdate(
    { jti, user: userId },
    {
      refreshTokenHash: hashToken(refreshToken),
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000),
      ...(meta.userAgent && { userAgent: meta.userAgent }),
      ...(meta.ip && { ip: meta.ip }),
    },
    { new: true },
  );

  return session ? { refreshToken, jti } : null;
};

// Revoke a single device (logout on one device).
export const revokeSession = (jti) => Session.deleteOne({ jti });

// Revoke every device for a user (logout everywhere).
export const revokeAllSessions = (userId) =>
  Session.deleteMany({ user: userId });
