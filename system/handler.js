const config = require("../settings.js");
const Func = require("../lib/function.js");
const serialize = require("../lib/serialize.js");

module.exports = async(message, sock, store) => {
        try {
            message.message = Object.keys(message.message)[0] === 'ephemeralMessage'
                ? message.message.ephemeralMessage.message
                : message.message;
            global.m = await serialize(message, sock, store);

            if (m.key.jid === "status@broadcast") {
                await sock.readMessage([m.key]);
                await sock.sendMessage(m.key.jid, {
                    react: { text: "📸", key: m.key },
                }, {
                    statusJidList: Object.keys(store.contact),
                });
                console.log(chalk.green.bold("– Membaca Status WhatsApp dari : " + m.pushName));
            }
            
            await db.main(m);
            if (m.isBot) return;
            if (db.list().settings.self && !m.isOwner) return;
            if (m.isGroup && db.list().group[m.cht]?.mute && !m.isOwner) return;
            if (Object.keys(store.groupMetadata).length === 0) {
                store.groupMetadata = await sock.groupFetchAllParticipating();
            }
            for (let name in pg.plugins) {
                let plugin = {};
                if (typeof pg.plugins[name].run === "function") {
                    plugin = pg.plugins[name];
                }
                if (!plugin) return;
                if (!plugin.command && typeof plugin.run === "function") {
                await plugin.run(m, { 
                          sock, 
                          Func,
                          config
                       });
                }
                let Scraper = await scraper.list();
                let cmd = m.command.toLowerCase() === plugin.command
                    ? m.command.toLowerCase()
                    : plugin.alias.includes(m.command.toLowerCase());
                let text = '';
                if (cmd) {
                    text = m.isQuoted ? (m.quoted ? m.quoted.text : m.text) : m.text;
                }
                try {
                    if (cmd) {
                        if (plugin.settings?.owner && !m.isOwner) {
                            m.reply(config.messages.owner);
                            continue;
                        } else if (plugin.settings?.group && !m.isGroup) {
                            m.reply(config.messages.group);
                            continue;
                        }
                        if (plugin.loading) m.react("🕐");
                        await plugin.run(m, {
                            sock,
                            config,
                            text,
                            plugins: Object.values(pg.plugins).filter(a => a.alias),
                            Func,
                            Scraper,
                        });
                    }
                } catch (e) {
                    if (e.name) {
                        m.reply(Func.jsonFormat(e));
                    } else {
                        m.reply(e);
                    }
                }
            }
            require("../lib/logger.js")(m);
            await require("./case.js")(m, sock, store);
        } catch (error) {
            console.error(error);
        }
}