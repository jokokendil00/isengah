const axios = require('axios');

module.exports = {
   command: "evrywhere",
   alias: ["every"],
   category: ["ai"],
   settings: {
     limit: true,
     group: true,
   },
   description: "Chat Dengan EveryWhere Ai",
   loading: true,
   async run(m, { text }) {
     if (!text) {
       return m.reply("Masukkan Pertanyaan Anda Kepada EveryWhere Ai")
     }
     try {
       let api = await axios.get(`https://apisanz.my.id/ai/everywhere?text=${text}`)
       const ss = api.data.data
       await m.reply(ss)
     } catch (e) {
       console.error(e.message)
       return m.reply("*Erorr Geenrating Response Form Api.")
     }
   }
};