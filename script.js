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
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
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
  try {
    // Fetch all artist feeds in parallel
    const entries = Object.entries(ARTISTS);
    const feeds = await Promise.all(
      entries.map(([key, url]) => fetchRSS(url))
    );

    const allTracks = [];

    feeds.forEach((tracks, idx) => {
      const key = entries[idx][0];
      const containerId = `${key}Releases`;

      populateGrid(containerId, tracks.slice(0, 4));
      allTracks.push(...tracks);
    });

    // Global "New Releases" – newest first
    allTracks.sort((a, b) => b.date - a.date);
    populateGrid("newReleasesGrid", allTracks.slice(0, 12));
  } catch (err) {
    console.error("Error loading SoundCloud releases:", err);
  }
}

async function fetchRSS(url) {
  const rssURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    url + "/tracks"
  )}`;

  const res = await fetch(rssURL);
  if (!res.ok) {
    console.error("RSS request failed for", url);
    return [];
  }

  const data = await res.json();
  if (!data.items) return [];

  return data.items.map(item => ({
    title: item.title,
    url: item.link,
    artwork:
      item.thumbnail?.replace("-t500x500", "-t300x300") ||
      "assets/DustDeep.png",
    date: new Date(item.pubDate)
  }));
}

function populateGrid(id, tracks) {
  const el = document.getElementById(id);
  if (!el || !tracks || !tracks.length) return;

  el.innerHTML = tracks
    .map(
      t => `
      <div class="release-card">
        <img src="${t.artwork}" alt="${t.title}">
        <div class="release-overlay">
          <h3>${t.title}</h3>
          <a href="${t.url}" target="_blank" rel="noopener">Listen</a>
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
    if (msg) msg.textContent = "Sending...";

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
        if (msg) msg.textContent = "Message sent — we’ll be in touch.";
        form.reset();
      } else {
        if (msg) msg.textContent = "Something went wrong. Please try again.";
      }
    } catch (error) {
      console.error("Form submit error:", error);
      if (msg) msg.textContent = "Network error. Try again in a bit.";
    }
  });
}
