const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    command: "muslim-ai",
    alias: ["muslimai"],
    category: ["ai"],
    settings: {
        limit: true
    },
    description: "Cari Informasi Apapun Yang Relevan Dari Al-Qur'an",
    async run(m, { text }) {
        if (!text) {
            await m.react("⚠️");
            return m.reply("Masukkan atau Reply Pesan yang Ingin Dicari!");
        }

        try {
            await m.react("🔍");
            await sleep(1000);
            await m.reply("⏳ *Sedang Mencari Informasi yang Relevan... Mohon Tunggu!*");

            const api = await axios.get(`https://api.siputzx.my.id/api/ai/muslimai?query=${encodeURIComponent(text)}`);
            const response = api.data.data;

            await sleep(1500);
            await m.react("✅");
            await m.reply(response);
        } catch (error) {
            await m.react("❌");
            console.error(`Error Muslim-AI: ${error.message}`);
            return m.reply("❌ *Turbolensi Terjadi pada Server.*");
        }
    }
};
