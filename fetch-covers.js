const fs = require('fs');

const BASE_URL = 'https://api.mangadex.org';

const titles = [
  "Berserk", "Vagabond", "Vinland Saga", "Monster", "20th Century Boys",
  "One Piece", "Death Note", "Fullmetal Alchemist", "Attack on Titan",
  "Hunter x Hunter", "JoJo's Bizarre Adventure", "Slam Dunk", "Tokyo Ghoul",
  "Chainsaw Man", "Jujutsu Kaisen", "Akira", "Dorohedoro", "Gantz", "Claymore",
  "Dragon Ball", "Golden Kamuy", "Made in Abyss", "Parasyte", "Pluto",
  "BLAME!", "Mob Psycho 100", "One Punch Man", "Spy x Family", "Blue Lock",
  "Haikyuu!!", "Banana Fish", "Hellsing", "Lone Wolf and Cub",
  "Blade of the Immortal", "Goodnight Punpun", "The Promised Neverland",
  "Hell's Paradise", "Uzumaki", "Tomie"
];

async function getCoverUrl(title) {
  try {
    const params = new URLSearchParams({
      title,
      limit: '1',
      'includes[]': 'cover_art',
      'contentRating[]': ['safe', 'suggestive', 'erotica', 'pornographic']
    });
    const resp = await fetch(`${BASE_URL}/manga?${params}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.data?.[0]) {
        const manga = data.data[0];
        const mangaId = manga.id;
        const coverRel = manga.relationships.find(r => r.type === 'cover_art');
        if (coverRel && coverRel.attributes) {
            const fileName = coverRel.attributes.fileName;
            return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.512.jpg`;
        } else if (coverRel) {
            // Need to fetch cover details separately if not included or attributes missing
            const coverResp = await fetch(`${BASE_URL}/cover/${coverRel.id}`);
            if (coverResp.ok) {
                const coverData = await coverResp.json();
                const fileName = coverData.data.attributes.fileName;
                return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.512.jpg`;
            }
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error fetching cover for ${title}:`, error);
    return null;
  }
}

async function main() {
  const coverUrls = {};
  for (const title of titles) {
    console.log(`Fetching cover for ${title}...`);
    const url = await getCoverUrl(title);
    if (url) {
      coverUrls[title] = url;
    }
    await new Promise(r => setTimeout(r, 200)); // Rate limit
  }
  fs.writeFileSync('manga-covers.json', JSON.stringify(coverUrls, null, 2));
  console.log('Done! Saved to manga-covers.json');
}

main();
