module.exports = {
   command: "kick",
   alias: ["sulap"],
   category: ["group"],
   settings: {
     group: true
   },
   description: "Kick Member Di Group",
   loading: true,
   async run(m, { sock, text }) {
     if (!m.isAdmin) {
       return m.reply("Kamu Tidak Admin");
     }
     if (!m.isBotAdmin) {
       return m.reply("Yahh Devolution Tidak Admin :)");
     }

     let users;

     // Pastikan m.mentionedJid terdefinisi dan memiliki elemen pertama
     if (m.mentionedJid && m.mentionedJid[0]) {
       users = m.mentionedJid[0]; // Jika ada yang ditandai (tagged)
     } else if (m.quoted && m.quoted.sender) {
       users = m.quoted.sender; // Jika ada yang dibalas
     } else if (text) {
       users = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'; // Jika ada nomor yang dimasukkan
     }

     // Jika tidak ada input yang valid (tag, reply, atau nomor)
     if (!users) {
       return m.reply("Tag, reply, atau kirim nomor yang mau di kick.");
     }

     try {
       await sock.groupParticipantsUpdate(m.cht, [users], 'remove');
       m.reply(`Berhasil Kick ${users}`);
     } catch (err) {
       m.reply(`Gagal Kick Member: ${err.message}`);
     }
   }
};