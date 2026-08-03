import { Router, type Request, type Response } from "express";
import { Resend } from "resend";
import { logger } from "../lib/logger";

const router = Router();

router.post("/contact", async (req: Request, res: Response) => {
  const { names, email, phone, location, weddingDate, venue } = req.body as {
    names?: string;
    email?: string;
    phone?: string;
    location?: string;
    weddingDate?: string;
    venue?: string;
  };

  if (!names || !email || !phone || !location || !weddingDate) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("RESEND_API_KEY not set — enquiry not emailed.");
    // Still return 200 so the user sees the thank-you screen
    res.json({ ok: true, warned: "email_not_configured" });
    return;
  }

  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; color: #3A342C; line-height: 1.7;">
      <h2 style="font-weight: normal; font-size: 22px; margin-bottom: 24px;">
        New enquiry — ${names}
      </h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; color: #888; width: 140px;">Names</td><td style="padding: 8px 0;">${names}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #3A342C;">${email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Location</td><td style="padding: 8px 0;">${location}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Wedding date</td><td style="padding: 8px 0;">${weddingDate}</td></tr>
        ${venue ? `<tr><td style="padding: 8px 0; color: #888;">Venue</td><td style="padding: 8px 0;">${venue}</td></tr>` : ""}
      </table>
      <hr style="border: none; border-top: 1px solid #e0ddd8; margin: 24px 0;" />
      <p style="font-size: 12px; color: #aaa;">Sent from evermortales.com</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Evermor Tales <enquiries@evermortales.com>",
      to: "hello@evermortales.com",
      replyTo: email,
      subject: `New enquiry — ${names}`,
      html,
    });
    logger.info({ names, email }, "Contact enquiry emailed.");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send contact email.");
    res.status(500).json({ error: "Failed to send email. Please try again." });
  }
});

export default router;
