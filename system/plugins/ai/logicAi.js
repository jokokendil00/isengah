const Selxyzz = require('selxyz-assistant');

module.exports = {
    command: "logic",
    alias: ["aiLogic"],
    category: ["ai"],
    description: "Chat Dengan Ai Paling Seru!",
    loading: true,
    settings: {
        limit: true
    },
    async run(m, { Func, sock, text }) {
        if (!text) {
            return m.reply(`Tidak Ada Pertanyaan, Perintah Di Batalkan`)
            }
        try {
            const aiResponse = await Selxyzz.chat({
                model: "sxyz-20-B",
                token: "2520a2Ut2cSSB98BSiFuq0ELtcrDHTN4GVaxZQ61", 
                content: text
            });

            await m.reply(aiResponse);
        } catch (error) {
            m.reply(`Terjadi kesalahan: ${error.message}`);
        }
    }
};