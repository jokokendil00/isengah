const axios = require('axios');

module.exports = {
   command: "videy",
   alias: ["pidey"],
   category: ["downloader"],
   settings: {
     limit: true
   },
   description: "Download Video Videy",
   loading: true,
   async run(m, { text, sock }) {
     let url = text || m.quoted;
     if (!url) {
       return m.reply("Tidak Ada Url Videy Yang Terdeteksi.")
     }
     try {
       let api = await axios.get(`https://apisanz.my.id/download/videy?url=${url}`)
       let validLink = api.data.download
       await sock.sendMessage(m.cht, { video: { url: validLink }, caption: api.data.message }, { quoted: m })
     } catch (e) {
       console.error(e.message)
       return m.reply("Gagal Mengunduh Video.")
     }
   }
}