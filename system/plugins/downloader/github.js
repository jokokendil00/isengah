const axios = require('axios');

module.exports = {
    command: "gitclone",
    alias: ["gitclone", "git"],
    category: ["downloader"],
    settings: {
        limit: true
    },
    description: "Download Repository GitHub Anda",
    loading: true,
    async run(m, { sock, Func }) {
        try {
            // Validasi input
            if (!m.args[0]) {
                return m.reply('Dimana link repositorinya?');
            }

            if (!Func.isUrl(m.args[0]) || !m.args[0].includes('github.com')) {
                return m.reply('Link tidak valid!');
            }

            // Ekstraksi user dan repo dari URL
            const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
            const match = m.args[0].match(regex);
            if (!match) {
                return m.reply('Format link tidak sesuai!');
            }

            let [, user, repo] = match;
            repo = repo.replace(/\.git$/, '');

            // URL untuk mengunduh ZIP dari repositori
            const url = `https://api.github.com/repos/${user}/${repo}/zipball`;

            // Mendapatkan informasi file
            const response = await axios.head(url);
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition.match(/attachment; filename=(.+)/)?.[1] || `${repo}.zip`;

            // Mengirimkan file ZIP ke chat
            await sock.sendMessage(m.cht, {
                document: { url: url },
                fileName: filename,
                mimetype: 'application/zip'
            }, { quoted: m });

        } catch (error) {
            m.reply(`Gagal mengunduh repositori: ${error.message}`);
        }
    }
};
