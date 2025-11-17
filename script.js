/* ==========================================================
   DUSTDEEP — Minimal Interactive JS + Google Sheets API
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  fadeSections();
  setupContactForm();
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
   CONTACT FORM → GOOGLE SHEETS (Apps Script)
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
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec",
        {
          method: "POST",
          mode: "no-cors", 
          body: formData
        }
      );

      msg.textContent = "Thanks for reaching out — we’ll be in touch soon!";
      form.reset();

    } catch (err) {
      msg.textContent = "Something went wrong. Try again.";
      console.error(err);
    }
  });
}
