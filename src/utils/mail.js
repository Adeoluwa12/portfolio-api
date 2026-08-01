import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactNotification({ name, email, subject, body }) {
  return resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>", // swap for a verified sender domain later
    to: process.env.CONTACT_TO_EMAIL,
    reply_to: email,
    subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
    html: `
      <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(body).replace(/\n/g, "<br/>")}</p>
    `,
  });
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
