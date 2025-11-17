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

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec";

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    msg.textContent = "Sending…";
    msg.style.color = "#ffb347";

    const formData = new FormData(form);

    try {
      const res = await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      msg.textContent = "Message received — we'll be in touch.";
      msg.style.color = "#ffb347";
      form.reset();

    } catch (error) {
      msg.textContent = "Something went wrong — try again later.";
      msg.style.color = "#ff7050";
      console.error("Form error:", error);
    }
  });
}

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
