module.exports = {
    command: "tweet",
    alias: ["twt"],
    category: ["fun"],
    settings: {
        group: true,
    },
    description: "Buat cuitan Twitter palsu dengan teks yang Anda masukkan.",
    async run(m, { text, sock }) {
        if (!text) {
            return m.reply("🚫 Tidak ada teks yang dimasukkan! Silakan masukkan teks untuk membuat cuitan.");
        }

        try {
            await m.reply("⏳ Membuat cuitan Anda, harap tunggu...");
            
            const avatar = await sock.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
            const displayName = m.pushName || "Pengguna";
            const username = displayName.replace(/ /g, '_').toLowerCase();
            const replies = (Math.floor(Math.random() * 1000) + 100).toLocaleString();
            const retweets = (Math.floor(Math.random() * 5000) + 500).toLocaleString();
            const likes = (Math.floor(Math.random() * 10000) + 1000).toLocaleString();
            const theme = "dark";

            const url = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&comment=${encodeURIComponent(text)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&likes=${encodeURIComponent(likes)}&theme=${encodeURIComponent(theme)}`;

            await sock.sendMessage(
                m.cht,
                {
                    image: { url: url },
                    caption: `✨ Berikut adalah cuitan palsu Anda:\n\n🖊️ **${text}**\n\n🔄 ${retweets} Retweet | ❤️ ${likes} Suka`,
                },
                { quoted: m }
            );

        } catch (error) {
            m.reply(`❌ Terjadi kesalahan saat membuat cuitan. Coba lagi nanti. : ${error.message}`);
        }
    },
};