/* ==========================================================
   DUSTDEEP — Minimal Final JS Package
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  fadeSections();
  setupContactForm();
  loadLatestTikTok(); // optional auto TikTok loader
});

/* ----------------------------------------------------------
   SECTION FADE-IN
---------------------------------------------------------- */
function fadeSections() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".section").forEach((sec) => observer.observe(sec));
}

/* ----------------------------------------------------------
   CONTACT FORM (FORMSPREE — FIXED)
---------------------------------------------------------- */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Sending...";

    const formData = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/managdj", {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        msg.textContent = "Thanks for reaching out — we’ll be in touch soon!";
        form.reset();
      } else {
        msg.textContent = "Something went wrong. Try again.";
      }
    } catch {
      msg.textContent = "Network error — try again.";
    }
  });
}

/* ----------------------------------------------------------
   AUTO TIKTOK EMBED (keeps your previous logic)
---------------------------------------------------------- */
async function loadLatestTikTok() {
  try {
    const res = await fetch("/api/latest-tiktok");
    const data = await res.json();

    if (!data.videoId) return;

    const embed = `
      <blockquote class="tiktok-embed"
        cite="https://www.tiktok.com/@dustdeepmusic/video/${data.videoId}"
        data-video-id="${data.videoId}">
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js"></script>
    `;

    document.getElementById("tiktok-wrapper").innerHTML = embed;
  } catch (e) {
    console.error("Failed to load TikTok:", e);
  }
}
