export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  // In the current setup we use Formspree directly from the front-end,
  // so this route is just a placeholder.
  return res.status(200).json({
    ok: true,
    message: "Contact API placeholder. Front-end posts to Formspree instead."
  });
}
