// ============================================================
//  DUSTDEEP — Serverless SoundCloud Fetcher
// ============================================================

import Parser from "rss-parser";
const parser = new Parser();

const ARTISTS = {
  nyral: "https://soundcloud.com/nyralmusic",
  akasyon: "https://soundcloud.com/akasyonmusic",
  globasso: "https://soundcloud.com/globasso_dustdeep",
  kletron: "https://soundcloud.com/kletron",
  dustdeep: "https://soundcloud.com/dustdeep"
};

function rss(url) {
  return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    url + "/tracks"
  )}`;
}

function clean(item) {
  return {
    title: item.title,
    url: item.link,
    artwork:
      item.thumbnail?.replace("-t500x500", "-t300x300") ||
      item.enclosure?.link ||
      "/assets/default.jpg",
    date: new Date(item.pubDate || Date.now())
  };
}

function filterOriginals(items) {
  return items.filter(
    i =>
      !i.title.toLowerCase().includes("repost") &&
      !i.description?.toLowerCase().includes("repost")
  );
}

async function getArtist(key, url) {
  try {
    const feed = await parser.parseURL(rss(url));
    const original = filterOriginals(feed.items || []);
    return original.slice(0, 6).map(clean);
  } catch (e) {
    console.error("Error:", key, e);
    return [];
  }
}

export default async function handler(req, res) {
  const data = {};

  for (const [key, url] of Object.entries(ARTISTS)) {
    data[key] = await getArtist(key, url);
  }

  const all = [...data.nyral, ...data.akasyon, ...data.globasso, ...data.kletron]
    .sort((a, b) => b.date - a.date)
    .slice(0, 12);

  return res.status(200).json({ success: true, all, ...data });
}

