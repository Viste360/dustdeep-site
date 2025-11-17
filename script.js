/* ==========================================================
   DUSTDEEP — Interactive JS
   Smooth fade-in · Google Sheets Form · TikTok Grid
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  fadeSections();
  setupContactForm();
});

/* ----------------------------------------------------------
   SECTION FADE-IN ANIMATION
---------------------------------------------------------- */
function fadeSections() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".section").forEach(section => {
    observer.observe(section);
  });
}

/* ----------------------------------------------------------
   CONTACT FORM → GOOGLE SHEETS API
---------------------------------------------------------- */

// FORM → GOOGLE SHEETS
document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const msg = document.getElementById("form-msg");
  msg.textContent = "Sending…";

  const formData = new FormData(e.target);

  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec",
      { method: "POST", body: formData }
    );

    const text = await res.text();
    if (text.includes("Success")) {
      msg.textContent = "Message sent — we’ll be in touch soon!";
      e.target.reset();
    } else {
      msg.textContent = "Error — try again.";
    }
  } catch (err) {
    msg.textContent = "Network error — try again.";
  }
});

/* ----------------------------------------------------------
   TIKTOK PROFILE FEED (AUTO-EMBED)
---------------------------------------------------------- */

function loadTikTokFeed() {
  const wrapper = document.getElementById("tiktok-wrapper");
  if (!wrapper) return;

  wrapper.innerHTML = `
    <blockquote class="tiktok-embed"
      cite="https://www.tiktok.com/@dustdeepmusic"
      data-unique-id="dustdeepmusic"
      data-embed-type="creator"
      style="max-width: 780px; margin: auto;">
      <section>Loading TikTok…</section>
    </blockquote>
    <script async src="https://www.tiktok.com/embed.js"></script>
  `;
}

loadTikTokFeed();
