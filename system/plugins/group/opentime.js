module.exports = {
    command: "opentime",
    alias: ["timeopen"],
    category: ["group"],
    settings: {
        group: true
    },
    description: "Tentukan Jam, Menit, Detik, atau Hari untuk Membuka Grup.",
    async run(m, { sock, text }) {
        const timeUnits = {
            detik: 1000,
            menit: 60000,
            jam: 3600000,
            hari: 86400000
        };

        const args = text.split(" ");
        const duration = parseInt(args[0]);
        const unit = args[1]?.toLowerCase();
        const multiplier = timeUnits[unit];

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

        m.reply(`💣 *Ledakan dimulai!* Open time ${duration} ${unit} dimulai dari sekarang!`);

        const sendReminder = (message, delay) => {
            if (timer > delay) {
                setTimeout(() => {
                    m.reply(message);
                }, timer - delay);
            }
        };

        sendReminder(`💥 *Ledakan! Pengingat:* 10 detik lagi grup akan dibuka!`, 10000);

        setTimeout(() => {
            const openMessage = `🔥💥 *[ OPEN TIME ]*
            Grup TELAH DIBUKA! 🎆💥\n\n🔥💣 *Ledakan!* 🚀🔥\n🌟 *Guncangan besar! Grup kembali bergemuruh!* 🌟\n💥 *Waktunya meledak! Semua siap untuk aksi!* 💣💥`;
            sock.groupSettingUpdate(m.cht, 'not_announcement');
            m.reply(openMessage);
        }, timer);
    }
};