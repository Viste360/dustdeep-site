// ============================================================
//  DUSTDEEP — Contact Form → Google Sheets
//  Vercel Serverless Function
// ============================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { name, email, artist, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // ⭐ IMPORTANT: Replace with your real Google Script webhook URL
  const GOOGLE_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK;

  try {
    const scRes = await fetch(GOOGLE_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        artist,
        message
      })
    });

    const result = await scRes.json();

    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to submit"
    });
  }
}
