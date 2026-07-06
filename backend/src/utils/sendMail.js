import { transporter } from "../configs/mail.js";

// Sender address, shared by both transports.
const fromAddress = () =>
  process.env.RESEND_FROM ||
  process.env.MAIL_FROM ||
  process.env.SMTP_FROM ||
  process.env.EMAIL_FROM ||
  process.env.SMTP_USER ||
  process.env.EMAIL_USER ||
  "onboarding@resend.dev";

// Resend HTTPS API (port 443) — works on hosts like Render that block outbound
// SMTP. Uses native fetch (Node 18+); no extra dependency.
const sendViaResend = async ({ to, subject, html, text }) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend API error ${res.status}: ${detail}`);
  }
  return res.json();
};

// SMTP transport (local dev / any host that allows outbound SMTP).
const sendViaSmtp = ({ to, subject, html, text }) =>
  transporter.sendMail({ from: fromAddress(), to, subject, text, html });

// Prefer Resend when configured (production/Render); otherwise fall back to SMTP.
export const sendMail = async ({ to, subject, html, text }) => {
  if (process.env.RESEND_API_KEY) {
    return sendViaResend({ to, subject, html, text });
  }
  return sendViaSmtp({ to, subject, html, text });
};
