const BASE_URL = 'https://api.mangadex.org';

async function debugFetch() {
  const title = "Berserk";
  const url = `${BASE_URL}/manga?title=${encodeURIComponent(title)}&limit=1&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
  console.log('Fetching:', url);
  const resp = await fetch(url);
  const data = await resp.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}

debugFetch();
