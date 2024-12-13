module.exports = {
  command: "tiktok",
  alias: ["tt", "ttdl", "tiktokdl"],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Download video/slide dari tiktok",
  loading: true,
  async run(m, { sock, Func, text, Scraper, config }) {
    if (!/tiktok.com/.test(text) || !text)
      throw `> Reply atau masukan link tiktok yang ingin di download`;

    await Scraper.tiktok.download(text).then(async (a) => {
      let size = Func.formatSize(a.size);
      let limit = Func.sizeLimit(size, db.list().settings.max_upload);
      if (limit.oversize)
        return m.reply(
          `> Maaf Video tidak Dapat diputar karena melebihi maksimal ukuran *( ${size} )*, Maksimal ukuran untuk pengguna Free adalah *50MB*, Upgrade ke premium agar dapat meningkatkan maksimal ukuran hingga *1GB*!`
        );

      let cap = `*– 乂 Tiktok - Downloader*\n`;
      cap += `> *- Negara :* ${a.region}\n`;
      cap += `> *- Durasi :* ${Func.toTime(a.duration)}\n`;
      cap += `> *- Ukuran File :* ${Func.formatSize(a.size)}\n`;
      cap += `> *- Penonton :* ${Func.h2k(a.play_count)}\n`;
      cap += `> *- Tipe :* ${a.images ? "Slide Show" : "Video"}`;

      if (a.images) {
        let slides = [];
        for (let i = 0; i < a.images.length; i++) {
          slides.push({
            title: `Slide ${i + 1}`,
            description: `Slide dari TikTok`,
            rowId: `slide_${i + 1}`,
            mediaUrl: a.images[i],
          });
        }

        const sections = [
          {
            title: "Daftar Slide",
            rows: slides.map((s) => ({
              title: s.title,
              description: s.description,
              rowId: s.rowId,
            })),
          },
        ];

        const listMessage = {
          text: cap,
          footer: "Tiktok Downloader",
          title: "Slide Show TikTok",
          buttonText: "Lihat Slide",
          sections,
        };

        await sock.sendMessage(m.cht, listMessage);
      } else {
        await sock.sendFile(m.cht, a.play, null, cap, m);
      }

      if (a.music_info) {
        await sock.sendFile(m.cht, a.music_info.play, null, "", m, {
          mimetype: "audio/mpeg",
          contextInfo: {
            externalAdReply: {
              title: a.music_info.title,
              body: a.music_info.play,
              mediaType: 1,
              thumbnailUrl: a.music_info.cover,
              renderLargerThumbnail: true,
            },
          },
        });
      }
    });
  },
};