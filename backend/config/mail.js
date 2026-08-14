import nodemailer from "nodemailer";

let transporter = null;

export const isMailConfigured = () =>
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

export const getTransporter = () => {
  if (!isMailConfigured()) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
};

export default getTransporter;
