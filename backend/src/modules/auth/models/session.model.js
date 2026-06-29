import mongoose from "mongoose";

/**
 * One Session document == one logged-in device.
 * This is the backbone of multi-device login: a user can have many
 * sessions at once, each identified by a unique `jti` that is embedded
 * in that device's refresh token.
 *
 * We never store the raw refresh token — only a SHA-256 hash of it, so a
 * database leak can't be replayed as a valid token.
 */
const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Unique token id carried inside the refresh JWT. Looking a session up
    // by jti is how we know *which device* a refresh request came from.
    jti: {
      type: String,
      required: true,
      unique: true,
    },

    // SHA-256 hash of the issued refresh token (never the raw token).
    refreshTokenHash: {
      type: String,
      required: true,
    },

    ip: String,

    userAgent: String,

    // Updated on every successful refresh — lets you show "last active"
    // per device and pick the right session to evict.
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    // TTL index: Mongo auto-deletes the doc once this date passes.
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true },
);

export const Session = mongoose.model("Session", sessionSchema);
