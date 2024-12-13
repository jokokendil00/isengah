const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
   command: "akanenime",
   alias: ["animesearch"],
   category: ["anime"],
   settings: {
     limit: true
   },
   description: "Cari Anime Dengan AkaneNime",
   async run(m, { text, sock }) {
      try {
         await m.reply("🔍 *Mencari Anime...* 🕵️‍♂️");
         const results = await akane(text);
         if (results.length === 0) {
            m.reply("⚠️ *Anime tidak ditemukan!* ⚠️");
         } else {
            let response = "✨ *Hasil Pencarian Anime* ✨\n\n";
            for (const anime of results) {
               response += `🎬 *${anime.title}*\n`;
               response += `📅 *Status:* ${anime.status}\n`;
               response += `⭐ *Rating:* ${anime.rating}\n`;
               response += `📌 *Genre:* ${anime.genres}\n`;
               response += `🔗 *Link:* ${anime.url}\n`;
               response += `\-------------------------------------------------`;
               await sock.sendMessage(m.cht, { image: { url: anime.poster }, caption: response }, { quoted: m });
            }
         }
      } catch (err) {
         console.error('Error scraping:', err);
         m.reply("❌ **Terjadi kesalahan saat mencari anime!** ❌");
      }
   }
}

async function akane(anime) {
    const ress = await axios.get(`https://akane.my.id/search/${anime}`);
    const $ = cheerio.load(ress.data);
    const scriptData = $('script#__NEXT_DATA__').html();
    const jsonData = JSON.parse(scriptData);
    const animeResults = jsonData.props.pageProps.initialResults;

    const results = animeResults.map((animeItem) => ({
        title: animeItem.title,
        genres: animeItem.genres.map(genre => genre.name).join(', '),
        rating: animeItem.rating,
        status: animeItem.status,
        url: animeItem.url,
        poster: animeItem.poster
    }));

    return results;
}