module.exports = {
  command: "add",
  alias: ["tambahkan"],
  category: ["group"],
  settings: {
    group: true,
  },
  description: "Tambahkan Peserta Ke Group",
  async run(m, { text, sock }) {
    let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    try {
      const participants = await sock.groupMetadata(m.cht);
      const memberJids = participants.participants.map(member => member.jid);
      if (memberJids.includes(users)) {
        m.reply('Target sudah menjadi anggota grup sebelumnya. 🫡');
      } else {
        await sock.groupParticipantsUpdate(m.cht, [users], 'add');
        m.reply('Sukses add target! 🎉');
      }
    } catch (err) {
      m.reply('Ups, terjadi kesalahan. Coba lagi ya! 😔');
    }
  }
};