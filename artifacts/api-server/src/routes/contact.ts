import { Router, type Request, type Response } from "express";
import { Resend } from "resend";
import { db, enquiriesTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

function normaliseText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength || /[\u0000-\u001F\u007F]/.test(trimmed)) return null;
  return trimmed;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char] ?? char);
}

router.post("/contact", async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const names = normaliseText(body.names, 200);
  const email = normaliseText(body.email, 254);
  const phone = normaliseText(body.phone, 100);
  const location = normaliseText(body.location, 200);
  const weddingDate = normaliseText(body.weddingDate, 100);
  const venue = body.venue == null || body.venue === "" ? null : normaliseText(body.venue, 200);

  if (!names || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || !location || !weddingDate ||
      (body.venue != null && body.venue !== "" && !venue)) {
    res.status(400).json({ error: "Please provide valid enquiry details." });
    return;
  }

  try {
    await db.insert(enquiriesTable).values({
      names,
      email,
      phone,
      location,
      weddingDate,
      venue: venue || null,
    });
  } catch (err) {
    logger.error({ err }, "Failed to save contact enquiry.");
    res.status(500).json({ error: "Could not save your enquiry. Please try again." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("RESEND_API_KEY not set — enquiry not emailed.");
    res.json({ ok: true, warned: "email_not_configured" });
    return;
  }

  const resend = new Resend(apiKey);
  const safeNames = escapeHtml(names);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeLocation = escapeHtml(location);
  const safeWeddingDate = escapeHtml(weddingDate);
  const safeVenue = venue ? escapeHtml(venue) : null;

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; color: #3A342C; line-height: 1.7;">
      <h2 style="font-weight: normal; font-size: 22px; margin-bottom: 24px;">
        New enquiry — ${safeNames}
      </h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; color: #888; width: 140px;">Names</td><td style="padding: 8px 0;">${safeNames}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #3A342C;">${safeEmail}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${safePhone}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Location</td><td style="padding: 8px 0;">${safeLocation}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Wedding date</td><td style="padding: 8px 0;">${safeWeddingDate}</td></tr>
        ${safeVenue ? `<tr><td style="padding: 8px 0; color: #888;">Venue</td><td style="padding: 8px 0;">${safeVenue}</td></tr>` : ""}
      </table>
      <hr style="border: none; border-top: 1px solid #e0ddd8; margin: 24px 0;" />
      <p style="font-size: 12px; color: #aaa;">Sent from evermortales.com</p>
    </div>
  `;

  try {
    const { error: sendError } = await resend.emails.send({
      from: "Evermor Tales <enquiries@evermortales.com>",
      to: "hello@evermortales.com",
      replyTo: email,
      subject: `New enquiry — ${names}`,
      html,
    });

    if (sendError) {
      logger.error({ err: sendError }, "Failed to send contact email; enquiry is saved.");
      res.json({ ok: true, warned: "email_failed" });
      return;
    }
  } catch (err) {
    logger.error({ err }, "Failed to send contact email; enquiry is saved.");
    res.json({ ok: true, warned: "email_failed" });
    return;
  }

  logger.info({ names, email }, "Contact enquiry emailed.");
  res.json({ ok: true });
});

export default router;
