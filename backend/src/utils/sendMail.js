import { transporter } from "../configs/mail.js";

export const sendMail = async ({
  to,
  subject,
  html,
  text,
}) => {
  const info = await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      process.env.SMTP_USER ||
      process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  return info;
};
