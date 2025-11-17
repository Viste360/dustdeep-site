// ============================================================
//  DUSTDEEP CONTACT API — Email Forward (Serverless)
// ============================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, artist, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  // This would normally forward email via Resend / SendGrid
  console.log("New Contact:", { name, email, artist, message });

  return res.status(200).json({
    success: true,
    received: true
  });
}
