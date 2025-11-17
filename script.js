/* ==========================================================
   DUSTDEEP V5 — Static Auto-Fetch SoundCloud Engine
   RSS → JSON → Auto-Populate Release Grids
   Formspree Contact API
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  fadeSections();
  loadAllReleases();
  setupContactForm();
});

/* ----------------------------------------------------------
   SECTION FADE-IN SYSTEM
---------------------------------------------------------- */
function fadeSections() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      }),
    { threshold: 0.15 }
  );

  document.querySelectorAll(".section").forEach((sec) => observer.observe(sec));
}

/* ----------------------------------------------------------
   SOUNDLOUD AUTO-FETCH SYSTEM (NO API KEY REQUIRED)
---------------------------------------------------------- */

const ARTISTS = {
  nyral: "https://soundcloud.com/nyralmusic",
  akasyon: "https://soundcloud.com/akasyonmusic",
  globasso: "https://soundcloud.com/globasso_dustdeep",
  kletron: "https://soundcloud.com/kletron",
  dustdeep: "https://soundcloud.com/dustdeep"
};

async function loadAllReleases() {
  try {
    const artistKeys = Object.keys(ARTISTS);
    const allTracks = [];

    for (const artist of artistKeys) {
      const feed = await fetchRSS(ARTISTS[artist]);

      // Fill individual artist sections (limit 4)
      const container = document.getElementById(`${artist}Releases`);
      if (container) {
        populateGrid(container, feed.slice(0, 4));
      }

      allTracks.push(...feed);
    }

    // GLOBAL NEW RELEASES SORTED BY DATE
    allTracks.sort((a, b) => b.date - a.date);

    const newestGrid = document.getElementById("newReleasesGrid");
    if (newestGrid) {
      populateGrid(newestGrid, allTracks.slice(0, 12));
    }
  } catch (err) {
    console.error("Error loading releases:", err);
  }
}

async function fetchRSS(url) {
  const rssURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    url + "/tracks"
  )}`;

  try {
    const data = await fetch(rssURL).then((r) => r.json());

    if (!data.items) return [];

    return data.items.map((i) => ({
      title: i.title || "Untitled Track",
      url: i.link,
      artwork:
        i.thumbnail?.replace("-t500x500", "-t300x300") ||
        i.enclosure?.link ||
        "assets/default.jpg",
      date: new Date(i.pubDate)
    }));
  } catch (err) {
    console.error("RSS error:", err);
    return [];
  }
}

/* ----------------------------------------------------------
   GRID POPULATION (Reusable)
---------------------------------------------------------- */
function populateGrid(el, tracks) {
  el.innerHTML = tracks
    .map(
      (t) => `
    <div class="release-card">
      <img src="${t.artwork}" alt="${t.title}">
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
   CONTACT FORM — FORMSPREE VERSION
---------------------------------------------------------- */

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "Sending...";

    const data = {
      name: form.name.value,
      email: form.email.value,
      artist: form.artist.value,
      message: form.message.value
    };

    try {
      const res = await fetch("https://formspree.io/f/managdj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

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
   function injectJSONLD(list) {
  list.forEach(item => {
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(item);
    document.head.appendChild(tag);
  });
}

(async function loadSchema() {
  try {
    const res = await fetch("/api/soundcloud");
    const data = await res.json();
    if (data.jsonld) injectJSONLD(data.jsonld);
  } catch (e) {
    console.error("Schema load failed:", e);
  }
})();
}
