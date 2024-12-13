/*
Base By Axel
Creatior is Selxyzz
Group Main Bot: https://chat.whatsapp.com/He1CTwgCL6B3lpQ8dvtPvY
Join Untuk Menggunakan Bot
*/

const fs = require('node:fs');

const config = {
    owner: ["62895353361010"],
    name: "~ Devolution",
    sessions: "Devo-Sessions",
    sticker: {
      packname: "Devolution",
      author: "Selxyzz"
    },
   messages: {
      wait: "*( Loading )* Tunggu Sebentar...",
      owner: "*( Denied )* Kamu bukan owner ku !",
      premium: "*( Denied )* Fitur ini khusus user premium",
      group: "*( Denied )* Fitur ini khusus group",
   },
   database: "neko-db",
   tz: "Asia/Jakarta"
}

module.exports = config

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
  delete require.cache[file];
});