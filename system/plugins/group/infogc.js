module.exports = {
  command: "infogc",
  alias: ["groupinfo", "ginfo"],
  category: ["group"],
  description: "📜 Dapatkan informasi grup",
  async run(m, { sock }) {
    try {
      if (!m.isGroup) 
        return m.reply("❌ Perintah ini hanya dapat digunakan di dalam grup!");

      const metadata = await sock.groupMetadata(m.cht);
      const groupName = metadata.subject;
      const groupDescription = metadata.desc || "❌ Deskripsi tidak ditemukan";
      const groupOwner = metadata.owner || "❓ Tidak diketahui";
      const totalParticipants = metadata.participants.length;
      const adminCount = metadata.participants.filter((p) => p.admin).length;

      const text = `🌟 ━━INFORMASI GRUP━━ 🌟\n` +
                   `👥 Nama Grup: ${groupName}\n` +
                   `📋 Deskripsi: ${groupDescription}\n` +
                   `👑 Pemilik Grup: @${groupOwner.split("@")[0]}\n` +
                   `👤 Total Anggota: ${totalParticipants} orang\n` +
                   `🛡️ Jumlah Admin: ${adminCount} orang\n` +
                   `${m.isBotAdmin ? "✅ Bot Status: Saya adalah admin grup ini 🎉" : "❌ Bot Status: Saya bukan admin, beri akses admin ya! 😔"}\n` +
                   `⚙️ Gunakan bot ini untuk mempermudah aktivitas grup Anda!`;

      await sock.sendMessage(m.cht, { text, mentions: [groupOwner] });
    } catch (error) {
      console.error(error);
      m.reply("❌ Terjadi kesalahan saat mendapatkan informasi grup. Pastikan bot memiliki akses yang cukup!");
    }
  },
};