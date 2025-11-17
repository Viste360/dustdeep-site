function setupContactForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Sending...";

    try {
      const formData = new FormData(form);

      const res = await fetch("https://formspree.io/f/managdj", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        msg.textContent = "Message sent — thank you.";
        form.reset();
      } else {
        msg.textContent = "Something went wrong. Try again.";
      }
    } catch (err) {
      msg.textContent = "Network error — try again.";
    }
  });
}
