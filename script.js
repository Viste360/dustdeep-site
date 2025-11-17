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
ddocument.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Sending...";

    const payload = {
      name: form.name.value,
      email: form.email.value,
      artist: form.artist.value,
      message: form.message.value,
    };

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      msg.textContent = "Message sent — we’ll be in touch.";
      form.reset();
    } catch (error) {
      msg.textContent = "Network error — try again.";
    }
  });
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
