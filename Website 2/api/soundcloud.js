// ============================================================
//  DUSTDEEP — Automated SoundCloud Fetcher
//  Vercel Serverless Function
// ============================================================

import Parser from "rss-parser";

const parser = new Parser();

/* ------------------------------------------------------------
   SOUNDLOUD ARTISTS — RSS FEEDS
------------------------------------------------------------ */
const ARTISTS = {
  nyral: "https://soundcloud.com/nyralmusic",
  akasyon: "https://soundcloud.com/akasyonmusic",
  globasso: "https://soundcloud.com/globasso_dustdeep",
  kletron: "https://soundcloud.com/kletron",
  dustdeep: "https://soundcloud.com/dustdeep"
};

// Convert to RSS URLs
function rss(url) {
  return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    url + "/tracks"
  )}`;
}

/* ------------------------------------------------------------
   CLEAN + FORMAT TRACK DATA
------------------------------------------------------------ */
function formatTrack(item) {
  return {
    title: item.title || "Untitled",
    url: item.link,
    artwork:
      item.thumbnail?.replace("-t500x500", "-t300x300") ||
      item.enclosure?.link ||
      "/assets/default-art.jpg"
  };
}

/* ------------------------------------------------------------
   FILTER REPOSTS (SoundCloud marks original uploads with "original_content")
------------------------------------------------------------ */
function filterOriginals(items) {
  return items.filter(
    i =>
      i.description &&
      !i.description.toLowerCase().includes("repost") &&
      !i.title.toLowerCase().includes("repost")
  );
}

/* ------------------------------------------------------------
   GET TRACKS FOR ONE ARTIST
------------------------------------------------------------ */
async function fetchArtist(name, url) {
  try {
    const feed = await parser.parseURL(rss(url));

    const originals = filterOriginals(feed.items || []);

    const tracks = originals.slice(0, 4).map(formatTrack);

    return tracks;
  } catch (err) {
    console.error("Error fetching", name, err);
    return [];
  }
}

/* ------------------------------------------------------------
   SERVERLESS HANDLER
------------------------------------------------------------ */
export default async function handler(req, res) {
  try {
    const results = {};

    // Fetch all artist tracks
    for (const [key, url] of Object.entries(ARTISTS)) {
      results[key] = await fetchArtist(key, url);
    }

    // Global combined list
    const all = [
      ...results.nyral,
      ...results.akasyon,
      ...results.globasso,
      ...results.kletron
    ]
      .sort((a, b) => (a.date > b.date ? -1 : 1))
      .slice(0, 12);

    return res.status(200).json({
      success: true,
      all,
      nyral: results.nyral,
      akasyon: results.akasyon,
      globasso: results.globasso,
      kletron: results.kletron
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
