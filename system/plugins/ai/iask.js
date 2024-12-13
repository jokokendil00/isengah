const axios = require('axios');

module.exports = {
  command: "iask",
  alias: ["eai", "aisk"],
  category: ["ai"],
  settings: {
    group: true
  },
  loading: true,
  description: "Chat Dengan Iask",
  async run(m, { text, Func }) {
    if (!text) {
      return m.reply('Masukkan Pertanyaan Anda')
    }
    try {
      let response = await axios.get(`https://apisanz.my.id/ai/iask?text=${text}`);
      let ans = response.data.data.answer;
      await m.reply(ans);
    } catch (e) {
      console.error(e.message);
      return m.reply("Ai Error");
    }
  }
}
