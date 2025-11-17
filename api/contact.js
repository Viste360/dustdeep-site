function setupContactForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Sending...";

    const formData = new FormData(form);

fetch("https://formspree.io/f/managdj", {
  method: "POST",
  body: formData
})
;

      if (res.ok) {
        msg.textContent = "Message sent — we’ll be in touch.";
        form.reset();
      } else {
        msg.textContent = "Something went wrong. Try again.";
      }
    } catch (err) {
      msg.textContent = "Network error — try again.";
    }
  });
}
