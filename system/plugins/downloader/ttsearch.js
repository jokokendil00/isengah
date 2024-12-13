const axios = require('axios');

module.exports = {
    command: "ttsearch",
    alias: ["tts"],
    category: ["fun"],
    settings: {
        group: true
    },
    description: "Cari Video TikTok",
    loading: true,
    async run(m, { sock, text }) {
        if (!text) {
            return m.reply("*❌ Error:* Masukkan *query* pencarian terlebih dahulu.");
        }

        try {
            await sock.sendMessage(m.cht, {
                react: { 
                    text: "🔎", 
                    key: m.key 
                }
            });

            try {
                let searchResults = await tiktokSearchVideo(text);
                let caption = '*📱 TIKTOK - SEARCH 📱*\n\n';

                let video = searchResults.videos[0];
                caption += `*🔹 No Urutan:* 1\n` +
                           `*🔸 Capt:* ${video.title}\n` +
                           `*👤 Username:* ${video.author.unique_id}\n` +
                           `*📝 Nickname:* ${video.author.nickname}\n` +
                           `*⏳ Durasi:* ${toRupiah(video.duration)} detik\n` +
                           `*👍 Like:* ${toRupiah(video.digg_count)}\n` +
                           `*💬 Komentar:* ${toRupiah(video.comment_count)}\n` +
                           `*🔄 Share:* ${toRupiah(video.share_count)}\n` +
                           `*🌍 URL:* https://www.tiktok.com/@${video.author.unique_id}/video/${video.video_id}\n\n`;

                sock.sendMessage(m.cht, {
                    video: { url: `https://tikwm.com${video.play}` },
                    caption: caption
                }, { quoted: m });

            } catch (err) {
                m.reply("*❌ Error:* Terjadi kesalahan saat mengambil data dari TikTok.");
            }
        } catch (err) {
            m.reply("*❌ Error:* Terjadi kesalahan dalam pencarian video.");
        }
    }
}

async function tiktokSearchVideo(query) {
    return new Promise(async (resolve, reject) => {
        axios({
            method: "POST",
            url: "https://tikwm.com/api/feed/search",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "cookie": "current_language=en",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
            },
            data: {
                keywords: query,
                count: 12,
                cursor: 0,
                web: 1,
                hd: 1
            }
        }).then((res) => {
            resolve(res.data.data);
        }).catch((err) => {
            reject(err);
        });
    });
}

function toRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}