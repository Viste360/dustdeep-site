// ============================================================
//  DUSTDEEP — SoundCloud Serverless API (RSS → JSON)
// ============================================================

import Parser from "rss-parser";

const parser = new Parser();

const ARTISTS = {
  nyral: "https://soundcloud.com/nyralmusic",
  akasyon: "https://soundcloud.com/akasyonmusic",
  globasso: "https://soundcloud.com/globasso_dustdeep",
  kletron: "https://soundcloud.com/kletron"
};

// Convert URL → RSS2JSON proxy
const makeRSS = (url) =>
  `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    url + "/tracks"
  )}`;

function cleanTrack(item) {
  return {
    title: item.title || "Untitled",
    url: item.link,
    artwork:
      item.thumbnail?.replace("-t500x500", "-t300x300") ||
      item.enclosure?.link ||
      "/assets/default.jpg",
    date: new Date(item.pubDate)
  };
}

async function getArtistTracks(url) {
  try {
    const feed = await parser.parseURL(makeRSS(url));

    if (!feed.items) return [];

    return feed.items.map(cleanTrack).slice(0, 4);
  } catch (err) {
    console.error("Artist fetch failed:", err);
    return [];
  }
}

export default async function handler(req, res) {
  try {
    const results = {};

    for (const [key, url] of Object.entries(ARTISTS)) {
      results[key] = await getArtistTracks(url);
    }

    // Combine all tracks → newest first
    const all = [
      ...results.nyral,
      ...results.akasyon,
      ...results.globasso,
      ...results.kletron
    ].sort((a, b) => b.date - a.date);

    res.status(200).json({
      success: true,
      all,
      ...results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
