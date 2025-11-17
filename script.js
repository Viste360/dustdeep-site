/* ==========================================================
   DUSTDEEP — Automated SoundCloud Engine + Contact System
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  fadeSections();
  loadReleases();
  setupContactForm();
});

/* ----------------------------------------------------------
   SECTION FADE-IN
---------------------------------------------------------- */
function fadeSections() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }),
    { threshold: 0.15 }
  );

  document.querySelectorAll(".section").forEach(sec => observer.observe(sec));
}

/* ----------------------------------------------------------
   SOUNDLOUD AUTO RELEASES (RSS → JSON → Grid)
---------------------------------------------------------- */

const ARTISTS = {
  nyral: "https://soundcloud.com/nyralmusic",
  akasyon: "https://soundcloud.com/akasyonmusic",
  globasso: "https://soundcloud.com/globasso_dustdeep",
  kletron: "https://soundcloud.com/kletron"
};

async function loadReleases() {
  for (const key in ARTISTS) {
    const feed = await fetchRSS(ARTISTS[key]);
    populateGrid(`${key}Releases`, feed.slice(0, 4));
  }

  // Merge all for "New Releases"
  const all = [];

  for (const key in ARTISTS) {
    const feed = await fetchRSS(ARTISTS[key]);
    all.push(...feed);
  }

  // Sort newest first
  all.sort((a, b) => b.date - a.date);

  populateGrid("newReleasesGrid", all.slice(0, 12));
}

async function fetchRSS(url) {
  const rssURL =
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url + "/tracks")}`;

  const data = await fetch(rssURL).then(r => r.json());
  if (!data.items) return [];

  return data.items.map(i => ({
    title: i.title,
    url: i.link,
    artwork: i.thumbnail?.replace("-t500x500", "-t300x300") || "assets/default.jpg",
    date: new Date(i.pubDate)
  }));
}

function populateGrid(id, tracks) {
  const el = document.getElementById(id);
  if (!el) return;

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
   CONTACT FORM — FORMSPREE ENDPOINT
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
      const res = await fetch("https://formspree.io/f/PLACEHOLDER", {
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
