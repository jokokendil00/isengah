const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    command: "upvidey",
    alias: [],
    category: ["uploader"],
    description: "Download dan upload video dari videy",
    loading: true,
    async run(m, { sock, Func, text }) {
        if (!text) {
            throw "*– 乂 Cara Penggunaan*\n> *`--upload`* Untuk upload video ke videy\n> *`https://videy.co/xxx`* untuk download video dari videy";
        }

        if (text.includes("--upload")) {
            let q = m.quoted ? m.quoted : m;
            if (!/video/.test(q.msg.mimetype) || !q.isMedia) {
                throw `> Reply/kirim video dengan caption ${m.prefix + m.command} ${text}`;
            }

            let buffer = await q.download();
            let hasil = await videy(buffer);
            let cap = "*– 乂 Videy - Uploader*\n";
            cap += `> *- Ukuran :* ${Func.formatSize(buffer.length)}\n`;
            cap += `> *- Link :* ${hasil}`;

            m.reply(cap);
        } else {
            if (!Func.isUrl(text) || !/videy.co/.test(text)) {
                throw "> Masukkan link Videy yang valid.";
            }

            let id = text.split("id=")[1];
            if (!id) {
                throw "> Tidak ada ID dalam link yang dimasukkan.";
            }

            let hasil = `https://cdn.videy.co/${id}.mp4`;
            let size = await Func.getSize(hasil);
            let limit = Func.sizeLimit(size, db.list().settings.max_upload);
            if (limit.oversize) {
                throw `Ukuran file terlalu besar *( ${size} )*. Upgrade ke premium untuk download video hingga ukuran *1GB*!`;
            }

            let cap = "*– 乂 Videy - Downloader*\n";
            cap += `> *- Ukuran video :* ${size}`;
            m.reply({
                video: { url: hasil },
                caption: cap
            });
        }
    }
};

async function videy(buffer) {
    try {
        const form = new FormData();
        form.append('file', buffer, 'upload.mp4');

        const apiUrl = 'https://videy.co/api/upload';
        const headers = {
            ...form.getHeaders(),
        };

        const uploadResponse = await axios.post(apiUrl, form, { headers });

        const data = uploadResponse.data;
        if (data.id) {
            return `https://videy.co/v?id=${data.id}`;
        } else {
            throw new Error('ID video tidak ditemukan dalam respons.');
        }
    } catch (error) {
        console.error('Gagal mengunggah video:', error.message);
        throw new Error('Terjadi kesalahan saat mengupload video ke Videy.');
    }
}