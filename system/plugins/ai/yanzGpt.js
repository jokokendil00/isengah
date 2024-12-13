const axios = require("axios");

module.exports = {
  command: "yanzgpt",
  alias: ["yzgpt"],
  category: ["ai"],
  settings: {
    group: true,
  },
  description: "Chat dengan Yanz-GPT yang dibuat oleh YanzDev",
  async run(m, { text, sock }) {
    if (!text) {
      return m.reply("Masukkan pertanyaanmu kepada YanzGPT.");
    }
    try {
      await m.reply("*⏳ Generating Answer*");
      const ai = new YanzGPT();
      const response = await ai.chat(text);

      if (response.success) {
        let aiReply = response.data.choices[0]?.message?.content || "Tidak ada jawaban.";
        // Mengganti ** menjadi * pada respons AI
        aiReply = aiReply.replace(/\*\*/g, "*");
        // Mengganti ### menjadi tabulasi
        aiReply = aiReply.replace(/###/g, "\t");
        aiReply = aiReply.replace(/##/g, "\t");
        await m.reply(aiReply);
      } else {
        await m.reply(`*❌ Terjadi kesalahan:* ${response.error}`);
      }
    } catch (error) {
      console.error(error);
      m.reply("*❌ Terjadi kesalahan saat berkomunikasi dengan YanzGPT.*");
    }
  },
};

const AVAILABLE_MODELS = [
  {
    name: "yanzgpt-revolution-25b-v3.0",
    type: "Default",
    description: "Model standar untuk penggunaan umum",
  },
  {
    name: "yanzgpt-legacy-72b-v3.0",
    type: "Pro",
    description: "Model profesional dengan kapasitas yang lebih tinggi",
  },
];

class YanzGPT {
  constructor(apiKey = "yzgpt-sc4tlKsMRdNMecNy", baseURL = "https://api.yanzgpt.my.id/v1/chat") {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  static getAvailableModels() {
    return AVAILABLE_MODELS;
  }

  async chat(query, options = {}) {
    const {
      prompt = "Kamu adalah AI yang dirancang oleh Devolution - Development untuk menjawab pertanyaan apapun.",
      model = "yanzgpt-legacy-72b-v3.0",
      temperature = 0.7,
      max_tokens = 1024,
    } = options;

    try {
      const response = await axios.post(
        this.baseURL,
        {
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: query },
          ],
          model,
          temperature,
          max_tokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data,
        usage: response.data.usage || null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  setModel(modelName) {
    const validModel = AVAILABLE_MODELS.find((m) => m.name === modelName);
    if (!validModel) {
      throw new Error(`Model ${modelName} tidak ditemukan.`);
    }
    return validModel.name;
  }
}