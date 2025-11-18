/* ==========================================================
   DUSTDEEP — Interactive JS
   Smooth fade-in · Google Sheets Form · TikTok Grid
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const msg = document.getElementById("form-msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let valid = true;

        document.querySelectorAll(".field").forEach((field) => {
            const input = field.querySelector("input, textarea");
            const errorText = field.querySelector(".error-text");

            if (!input.value.trim()) {
                field.classList.add("error");
                input.classList.add("input-error");
                errorText.classList.add("visible");
                valid = false;
            } else {
                field.classList.remove("error");
                input.classList.remove("input-error");
                errorText.classList.remove("visible");
            }
        });

        if (!valid) return;

        // LOADING STATE
        document.querySelector(".btn-text").style.display = "none";
        document.querySelector(".loader").style.display = "block";

        const formData = {
            name: name.value.trim(),
            email: email.value.trim(),
            artist: artist.value.trim(),
            message: message.value.trim(),
        };

        try {
            const res = await fetch(
                "https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec",
                {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(formData)
                }
            );

            msg.textContent = "Message sent successfully!";
            msg.classList.add("success");

            form.reset();

        } catch (error) {
            msg.textContent = "Network error — try again.";
            msg.classList.add("error");
        }

        document.querySelector(".loader").style.display = "none";
        document.querySelector(".btn-text").style.display = "block";

        msg.style.opacity = 1;
        setTimeout(() => msg.style.opacity = 0, 3000);
    });
});

/* ---------------------------------------------
   2) Google Apps Script Submit
--------------------------------------------- */
function setupGoogleFormSubmit() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const artist = document.getElementById("artist");
    const message = document.getElementById("message");

    let valid = true;

    if (!name.value.trim()) {
      showError(name, "Please enter your name.");
      valid = false;
    }
    if (!email.value.trim() || !email.value.includes("@")) {
      showError(email, "Please enter a valid email.");
      valid = false;
    }
    if (!artist.value.trim()) {
      showError(artist, "Please specify your artist or label.");
      valid = false;
    }
    if (!message.value.trim()) {
      showError(message, "Please write a message.");
      valid = false;
    }

    if (!valid) return;

    // Submit to Apps Script
    msg.textContent = "Sending…";

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbw3wCAsTeSS7cM5Plxd8ufjzpdrkdRzNR4RJUP3fpKfB6uf1IYv9hL3ZEC987KLgOKoyw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            artist: artist.value,
            message: message.value
          })
        }
      );

      msg.textContent = "Message sent — thank you!";
      form.reset();

    } catch (err) {
      msg.textContent = "Network error — try again.";
    }
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
