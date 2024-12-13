const axios = require("axios");
const fs = require("fs");

module.exports = {
  command: "mediafire",
  alias: ["mediafiredl", "mfdl"],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Download Mediafire dengan cepat dan mudah",
  loading: true,
  async run(m, { sock, text }) {
    if (!text) return m.reply("⚠️ Harap masukkan URL Mediafire yang valid.");
    if (!text.includes("mediafire.com")) return m.reply("⚠️ URL tidak valid!");

    try {
      let api = await axios.get(`https://apisanz.my.id/download/mediafire?text=${text}`);
      let { name, filename, type, size, created, media: dl, link } = api.data.data;

      let buffer = Buffer.from((await axios.get(dl, { responseType: "arraybuffer" })).data, "binary");

      await sock.sendMessage(m.chat, {
        document: buffer,
        mimetype: type,
        fileName: filename || name,
        caption: `📁 *File berhasil diunduh!*\n\n🔹 *Nama*: ${name}\n🔹 *Ukuran*: ${size}\n🔹 *Tipe*: ${type}\n🔹 *Tanggal*: ${new Date(created).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}\n🔹 *Link*: ${link}`,
        contextInfo: {
          externalAdReply: {
            title: name,
            body: `Ukuran file: ${size}`,
            mediaType: 1,
            thumbnailUrl: "https://files.catbox.moe/ifru42.jpg",
            sourceUrl: link,
            renderLargerThumbnail: true,
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "20202020220@newsletter",
            newsletterName: "🌦 Devolution",
            serverMessageId: -1,
          },
        },
      });
    } catch (error) {
      console.error(error);
      m.reply("❌ Gagal mengunduh file. Pastikan URL valid dan coba lagi.");
    }
  },
};