module.exports = {
    command: "downadmin",
    alias: ["demote"],
    category: ["group"],
    settings: {
        group: true,
    },
    description: "Turunkan status admin pengguna",
    async run(m, { sock }) {
        if (!m.isAdmin) {
            return m.reply('Kamu Tidak Admin, Perintah Di Batalkan');
        }
        if (!m.isBotAdmin) {
            return m.reply("Bot Tidak Admin, Perintah Tidak Valid.");
        }
        if (!m.quoted && !m.mentionedJid) throw "> Harap reply pesan pengguna atau tag pengguna yang ingin diturunkan dari admin.";
        
        let target;
        if (m.quoted) {
            target = [m.quoted.sender];
        } else if (m.mentionedJid.length > 0) {
            target = m.mentionedJid;
        } else {
            throw "> Tidak dapat menemukan pengguna yang ingin diturunkan dari admin.";
        }

        try {
            await sock.groupParticipantsUpdate(m.cht, target, "demote");
            m.reply(`Berhasil menurunkan ${target.map(id => `@${id.split("@")[0]}`).join(", ")} dari admin.`, null, { mentions: target });
        } catch (e) {
            m.reply(`> Gagal menurunkan pengguna dari admin. Pastikan bot memiliki izin admin.`);
        }
    }
};