module.exports = {
  command: "tagme",
  alias: ["mention", "tag"],
  category: ["group"],
  settings: {
    limit: false,
  },
  description: "Tag pengirim pesan.",
  loading: true,
  async run(m, { sock }) {
    const message = {
      text: `@${m.sender.split("@")[0]}`,
      mentions: [m.sender],
    };
    await sock.sendMessage(m.cht, message);
  },
};