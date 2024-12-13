const axios = require('axios');

module.exports = {
   command: "sandbox",
   alias: ["sand"],
   category: ["ai"],
   settings: {
     limit: true,
     group: true
   },
   description: "Chat Dengan Sanbox Ai",
   loading: true,
   async run(m, { text }) {
     if (!text) {
       return m.reply("Masukkan Pertanyaan Anda Kepada SanBox.")
     }
     try {
       let api = await axios.get(`https://apisanz.my.id/ai/sandbox?text=${text}`)
       let pesan = api.data.data;
       if (!pesan) {
         return m.reply("Tidak Ada Jawaban Dari Ai")
       }
       await m.reply(pesan)
     } catch (e) {
       console.error(e.message)
       return m.reply(`Gagal Saat Melakukan Generate Response`)
     }
   }
};