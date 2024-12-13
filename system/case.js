const util = require("util");
const config = require("../settings.js");
const { exec } = require("child_process");
const fs = require("node:fs");
const axios = require("axios");
const Func = require("../lib/function");
const { writeExif } = require("../lib/sticker");
const { catbox } = require("../lib/uploader");

module.exports = async (m, sock, store) => {
    const isCommand = m.prefix && m.body.startsWith(m.prefix);
    const quoted = m.isQuoted ? m.quoted : m;
    const scrape = await scraper.list();
    const text = m.isQuoted ? m.quoted.body : m.text;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    switch (isCommand ? m.command.toLowerCase() : false) {
        case "sticker":
        case "s": {
            try {
                if (/image|video|webp/.test(quoted.msg?.mimetype)) {
                    let media = await quoted.download();
                    if (quoted.msg?.seconds > 10) throw "> Video di atas durasi 10 detik tidak bisa";

                    let exif = m.text
                        ? { packName: m.text.split("|")[0] || "", packPublish: m.text.split("|")[1] || "" }
                        : { packName: config.sticker.packname, packPublish: m.pushName };

                    let sticker = await writeExif({ mimetype: quoted.msg.mimetype, data: media }, exif);
                    await sock.sendMessage(m.cht, { sticker }, { quoted: m });
                } else {
                    m.reply("> Reply foto atau video yang ingin dijadikan stiker");
                }
            } catch (error) {
                m.reply(`Terjadi kesalahan: ${error.message}`);
            }
            break;
        }

        case "smeme": {
            try {
                if (!/image/.test(quoted.msg?.mimetype)) {
                    return m.reply(`Kirim/kutip gambar dengan caption ${m.prefix + m.command} San|Abc`);
                }

                let atas = text.split("|")[0] || "-";
                let bawah = text.split("|")[1] || "-";

                let media = await quoted.download();
                let url = await catbox(media); // Menggunakan uploader

                // Buat URL meme
                let smemeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${url}`;

                // Convert ke stiker
                let sticker = await writeExif(
                    { mimetype: "image/png", data: await axios.get(smemeUrl, { responseType: "arraybuffer" }).then((res) => res.data) },
                    { packName: config.sticker.packname, packPublish: config.sticker.author }
                );

                await sock.sendMessage(m.chat, { sticker }, { quoted: m });
            } catch (error) {
                m.reply(`Gagal membuat meme: ${error.message}`);
            }
            break;
        }

 case 'wm':
case 'swm': {
    try {
        if (!m.quoted) {
            return m.reply(`Kirim/kutip stiker atau media lalu ketik ${m.prefix + m.command} San|Abc`);
        }

        let packname = text.split('|')[0]?.trim() || config.sticker.packname;
        let author = text.split('|')[1]?.trim() || config.sticker.author;

        await sock.sendMessage(m.cht, { react: { text: "🔎", key: m.key } });

        if (/image|video|webp/.test(quoted.msg?.mimetype)) {
            let media = await quoted.download();

            // Validasi durasi untuk video
            if (/video/.test(quoted.msg?.mimetype) && quoted.msg?.seconds > 25) {
                return m.reply('Maksimal durasi video adalah 25 detik!');
            }

            // Membuat stiker dengan watermark
            let sticker = await writeExif(
                { mimetype: quoted.msg.mimetype, data: media },
                { packName: packname, packPublish: author }
            );

            if (sticker) {
                await sock.sendMessage(m.cht, { sticker }, { quoted: m });
            } else {
                m.reply('Gagal membuat stiker dengan watermark.');
            }
        } else {
            m.reply(`Kirim/kutip stiker, foto, atau video lalu ketik ${m.prefix + m.command} San|Abc`);
        }
    } catch (error) {
        m.reply(`Terjadi kesalahan: ${error.message}`);
    }
}
break;
case "ssearch": {
const axios = require("axios");
const cheerio = require("cheerio");

class Sticker {
  constructor(stickerPackName, url = null) {
    this.sticker = stickerPackName;
    this.BASE_URL = "https://getstickerpack.com/stickers?query=" + this.sticker;
    this.url = url;
  }

  async search() {
    try {
      const { data: html } = await axios.get(this.BASE_URL);
      const $ = cheerio.load(html);
      const stickerPacks = [];

      $(".sticker-pack-cols").each((i, el) => {
        const packUrl = $(el).find("a").attr("href");
        const trayImage = $(el).find("img").attr("src");
        const username = $(el).find(".username").text();
        const title = $(el).find(".title").text();

        stickerPacks.push({ packUrl, trayImage, username, title });
      });

      return stickerPacks;
    } catch (error) {
      console.error("Error fetching stickers:", error);
      return [];
    }
  }
  async download() {
    try {
      const { data: hl } = await axios.get(this.url);
      const $ = cheerio.load(hl);
      const stickers = [];

      $(".sticker-image").each((i, el) => {
        const stickerImage = $(el).attr("data-src-large");
        stickers.push(stickerImage);
      });

      return stickers;
    } catch (error) {
      console.error("Error downloading stickers:", error);
    }
  }
}
  try {
    if (m.text) {
      const stickerName = m.text.trim();
      const data = new Sticker(stickerName);
      const results = await data.search();

      if (results && results.length > 0) {
        let message = "Stiker ditemukan, pilih pack yang ingin diunduh:\n\n";
        results.forEach((result, index) => {
          message += `${index + 1}. *${result.title}* oleh ${result.username}\n`;
          message += `Preview: ${result.trayImage}\n`;
          message += `Pack Url: ${result.packUrl}\n\n`
        });

        m.reply(message);
      } else {
        m.reply("Tidak ditemukan stiker dengan kata kunci tersebut.");
      }
    } else {
      m.reply("Masukkan kata kunci untuk mencari stiker.");
    }
  } catch (error) {
    m.reply(`Terjadi kesalahan: ${error.message}`);
  }
  break;
}       
case "download_sticker":
case "ds": {
const axios = require("axios");
const cheerio = require("cheerio");

class Sticker {
  constructor(stickerPackName, url = null) {
    this.sticker = stickerPackName;
    this.BASE_URL = "https://getstickerpack.com/stickers?query=" + this.sticker;
    this.url = url;
  }

  async search() {
    try {
      const { data: html } = await axios.get(this.BASE_URL);
      const $ = cheerio.load(html);
      const stickerPacks = [];

      $(".sticker-pack-cols").each((i, el) => {
        const packUrl = $(el).find("a").attr("href");
        const trayImage = $(el).find("img").attr("src");
        const username = $(el).find(".username").text();
        const title = $(el).find(".title").text();

        stickerPacks.push({ packUrl, trayImage, username, title });
      });

      return stickerPacks;
    } catch (error) {
      console.error("Error fetching stickers:", error);
      return [];
    }
  }

  async download() {
    const { data: html } = await axios.get(this.url);
    const $ = cheerio.load(html);
    const imageUrls = [];

    $(".sticker-image").each((i, el) => {
      const imageUrl = $(el).attr("data-src-large");
      imageUrls.push(imageUrl);
    });

    return imageUrls;
  }
}
    m.react("🕖 ") 
  try {
    if (m.text) {
      const stickerUrl = m.text.trim();
      const data = new Sticker("", stickerUrl);
      const imageUrls = await data.download();
      await m.reply("*Semua Sticker Di Kirim Lewat Private Untuk Mengindari Spam.*") 
        
      if (imageUrls && imageUrls.length > 0) {
        for (const imageUrl of imageUrls) {
          const media = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(media.data, 'binary');
          let exif = { packName: "Devolution", packPublish: m.pushName };

          let sticker = await writeExif({ mimetype: 'image/png', data: buffer }, exif);
          await sock.sendMessage(m.sender, { sticker }, { quoted: m });
        }
        m.reply("Semua stiker berhasil diunduh dan dikirim.");
      } else {
        m.reply("Tidak ada gambar ditemukan untuk stiker.");
      }
    } else {
      m.reply("Masukkan URL untuk mengunduh stiker.");
    }
  } catch (error) {
    m.reply(`Terjadi kesalahan: ${error.message}`);
  }
  break;
}
        case "brat": {
            try {
                let input = m.isQuoted ? m.quoted.body : m.text;
                if (!input) return m.reply("> Reply/Masukan pesan");

                m.reply(config.messages.wait);
                let media = await scrape.brat(input);
                let sticker = await writeExif(
                    { mimetype: "image", data: media },
                    { packName: config.sticker.packname, packPublish: config.sticker.author }
                );

                await sock.sendMessage(m.cht, { sticker }, { quoted: m });
            } catch (error) {
                m.reply(`Gagal membuat stiker BRAT: ${error.message}`);
            }
            break;
        }

        default:
            // Eval command untuk owner

            // Exec command untuk owner
            if (["exec", "$"].includes(m.command.toLowerCase()) && m.isOwner) {
                try {
                    exec(m.text, (err, stdout) => {
                        if (err) return m.reply(util.format(err));
                        m.reply(util.format(stdout));
                    });
                } catch (error) {
                    m.reply(util.format(error));
                }
            }
    }
};

// Auto reload file
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    delete require.cache[file];
    console.log(`File ${file} telah diperbarui`);
});