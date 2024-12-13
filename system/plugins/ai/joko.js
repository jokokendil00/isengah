const axios = require('axios')

module.exports = {
  command: "joko",
  alias: ["jokoo"],
  category: ["ai"],
  settings: {
    group: true,
  },
  description: "Berbicara dengan Joko",
  loading: true,
  async run(m, { text, sock }) {
    if (!text) {
      return m.reply("Tidak ada pembicaraan yang ditemukan.");
    }

      try {
        const response = await axios.get("https://api.siputzx.my.id/api/ai/joko?content=" + text);
        const audioUrl = `https://api.siputzx.my.id/api/tools/tts?voice=jv-ID-DimasNeural&rate=0&pitch=0&volume=0&text=${response.data.data}`;
        await sock.sendMessage(m.cht, { mimetype: 'audio/mp4', audio: { url: audioUrl } }, { quoted: m });
      } catch (error) {
        m.reply("Terjadi kesalahan saat memproses permintaan.");
      }
    }
  }