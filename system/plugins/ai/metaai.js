module.exports = {
  command: "meta-ai",
  alias: ["meta"],
  category: ["ai"],
  settings: {
    limit: true,
  },
  description: "Chat dengan Meta-AI",
  async run(m, { text, sock }) {
    try {
      if (!text) {
        return m.reply(
          "Mana teks yang ingin kamu tanyakan? 🤔 Contoh: meta-ai Halo, apa kabar?"
        );
      }
    await m.reply("*🌦 Membuat Response*") 
      const Together = require("together-ai");
      const together = new Together({
        apiKey: "0e5ec1d9c95daba7628be74f38bf0ec5a4f9592daa5461a20427ad075d12f6a3", 
      });

      const initialMessages = [
        {
          role: "system",
          content: `Hai! 😊 Saya adalah ChatGPT yang menggunakan model Meta LLaMA. Saya dibuat oleh Devolution ~ Development.
                Saya adalah asisten bot yang dapat menyimpan nama Anda sebagai "${
              m.pushName || "User"
            }", berbicara dalam bahasa Indonesia, dan selalu berusaha membantu dengan cara yang ramah dan menyenangkan. Ayo ngobrol!`,
        },
        { role: "user", content: text },
      ];

      const response = await together.chat.completions.create({
        messages: initialMessages,
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        max_tokens: null,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>", "<|eom_id|>"],
        stream: true,
      });

      let generatedResponse = "";
      for await (const token of response) {
        if (
          token.choices &&
          token.choices[0] &&
          token.choices[0].delta &&
          token.choices[0].delta.content
        ) {
          generatedResponse += token.choices[0].delta.content;
        }
      }

      if (!generatedResponse.trim()) {
        generatedResponse =
          "Maaf, saya tidak dapat memberikan jawaban untuk pertanyaan Anda. 😔";
      }

      generatedResponse += " ✨";
      await sock.sendMessage(m.cht, { text: generatedResponse }, { quoted: m });
    } catch (error) {
      console.error("Error handling meta-ai:", error);
      await sock.sendMessage(
        m.chat,
        {
          text:
            "⚠️ Terjadi kesalahan saat memproses permintaan Meta-AI. Silakan coba lagi nanti. 🙏",
        },
        { quoted: m }
      );
    }
  },
};