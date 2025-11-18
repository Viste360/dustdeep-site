/* ==========================================================
   DUSTDEEP — Interactive JS
   Animated Validation · Google Sheets Form · TikTok Embed
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initForm();
  loadTikTokFeed();
});

/* ----------------------------------------------------------
   CONTACT FORM — VALIDATION + GOOGLE SHEETS SUBMIT
---------------------------------------------------------- */

function initForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");
  const submitBtn = document.querySelector(".form-btn");
  const btnText = document.querySelector(".btn-text");
  const loader = document.querySelector(".loader");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid = validateForm(form);
    if (!isValid) return;

    // Loading state
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
      msg.classList.remove("error");
      msg.classList.add("success");
      msg.style.opacity = 1;

      form.reset();

    } catch (err) {
      msg.textContent = "Network error — try again.";
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.style.opacity = 1;
    }

    loader.style.display = "none";
    btnText.style.display = "block";

    setTimeout(() => { msg.style.opacity = 0; }, 3500);
  });
}

/* ----------------------------------------------------------
   VALIDATION (Animated + Shake)
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

    if (input.hasAttribute("required") && !input.value.trim()) {
      error = true;
    }

    if (input.type === "email") {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (!emailValid) error = true;
    }

    if (error) {
      field.classList.add("error");
      input.classList.add("input-error");
      errorText.classList.add("visible");

      // Trigger shake animation
      input.style.animation = "shake 0.25s";
      setTimeout(() => (input.style.animation = ""), 300);

      valid = false;
    }
  });

  return valid;
}

/* -------------------------------
   TIKTOK CREATOR FEED LOADER
--------------------------------- */

function loadTikTokFeed() {
    const embed = document.querySelector(".tiktok-embed");

    if (!embed) return;

    // Prevent duplicate script loads
    if (!window.tiktokScriptLoaded) {
        const s = document.createElement("script");
        s.src = "https://www.tiktok.com/embed.js";
        s.async = true;
        document.body.appendChild(s);

        window.tiktokScriptLoaded = true;
    }
}

document.addEventListener("DOMContentLoaded", loadTikTokFeed);
}
