import bcrypt from "bcrypt";
import { Otp } from "../modules/auth/models/otp.model.js";

const OTP_TTL_MINUTES = Number(process.env.OTP_EXP_MINUTES) || 10;
const MAX_ATTEMPTS = 5;

// 6-digit numeric OTP returned as a string (keeps any leading zeros).
export const genrateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// Create and store a fresh OTP for an email + purpose, invalidating any prior one.
// Returns the plaintext OTP so the caller can email it.
export const issueOtp = async ({ email, purpose }) => {
  const otp = genrateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ email, purpose });
  await Otp.create({
    email,
    otpHash,
    purpose,
    expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
  });

  return otp;
};

// Verify a submitted OTP. Consumes it on success (one-time use).
// Returns { ok: boolean, reason?: string }.
export const verifyOtp = async ({ email, otp, purpose }) => {
  const record = await Otp.findOne({ email, purpose });
  if (!record) return { ok: false, reason: "OTP not found. Please request a new one." };

  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return { ok: false, reason: "OTP has expired. Please request a new one." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await record.deleteOne();
    return { ok: false, reason: "Too many attempts. Please request a new OTP." };
  }

  const match = await bcrypt.compare(String(otp), record.otpHash);
  if (!match) {
    record.attempts += 1;
    await record.save();
    return { ok: false, reason: "Invalid OTP" };
  }

  await record.deleteOne();
  return { ok: true };
};
