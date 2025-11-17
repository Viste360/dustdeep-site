/* ==========================================================
   DUSTDEEP — Automated SoundCloud Engine + Contact System (V4)
   Ultra-optimized | Fade Motion | Gradient Theme Support
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  fadeSections();
  loadReleases();
  setupContactForm();
});

/* ----------------------------------------------------------
   SECTION FADE-IN + MOTION
---------------------------------------------------------- */
function fadeSections() {
  const observer = new IntersectionObserver(
    entries =>
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      }),
    { threshold: 0.15 }
  );

  document.querySelectorAll(".section").forEach(sec => observer.observe(sec));
}

/* ----------------------------------------------------------
   ARTIST FEEDS (SoundCloud RSS → Optimized Cards)
---------------------------------------------------------- */
const ARTISTS = {
  nyral: "https://soundcloud.com/nyralmusic",
  akasyon: "https://soundcloud.com/akasyonmusic",
  globasso: "https://soundcloud.com/globasso_dustdeep",
  kletron: "https://soundcloud.com/kletron"
};

async function loadReleases() {
  const all = [];

  for (const key in ARTISTS) {
    const feed = await fetchRSS(ARTISTS[key]);

    // Artist section
    populateGrid(`${key}Releases`, feed.slice(0, 4));

    // For global
    all.push(...feed);
  }

  // Newest first
  all.sort((a, b) => b.date - a.date);

  populateGrid("newReleasesGrid", all.slice(0, 12));
}

/* ----------------------------------------------------------
   RSS FETCH + FORMATTER
---------------------------------------------------------- */
async function fetchRSS(url) {
  const endpoint =
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      url + "/tracks"
    )}`;

  try {
    const data = await fetch(endpoint).then(r => r.json());
    if (!data.items) return [];

    return data.items.map(i => ({
      title: i.title,
      url: i.link,
      artwork:
        i.thumbnail?.replace("-t500x500", "-t300x300") ||
        "assets/default.jpg",
      date: new Date(i.pubDate)
    }));
  } catch (err) {
    console.error("RSS ERROR:", err);
    return [];
  }
}

/* ----------------------------------------------------------
   RELEASE GRID
---------------------------------------------------------- */
function populateGrid(id, tracks) {
  const el = document.getElementById(id);
  if (!el || !tracks.length) return;

  el.innerHTML = tracks
    .map(
      t => `
      <div class="release-card">
        <img src="${t.artwork}" alt="${t.title}">
        <div class="release-overlay">
          <h3>${t.title}</h3>
          <a href="${t.url}" target="_blank">Listen</a>
        </div>
      </div>`
    )
    .join("");
}

/* ----------------------------------------------------------
   CONTACT FORM — FORMSPREE ENDPOINT (LIVE)
---------------------------------------------------------- */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");

  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    msg.textContent = "Sending...";

    const data = {
      name: form.name.value,
      email: form.email.value,
      artist: form.artist.value,
      message: form.message.value
    };

    try {
      const res = await fetch("https://formspree.io/f/managdyj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        msg.textContent = "Message sent — we’ll be in touch.";
        form.reset();
      } else {
        msg.textContent = "Something went wrong.";
      }
    } catch {
      msg.textContent = "Network error. Try again.";
    }
  });
}
