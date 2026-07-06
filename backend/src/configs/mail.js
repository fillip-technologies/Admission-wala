import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  // Force IPv4. On hosts without a working IPv6 route, Node resolves
  // smtp.gmail.com to an AAAA (IPv6) record first and the connection fails with
  // ENETUNREACH — the whole request then hangs on the SMTP timeout.
  family: 4,
  // Fail fast instead of leaving the request spinning if SMTP is unreachable.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

if (smtpUser && smtpPass) {
  transporter.verify((error) => {
    if (error) {
      console.error("Mail server connection failed:", error.message);
    } else {
      console.log("Mail server ready");
    }
  });
} else {
  console.warn("Mail server credentials missing. Set SMTP_USER and SMTP_PASS.");
}
