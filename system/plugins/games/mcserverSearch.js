const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  command: "searchservermc",
  alias: ["serversearch"],
  category: ["games"],
  settings: {
    limit: true
  },
  description: "Cari Server Minecraft!",
  loading: true,
  async run(m, { text, sock }) {
    if (!text) {
      return m.reply("❗ Masukkan Nama Server Atau Pencarian Kamu. Biar Di Proses...")
    }
    try {
      await m.reply("🔄 *Loading* Generating..")
      let data = await mcserverSearch(text)
      if (data.length === 0) {
        return m.reply("😞 Tidak Ada Server Yang Ditemukan. Coba Pencarian Lain!")
      }
      let ress = data[0];
      let cap = `
*🌟 Hasil Pencarian Server Minecraft:*

🖥️ *Nama Server:* ${ress.name}
🌍 *IP Server:* ${ress.ip}
📦 *Versi:* ${ress.version}
🎮 *Game Mode:* ${ress.gamemode}
🔰 *Tipe Server:* ${ress.type}
⚡ *Status:* ${ress.status}

🔗 Cek server lebih lanjut di situs Minecraft Buzz!
      `;
      m.reply(cap);
    } catch (error) {
      console.error(error);
      m.reply("❌ Terjadi kesalahan saat mencari server Minecraft. Coba lagi nanti.")
    }
  }
}

async function mcserverSearch(query) {
  try {
    const reds = await axios.get(`https://minecraft.buzz/search/${query}`);
    const $ = cheerio.load(reds.data);

    const servers = [];
    
    $('tr.server-row').each((i, element) => {
      const server = {};
      server.name = $(element).find('h3.fs-6').text().trim();
      server.ip = $(element).find('.ip-block').text().trim();
      server.version = $(element).find('span[data-bs-toggle="tooltip"]').first().text().trim();
      server.gamemode = $(element).find('a span[data-bs-toggle="tooltip"]').first().text().trim();
      server.type = $(element).find('span[data-bs-toggle="tooltip"]').last().text().trim();
      server.status = $(element).find('.badge.bg-warning').text().trim();

      servers.push(server);
    });

    return servers;
  } catch (error) {
    console.error('Error fetching Minecraft servers:', error);
    return [];
  }
}