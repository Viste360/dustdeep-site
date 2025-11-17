// ============================================================
//  DUSTDEEP — SoundCloud Serverless API (RSS → JSON)
// ============================================================

import Parser from "rss-parser";
const parser = new Parser();

// Artist SoundCloud pages
const ARTISTS = {
  nyral: "https://soundcloud.com/nyralmusic",
  akasyon: "https://soundcloud.com/akasyonmusic",
  globasso: "https://soundcloud.com/globasso_dustdeep",
  kletron: "https://soundcloud.com/kletron",
};

// Convert SoundCloud profile → RSS feed through proxy
const makeRSS = (url) =>
  `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    url + "/tracks"
  )}`;

// Clean/normalize tracks
function cleanTrack(item) {
  return {
    title: item.title || "Untitled",
    url: item.link,
    artist: extractArtist(item.title),
    artwork:
      item.thumbnail?.replace("-t500x500", "-t300x300") ||
      item.enclosure?.link ||
      "/assets/default.jpg",
    date: new Date(item.pubDate || Date.now()),
  };
}

// Extract artist from title "Nyral – Track Name"
function extractArtist(title = "") {
  if (!title.includes("-")) return "DustDeep Artist";
  return title.split("-")[0].trim();
}

// Fetch tracks for one artist
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

    // Combine → newest first
    const all = [
      ...results.nyral,
      ...results.akasyon,
      ...results.globasso,
      ...
