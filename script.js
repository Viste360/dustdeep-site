/* ==========================================================
   DUSTDEEP — Interactive JS
   Smooth fade-in · Google Sheets Form · TikTok Grid
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formTime").value = Date.now();
  setupForm();
});

/* ----------------------------------------------------------
   FORM HANDLING + VALIDATION + SPAM PROTECTION
---------------------------------------------------------- */
function setupForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");
  const btn = form.querySelector(".form-btn");
  const btnText = btn.querySelector(".btn-text");
  const loader = btn.querySelector(".loader");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm(form)) return;

    // UI loading
    btnText.style.display = "none";
    loader.style.display = "block";

    const formData = new FormData(form);
    const json = Object.fromEntries(formData.entries());

    // Add timestamp for bot detection
    json.loadTime = document.getElementById("formTime").value;

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec", {
        method: "POST",
        body: JSON.stringify(json),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (data.success) {
        msg.textContent = "Message sent — we’ll be in touch.";
        msg.className = "success";
        form.reset();
        document.getElementById("formTime").value = Date.now();
      } else {
        msg.textContent = data.error || "Something went wrong.";
        msg.className = "error";
      }
    } catch (error) {
      msg.textContent = "Network error — try again.";
      msg.className = "error";
    }

    // Reset button
    btnText.style.display = "inline";
    loader.style.display = "none";
  });
}

/* ----------------------------------------------------------
   VALIDATION
---------------------------------------------------------- */
function validateForm(form) {
  let valid = true;

  form.querySelectorAll(".field").forEach((field) => {
    const input = field.querySelector("input, textarea");

    field.classList.remove("error");

    if (input.hasAttribute("required") && !input.value.trim()) {
      field.classList.add("error");
      valid = false;
    }

    if (input.type === "email") {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      if (!emailValid) {
        field.classList.add("error");
        valid = false;
      }
    }

    if (input.name === "message" && input.value.trim().length < 10) {
      field.classList.add("error");
      valid = false;
    }
  });

  return valid;
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
