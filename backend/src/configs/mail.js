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
