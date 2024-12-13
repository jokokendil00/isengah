const axios = require('axios');
const cheerio = require('cheerio');
const scdl = require('soundcloud-downloader').default;
const fs = require('fs');
const path = './soundcloud.mp3';

module.exports = {
  command: "soundcloud",
  alias: ["soundsearch"],
  category: ["downloader"],
  settings: { limit: true },
  description: "Cari Soundcloud Dan Download",
  async run(m, { text, sock }) {
    const scrapeSoundCloud = async (query) => {
      if (!query) {
        return m.reply("👤 Masukkan Query Pencarian");
      }
      try {
        const url = `https://m.soundcloud.com/search?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let results = [];
        $('.List_VerticalList__2uQYU li').each((_, element) => {
          const title = $(element).find('.Cell_CellLink__3yLVS').attr('aria-label');
          const musicUrl = 'https://m.soundcloud.com' + $(element).find('.Cell_CellLink__3yLVS').attr('href');
          if (title && musicUrl) results.push({ title, url: musicUrl });
        });
        return results.slice(0, 5);
      } catch {
        return [];
      }
    };

    const downloadSoundCloud = async (url) => {
      try {
        const stream = await scdl.download(url);
        const writeStream = fs.createWriteStream(path);
        stream.pipe(writeStream);

        return new Promise((resolve, reject) => {
          writeStream.on('finish', () => {
            const buffer = fs.readFileSync(path);
            fs.unlinkSync(path);
            resolve(buffer);
          });
          writeStream.on('error', (error) => {
            reject(error);
          });
        });
      } catch {
        return null;
      }
    };

    if (text.startsWith('--download')) {
      const url = text.replace('--download', '').trim();
      if (!url) return m.reply('⚠️ Masukkan URL SoundCloud setelah "--download".');
      const buffer = await downloadSoundCloud(url);
      if (!buffer) return m.reply('⚠️ Terjadi kesalahan saat mendownload audio.');

      await sock.sendMessage(
        m.cht,
        {
          audio: buffer,
          mimetype: 'audio/mpeg',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              mediaType: 1,
              mediaUrl: url,
              title: `⇆ㅤ ||◁ㅤ❚❚ㅤ▷||ㅤ ↻`,
              sourceUrl: url,
              thumbnailUrl: 'https://files.catbox.moe/9h8lxy.jpg',
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );
      return;
    }

    try {
      const searchResults = await scrapeSoundCloud(text);
      if (searchResults.length === 0) return m.reply('⚠️ Tidak ada hasil ditemukan.');

      const targetUrl = searchResults[0].url;
      await sock.sendMessage(m.cht, { react: { text: '🕜', key: m.key } });

      const buffer = await downloadSoundCloud(targetUrl);
      if (!buffer) return m.reply('⚠️ Terjadi kesalahan saat mendownload audio.');

      await sock.sendMessage(
        m.cht,
        {
          audio: buffer,
          mimetype: 'audio/mpeg',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              mediaType: 1,
              mediaUrl: targetUrl,
              title: `⇆ㅤ ||◁ㅤ❚❚ㅤ▷||ㅤ ↻`,
              sourceUrl: 'https://m.soundcloud.com',
              thumbnailUrl: 'https://files.catbox.moe/9h8lxy.jpg',
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );

      await sock.sendMessage(m.cht, { react: { text: '✅', key: m.key } });
    } catch {
      await sock.sendMessage(m.cht, { react: { text: '❌', key: m.key } });
      m.reply('⚠️ Terjadi kesalahan saat memproses permintaan.');
    }
  },
};