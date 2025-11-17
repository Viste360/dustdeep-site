/* ==========================================================
   DUSTDEEP V4 — Automated SoundCloud Engine + Contact System
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  fadeSections();
  loadAllReleases();
  setupContactForm();
});

/* ----------------------------------------------------------
   SECTION FADE-IN
---------------------------------------------------------- */
function fadeSections() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".section").forEach(sec => observer.observe(sec));
}

/* ----------------------------------------------------------
   FETCH ALL RELEASES FROM VERCEL SERVERLESS FUNCTION
---------------------------------------------------------- */
async function loadAllReleases() {
  try {
    const res = await fetch("/api/soundcloud");
    const data = await res.json();

    if (!data || !data.success) return console.error("SC error:", data);

    // Global releases
    populateReleases("newReleasesGrid", data.all);

    // Per artist
    populateReleases("nyralReleases", data.nyral);
    populateReleases("akasyonReleases", data.akasyon);
    populateReleases("globassoReleases", data.globasso);
    populateReleases("kletronReleases", data.kletron);

  } catch (err) {
    console.error("Failed to load releases:", err);
  }
}

/* ----------------------------------------------------------
   POPULATE A RELEASE GRID
---------------------------------------------------------- */
function populateReleases(containerId, tracks) {
  const container = document.getElementById(containerId);
  if (!container || !tracks || !tracks.length) return;

  container.innerHTML = tracks
    .map(
      t => `
      <div class="release-card">
        <img src="${t.artwork}" alt="Artwork">
        <div class="release-overlay">
          <h3>${t.title}</h3>
          <a href="${t.url}" target="_blank">Listen</a>
        </div>
      </div>
    `
    )
    .join("");
}

/* ----------------------------------------------------------
   CONTACT FORM → GOOGLE SHEETS
---------------------------------------------------------- */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const formMsg = document.getElementById("form-msg");

    const payload = {
      name: form.name.value,
      email: form.email.value,
      artist: form.artist.value,
      message: form.message.value
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        formMsg.textContent = "Thanks — we'll be in touch soon.";
        form.reset();
      } else {
        formMsg.textContent = "Something went wrong. Try again later.";
      }
    } catch (error) {
      formMsg.textContent = "Network error — please try again.";
    }
  });
}
    const cleaned = tracks.map(t => ({
      title: t.title,
      link: t.link,
      thumbnail: getArtwork(t.thumbnail),
      date: new Date(t.pubDate)
    }));

    allTracks.push(...cleaned);
  }

  allTracks.sort((a, b) => b.date - a.date);

  const grid = document.getElementById("newReleasesGrid");
  if (grid) grid.innerHTML = allTracks.slice(0, 12).map(createCard).join("");
}

/* ==========================================
   Artist Sections (4 releases per artist)
========================================== */

async function loadArtistSections() {
  for (const key in artists) {
    const { username, target } = artists[key];
    const container = document.getElementById(target);
    if (!container) continue;

    const tracks = await fetchRSS(username);

    const cleaned = tracks.map(t => ({
      title: t.title,
      link: t.link,
      thumbnail: getArtwork(t.thumbnail)
    }));

    container.innerHTML = cleaned.slice(0, 4).map(createCard).join("");
  }
}

// ==========================================================
// CONTACT FORM → VERCEL API → GOOGLE SHEETS
// ==========================================================

const form = document.getElementById("contact-form");
const msgBox = document.getElementById("form-msg");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: form.name.value,
      email: form.email.value,
      artist: form.artist.value,
      message: form.message.value
    };

    msgBox.textContent = "Sending...";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        msgBox.textContent = "Message sent successfully!";
        form.reset();
      } else {
        msgBox.textContent = "Oops, something went wrong.";
      }
    } catch (err) {
      msgBox.textContent = "Error sending message.";
    }
  });
}
