/* ==========================================================
   DUSTDEEP — INTERACTIVE JS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  fadeSections();
  setupGoogleSheetsForm();
});

/* ----------------------------------------------------------
   SECTION FADE-IN
---------------------------------------------------------- */
function fadeSections() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".section").forEach(sec => observer.observe(sec));
}

/* ----------------------------------------------------------
   CONTACT FORM — GOOGLE SHEETS API
---------------------------------------------------------- */
function setupGoogleSheetsForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");

  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    msg.textContent = "Sending…";

    const formData = new FormData(form);

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: formData
        }
      );

      msg.textContent = "Message received — we’ll be in touch!";
      form.reset();

    } catch (err) {
      msg.textContent = "Error — try again later.";
      console.error("Form error:", err);
    }
  });
}

/* ----------------------------------------------------------
   FORCE TIKTOK RELOAD (fixes Safari/Chrome embed bug)
---------------------------------------------------------- */
window.addEventListener("load", () => {
  if (window.tiktokEmbedLoaded) return;
  window.tiktokEmbedLoaded = true;

  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  document.body.appendChild(script);
});
