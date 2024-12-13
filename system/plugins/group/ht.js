module.exports = {
    command: "hidetag",
    alias: ["ht"],
    category: ["group"],
    settings: {
        group: true
    },
    description: "Hidetag Di Group!",
    loading: true,
    async run(m, { text, sock }) {
      if (!text) {
        return m.reply("Masukkan Text Yang Ingin Kamu Jadikan Info.")
      }
        const participants = !m.isGroup? await groupMetadataa.participants : ""
        
        sock.sendMessage(m.cht, {
            text: text,
            contextInfo: {
                mentionedJid: participants.map(a => a.id),
                groupMentions: [{
                    groupJid: m.chat,
                    groupSubject: '~ Devolution'
                }]
            }
        });
    }
}