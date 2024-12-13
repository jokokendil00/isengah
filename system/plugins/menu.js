const moment = require("moment-timezone");
const pkg = require(process.cwd()+"/package.json");
const axios = require('axios');
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    command: "menu",
    alias: ["menu", "help"],
    category: ["main"],
    description: "Menampilkan menu bot",
    loading: true,
    async run(m, { sock, plugins, config, Func }) {
    let data = fs.readFileSync(process.cwd()+'/system/case.js', 'utf8');
    let casePattern = /case\s+"([^"]+)"/g;
    let matches = data.match(casePattern).map(match => match.replace(/case\s+"([^"]+)"/, '$1'));
     let menu = {};
    plugins.forEach(item => {
      if (!item.category) {
       item.category = []
     }
      item.category.forEach(cat => {
         if (!menu[cat]) {
             menu[cat] = { command: [] };
         }  
        menu[cat].command.push({
                name: item.command,
                alias: item.alias,
                description: item.description
             });
          });
       });
    let cmd = 0;
    let alias = 0;
    let pp = await sock.profilePictureUrl(m.sender, 'image').catch(e => 'https://files.catbox.moe/8getyg.jpg')
   Object.values(menu).forEach(category => {
       cmd += category.command.length
          category.command.forEach(command => {
            alias += command.alias.length; 
        });
    });
      let caption = `*👋 Hai @${m.sender.split('@')[0]} saya adalah ~ Devolution Bot WhatsApp yang siap membantu sehari - hari anda agar lebih mudah dan simple*

*– 乂 Info User*
> *- Nama :* ${m.pushName}
> *- Perangkat :* ${m.device}
> *- Tag :* @${m.sender.split("@")[0]}

*– 乂 Info - Bot*
> *- Nama :* ${pkg.name}
> *- Versi :* v${pkg.version}
> *- Runtime :* ${Func.toDate(process.uptime() * 1000)}
> *- Prefix :* [ ${m.prefix} ]

Jika menemukan bug pada bot ini bisa langsung hubungi owner bot

*– 乂 M e n u - O t h e r*

${matches.map((a, i) => `*${i + 1}.* ${m.prefix + a}\n> Fitur sampingan ( Case Fitur )`).join("\n")} 
`
Object.entries(menu).forEach(([tag, commands]) => {
    caption += `\n*– 乂 M e n u – ${tag.split('').join(' ').capitalize()}*\n\n`;
    commands.command.forEach((command, index) => {
        caption += `*${index + 1}.* ${m.prefix + command.name}\n${command.description ? `> ${command.description}\n` : ''}`
            });
      });   
      const packageJsonPath = path.resolve(process.cwd(), 'package.json');
        const packageJsonBuffer = fs.readFileSync(packageJsonPath);
      
        m.reply({
            document: packageJsonBuffer,
            filename: "~ Devolution ~",
            caption: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "20202020220@newsletter",
                    newsletterName: "ðŸŒ¦ Devolution",
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: "~ Devolution Bot WhatsApp ",
                    body: "- Devolution Siap Membantu Sehari - Hari Anda!",
                    mediaType: 1,
                    thumbnailUrl: "https://files.catbox.moe/9h8lxy.jpg",
                    sourceUrl: "https://chat.whatsapp.com/He1CTwgCL6B3lpQ8dvtPvY",
                    renderLargerThumbnail: true
                }
            }
        });
        await sock.sendMessage(m.cht, { audio: { url: "https://pomf2.lain.la/f/ta0d7uhr.mp3" }, mimeType: 'audio/mp3' }, { quoted: m })
    }
}