/* ==========================================================
   DUSTDEEP — Minimal Interactive JS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
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
   CONTACT FORM — FORMSPREE
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
        body: formData
      });

      if (res.ok) {
        msg.textContent = "Message sent — we’ll be in touch.";
        form.reset();
      } else {
        msg.textContent = "Something went wrong. Try again.";
      }
    } catch {
      msg.textContent = "Network error — try again.";
    }
  });
}
