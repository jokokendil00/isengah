module.exports = {
    command: "closetime",
    alias: ["timeclose"],
    category: ["group"],
    settings: {
        group: true
    },
    description: "Tentukan Jam, Menit, Detik, atau Hari untuk Menutup Grup.",
    async run(m, { sock, text }) {
        if (!m.isAdmin) {
            return m.reply("⚡️ *Ledakan Gagal!* Anda harus menjadi admin grup untuk menjalankan perintah ini.");
        }
        if (!m.isBotAdmin) {
            return m.reply("⚡️ *Ledakan Gagal!* Bot harus menjadi admin grup untuk menjalankan perintah ini.");
        }

        const timeUnits = {
            detik: 1000,
            menit: 60000,
            jam: 3600000,
            hari: 86400000
        };

        const args = text.split(" ");
        let duration = parseInt(args[0]);
        const unit = args[1]?.toLowerCase();
        let multiplier = timeUnits[unit];

        if (!unit || isNaN(duration) || duration <= 0 || !multiplier) {
            return m.reply(`💥 *Ledakan!* Pilih waktu yang valid!\n\nContoh: *${m.command} 10 detik*`);
        }

        if (unit === "jam" && duration === 24) {
            duration = 1;
            multiplier = timeUnits.hari;
        } else if (unit === "hari" && duration === 24) {
            duration = 1;
            multiplier = timeUnits.hari;
        }

        const timer = duration * multiplier;

        m.reply(`💣 *Ledakan dimulai!* Close time ${duration} ${unit} dimulai dari sekarang!`);

        const sendReminder = (message, delay) => {
            if (timer > delay) {
                setTimeout(() => {
                    m.reply(message);
                }, timer - delay);
            }
        };

        sendReminder(`💥 *Ledakan! Pengingat:* 10 detik lagi grup akan ditutup!`, 10000);

        setTimeout(() => {
            const closeMessage = `🔥💥 *[ CLOSE TIME ]* 
            Grup TELAH DITUTUP! 💣💥\n\n🔥💥 *Ledakan!* 🚀💥\n🌟 *Grup ditutup dalam ledakan besar!* 🌟\n💥 *Pintu ditutup, siapkan untuk lebih banyak aksi!* 💣💥`;
            sock.groupSettingUpdate(m.cht, 'announcement');
            m.reply(closeMessage);
        }, timer);
    }
};