module.exports = {
    command: "request",
    alias: ["req", "pitur"],
    category: ["fun"],
    description: "Kirim permintaan fitur ke pemilik",
    async run(m, { sock, text, config }) {
        if (!m.isGroup) {
            return m.reply("Perintah ini hanya dapat digunakan di grup!");
        }

        const featureRequest = text
        if (!featureRequest) {
            return m.reply("Harap masukkan deskripsi fitur yang ingin Anda minta!");
        }

        try {
            await sock.sendMessage(config.owner + "@s.whatsapp.net", {
                text: `Permintaan Fitur Baru: \n\n${featureRequest}\n\nDari: ${m.sender.split('@')[0]} (${m.sender})`,
            });
            m.reply("Permintaan fitur Anda telah dikirim ke pemilik!");
        } catch (error) {
            console.error(error);
            m.reply("Gagal mengirim permintaan fitur. Coba lagi nanti.");
        }
    }
};