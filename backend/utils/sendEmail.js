import { getTransporter, isMailConfigured } from "../config/mail.js";

/**
 * Sends an email if SMTP credentials are configured.
 * Silently skips (with a log) in dev environments without email set up,
 * so the rest of the request (e.g. member signup) still succeeds.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!isMailConfigured()) {
    console.warn(`[email skipped] EMAIL_USER/EMAIL_PASS not set. Would have sent "${subject}" to ${to}`);
    return { skipped: true };
  }

  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  return info;
};

export default sendEmail;
