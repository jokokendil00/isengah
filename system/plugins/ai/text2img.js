const axios = require("axios");

module.exports = {
  command: "text2img",
  alias: ["txt2img"],
  category: ["ai"],
  settings: {
    limit: true,
  },
  description: "✨ Buat gambar berdasarkan teks dengan bantuan AI",
  async run(m, { text, sock }) {
    if (!text) return m.reply("⚠️ Harap masukkan prompt teks untuk membuat gambar!");

    try {
      m.reply("⏳ Membuat gambar berdasarkan prompt...");

      let imageLink = await ains(text);

      await sock.sendMessage(m.cht, {
        image: { url: imageLink },
        caption: `✅ *Gambar berhasil dibuat!*\n\n🌟 *Prompt*: ${text}`,
        contextInfo: {
          externalAdReply: {
            title: "AI Image Generator",
            body: "Buat gambar dari teks dengan AI",
            mediaType: 1,
            thumbnailUrl: "https://pomf2.lain.la/f/8i0k0ll0.jpg",
            sourceUrl: "https://files.catbox.moe/9h8lxy.jpg",
            renderLargerThumbnail: true,
          },
        },
      });
    } catch (error) {
      console.error(error);
      m.reply("❌ Terjadi kesalahan saat membuat gambar. Coba lagi nanti.");
    }
  },
};

async function ains(prompt) {
  const apiEndpoint = "https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image";

  try {
    const response = await axios.get(apiEndpoint, {
      params: {
        prompt: prompt,
        aspect_ratio: "1:1",
        link: "",
      },
    });

    return response.data.image_link;
  } catch (error) {
    console.error("Error fetching AI image:", error);
    throw new Error("Gagal mendapatkan gambar dari AI.");
  }
}