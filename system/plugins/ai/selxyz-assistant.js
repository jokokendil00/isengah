const axios = require("axios");

module.exports = {
   command: "selxyz",
   alias: ["sel"],
   category: ["ai"],
   settings: {
     limit: true,
     group: true
   },
   description: "Chat Dengan Ai Selxyzz-Assistant",
   loading: true,
   async run(m, { text }) {
     if (!text) {
       return m.reply("Masukkan Pertanyaan Kepada Selxyzz-Assistant")
     }
     try {
       let api = await axios.get(`https://apisanz.my.id/ai/selxyz-assistant?text=${text}`)
       let tes = api.data.data
       await m.reply(tes)
     } catch (e) {
       console.error(e.message)
       return m.reply("Gagal Saat Melajukan Generate Answer.")
     }
   }
};