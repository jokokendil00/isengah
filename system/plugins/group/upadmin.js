module.exports = {
    command: "upadmin",
    alias: ["promote"],
    category: ["group"],
    settings: {
        group: true,
    },
    description: "Promosikan pengguna menjadi admin grup",
    async run(m, { sock }) {
    if (!m.isAdmin) {
    return m.reply('Kamu Tidak Admin, Perintah Di Batalkan') 
    }
    if (!m.isBotAdmin) {
    return m.reply("Bot Tidak Admin Perintah Tidak Valid.") 
    }
        if (!m.quoted && !m.mentionedJid) throw "> Harap reply pesan pengguna atau tag pengguna yang ingin dijadikan admin.";
        let target;
        if (m.quoted) {
            target = [m.quoted.sender];
        } else if (m.mentionedJid.length > 0) {
            target = m.mentionedJid;
        } else {
            throw "> Tidak dapat menemukan pengguna yang ingin dijadikan admin.";
        }

        try {
            await sock.groupParticipantsUpdate(m.cht, target, "promote");
            m.reply(`Berhasil mempromosikan ${target.map(id => `@${id.split("@")[0]}`).join(", ")} menjadi admin.`, null, { mentions: target });
        } catch (e) {
            m.reply(`> Gagal mempromosikan pengguna menjadi admin. Pastikan bot memiliki izin admin.`);
        }
    }
};