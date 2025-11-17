export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const response = await fetch("https://formspree.io/f/managdvj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    if (response.ok)
      return res.status(200).json({ success: true });

    return res.status(400).json({ success: false });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}

