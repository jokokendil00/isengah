const axios = require('axios');

module.exports = {
    command: "servermc",
    alias: ["mcserver"],
    category: ["games"],
    settings: {
        limit: true,
    },
    description: "Cari informasi Server Minecraft Kamu (Java/Bedrock)",
    loading: true,
    async run(m, { text, sock }) {
        if (!text) {
            return m.reply("⚠️ Masukkan nama atau IP server Minecraft. Format: `[nama] [java/bedrock]`");
        }

        try {
            const [name, serverType] = text.split(' ');
            if (!name || !serverType) {
                return m.reply("⚠️ Format tidak valid. Contoh: `play.example.com java`");
            }

            const fetchServer = serverType.toLowerCase() === "java" ? servermc.java : servermc.bedrock;
            const response = await fetchServer(name);

            if (!response.Status) {
                return m.reply(`❌ Gagal mengambil data server. Alasan: ${response.data.message}`);
            }

            const serverData = response.data;
            const formattedData = displayServerInfo(serverData);
            m.reply(formattedData);
        } catch (err) {
            console.error(err);
            m.reply("❌ Terjadi kesalahan saat memproses permintaan.");
        }
    },
};

const servermc = {
    java: async (ip) => {
        try {
            const { data } = await axios.get(`https://api.mcstatus.io/v2/status/java/${ip}`, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });

            return { Scrape: 'dekuganz', Status: true, data };
        } catch (err) {
            return { Scrape: 'dekuganz', Status: false, data: { message: `Tidak dapat mengakses server.` } };
        }
    },
    bedrock: async (ip) => {
        try {
            const { data } = await axios.get(`https://api.mcstatus.io/v2/status/bedrock/${ip}`, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });

            return { Scrape: 'dekuganz', Status: true, data };
        } catch (err) {
            return { Scrape: 'dekuganz', Status: false, data: { message: `Tidak dapat mengakses server.` } };
        }
    },
};

function displayServerInfo(data) {
    const {
        online,
        host,
        port,
        ip_address,
        eula_blocked,
        srv_record,
        version,
        players,
        motd,
        icon,
    } = data;

    return `
    🌐 *Status Server*: ${online ? '🟢 Online' : '🔴 Offline'}
    🖥️ *Alamat*: ${host}:${port}
    🌍 *IP Address*: ${ip_address}
    ❌ *EULA Blocked*: ${eula_blocked ? 'Iya' : 'Tidak'}
    📡 *SRV Record*: ${srv_record.host}:${srv_record.port}
    🛡️ *Versi Server*: ${version.name_clean || 'Tidak diketahui'}
    📊 *Protokol*: ${version.protocol || 'Tidak diketahui'}  
    👥 *Jumlah Pemain*: ${players.online}/${players.max}
    📝 *Motd*: 
    ${motd?.clean || 'Tidak ada deskripsi'}
    
    `;
}