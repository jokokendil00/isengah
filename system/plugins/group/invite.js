module.exports = {
  command: "invite",
  alias: ["undang"],
  category: ["group"],
  settings: {
    group: true,
  },
  description: "Undang Peserta Ke Grup Menggunakan Link",
  async run(m, { text, sock }) {
    try {
      if (!m.isAdmin) {
        return m.reply('⚠️ *Hanya admin yang bisa menggunakan perintah ini!* ⚡️');
      }

      const nomor = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      
      if (!nomor) {
        return m.reply('❌ *Nomor yang dikirimkan tidak valid!* 🛑\nPastikan mengirimkan nomor yang benar.');
      }
      
      const groupLink = await sock.groupInviteCode(m.cht);
      const groupLinkUrl = `https://chat.whatsapp.com/${groupLink}`;

      await sock.sendMessage(nomor, {
        text: `🎉✨ *Selamat! Anda telah diundang untuk bergabung dengan grup kami!* ✨🎉\n\nKlik tautan berikut untuk bergabung: \n${groupLinkUrl}\n\n🚀 Jangan lewatkan keseruan grup ini!`
      });

      m.reply(`🚀 *Undangan telah dikirim!* 🎉\nKami berhasil mengirimkan link grup ke nomor: *${text}* 🥳`);

    } catch (err) {
      console.error(err);
      m.reply('💥 *Ups! Terjadi kesalahan besar!* 😱⚠️\nCoba lagi nanti!');
    }
  }
};