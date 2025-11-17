// ============================================================
//  DUSTDEEP — SoundCloud Serverless API (RSS → JSON)
// ============================================================

import Parser from "rss-parser";
const parser = new Parser();

// Artist SoundCloud homepages
const ARTISTS = {
  nyral: "https://soundcloud.com/nyralmusic",
  akasyon: "https://soundcloud.com/akasyonmusic",
  globasso: "https://soundcloud.com/globasso_dustdeep",
  kletron: "https://soundcloud.com/kletron",
  dustdeep: "https://soundcloud.com/dustdeep"
};

// Convert URL → RSS feed via rss2json
const makeRSS = (url) =>
  `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

// Clean track structure
function cleanTrack(item) {
  return {
    title: item.title?.trim() || "Untitled",
    url: item.link,
    artist:
      item.author ||
      (item.title?.split(" – ")[0] ?? "DustDeep Artist"),
    artwork:
      item.thumbnail?.replace("-t500x500", "-t300x300") ||
      item.enclosure?.link ||
      "/assets/default.jpg",
    date: new Date(item.pubDate)
  };
}

// Pull tracks for one artist
async function getArtistTracks(url) {
  try {
    const feed = await parser.parseURL(makeRSS(url));
    if (!feed.items) return [];
    return feed.items.map(cleanTrack);
  } catch (err) {
    console.error("Artist fetch failed:", err);
    return [];
  }
}

// Serverless handler
export default async function handler(req, res) {
  try {
    const results = {};

    // Fetch each artist
    for (const [key, url] of Object.entries(ARTISTS)) {
      results[key] = await getArtistTracks(url);
    }

    // Combine all tracks → sort newest
    const all = Object.values(results)
      .flat()
      .sort((a, b) => b.date - a.date)
      .slice(0, 12);

    // JSON-LD generation
    const jsonld = all.map((t) => ({
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: t.title,
      url: t.url,
      image: t.artwork,
      byArtist: {
        "@type": "MusicGroup",
        name: t.artist,
        url: "https://dustdeep.com/#artists"
      },
      inAlbum: {
        "@type": "MusicAlbum",
        name: "DustDeep Releases",
        url: "https://dustdeep.com/#new-releases"
      },
      publisher: {
        "@type": "Organization",
        name: "DustDeep"
      }
    }));

    res.status(200).json({
      success: true,
      nyral: results.nyral,
      akasyon: results.akasyon,
      globasso: results.globasso,
      kletron: results.kletron,
      dustdeep: results.dustdeep,
      all,
      jsonld
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
