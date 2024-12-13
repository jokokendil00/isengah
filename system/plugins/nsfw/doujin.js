const axios = require('axios');
const cheerio = require('cheerio');

const doujin = {
    options: {
        search: async (text) => {
            try {
                const res = await axios.get(`https://doujins.com/searches?words=${encodeURIComponent(text)}`);
                const $ = cheerio.load(res.data);
                
                const results = [];
                $(".col-6.col-sm-4.col-md-3.col-lg-2").each((i, element) => {
                    const title = $(element).find('.title .text').text().trim();
                    const image = $(element).find('img').attr('src');
                    const artist = $(element).find('.single-line strong').eq(1).text().replace('Artist: ', '').trim();
                    const link = "https://doujins.com" + $(element).find('a').attr('href');
                    
                    results.push({ title, image, artist, link });
                });
                
                return results;
            } catch (error) {
                console.error("Error fetching data:", error.message);
                return [];
            }
        }
    }
};

module.exports = {
    command: "doujinsearch",
    alias: ["doujin"],
    category: ["nsfw"],
    settings: {
        group: true
    },
    description: "Find Doujinshi with detailed information",
    loading: true,
    async run(m, { text, sock }) {
        if (!text) {
            return m.reply("Masukkan Nama Nya Atau Reply Pesan untuk pencarian Doujin 🧐.");
        }
        
        let data = await doujin.options.search(text);
        
        if (data.length === 0) {
            return m.reply("😔 Tidak ditemukan hasil pencarian, coba lagi dengan kata kunci lain!");
        }
        
        let { title, image, artist, link } = data[0];
        
        let caption = `
🌟 *Title*: ${title}
🎨 *Artist*: ${artist}
🔗 *Link*: ${link}

Semoga pencarianmu menyenankan! 😊✨
        `;
        
        await sock.sendMessage(m.cht, { image: { url: image }, caption }, { quoted: m });
    }
};