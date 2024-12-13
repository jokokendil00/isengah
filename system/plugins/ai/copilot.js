const axios = require('axios');

module.exports = {
    command: "copilot",
    alias: ["bing"],
    category: ["ai"],
    settings: {
        group: true
    },
    description: "Berinteraksi dengan Co-Pilot, asisten AI cerdas!",
    loading: true,
    async run(m, { text }) {
        try {
            if (!text) {
                return m.reply("⚠️ *Tidak ada pesan!* Harap berikan teks untuk didiskusikan dengan Co-Pilot.");
            }

            const response = await axios.get(`https://api.siputzx.my.id/api/ai/copilot?text=${text}`);
            let result = response.data.data;
            result = result.replace(/\^/g, "");
            await m.reply(result);
        } catch (error) {
            m.reply(`❌ *Terjadi kesalahan!* Tidak dapat menghubungi Co-Pilot:\n${error.message}`);
        }
    }
};