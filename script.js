/* ==========================================================
   DUSTDEEP — Interactive JS
   Validation · Anti-Spam · Preloader · Scroll FX · TikTok
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initForm();
  loadTikTokFeed();
  fadeInOnScroll();
  initNavHighlight();
  startPreloader();
});

/* ----------------------------------------------------------
   PRELOADER
---------------------------------------------------------- */

function startPreloader() {
  const pre = document.getElementById("preloader");
  if (!pre) return;

  setTimeout(() => {
    pre.style.opacity = 0;
    pre.style.pointerEvents = "none";
  }, 600);
}

/* ----------------------------------------------------------
   NAV — AUTO ACTIVE SECTION HIGHLIGHT
---------------------------------------------------------- */

function initNavHighlight() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  function updateHighlight() {
    let current = "";

    sections.forEach((sec) => {
      const top = sec.offsetTop - 150;
      if (scrollY >= top) current = sec.id;
    });

    navLinks.forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href") === "#" + current) {
        a.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateHighlight);
  updateHighlight();
}

/* ----------------------------------------------------------
   FADE-IN ON SCROLL
---------------------------------------------------------- */

function fadeInOnScroll() {
  const elements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ----------------------------------------------------------
   CONTACT FORM — VALIDATION + GOOGLE SHEETS
---------------------------------------------------------- */

function initForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const msg = document.getElementById("form-msg");
  const btnText = document.querySelector(".btn-text");
  const loader = document.querySelector(".loader");

  // Anti-spam timestamp
  form.dataset.start = Date.now();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot
    if (form.website.value !== "") {
      console.warn("Bot blocked (honeypot)");
      return;
    }

    // Too-fast submission (<1.5s)
    if (Date.now() - parseInt(form.dataset.start) < 1500) {
      console.warn("Bot blocked (too fast)");
      return;
    }

    // Lock to prevent burst spam
    if (form.classList.contains("locked")) return;
    form.classList.add("locked");

    const isValid = validateForm(form);
    if (!isValid) return;

    // Loading UI
    btnText.style.display = "none";
    loader.style.display = "block";

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      artist: form.artist.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      msg.textContent = "Message sent — we’ll be in touch.";
      msg.className = "success";
      msg.style.opacity = 1;
      form.reset();
    } catch {
      msg.textContent = "Network error — try again.";
      msg.className = "error";
      msg.style.opacity = 1;
    }

    loader.style.display = "none";
    btnText.style.display = "block";

    setTimeout(() => (msg.style.opacity = 0), 3500);

    // Unlock after 3s
    setTimeout(() => form.classList.remove("locked"), 3000);
  });
}

/* ----------------------------------------------------------
   VALIDATION
---------------------------------------------------------- */

function validateForm(form) {
  let valid = true;

  form.querySelectorAll(".field").forEach((field) => {
    const input = field.querySelector("input, textarea");
    const errorText = field.querySelector(".error-text");

    field.classList.remove("error");
    input.classList.remove("input-error");
    errorText.classList.remove("visible");

    let error = false;

    if (input.hasAttribute("required") && !input.value.trim()) error = true;

    if (input.type === "email") {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (!emailValid) error = true;
    }

    if (error) {
      field.classList.add("error");
      input.classList.add("input-error");
      errorText.classList.add("visible");

      input.style.animation = "shake 0.25s";
      setTimeout(() => (input.style.animation = ""), 300);

      valid = false;
    }
  });

  return valid;
}

/* ----------------------------------------------------------
   TIKTOK FEED
---------------------------------------------------------- */

function loadTikTokFeed() {
  const embed = document.querySelector(".tiktok-embed");
  if (!embed) return;

  if (!window.tiktokLoaded) {
    const s = document.createElement("script");
    s.src = "https://www.tiktok.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
    window.tiktokLoaded = true;
  }
}
