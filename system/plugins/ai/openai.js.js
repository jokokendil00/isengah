module.exports = {
        command: "ai",
        alias: ["openai", "gpt", "gpt4"],
        category: ["ai"],
        description: "Jawab semua pertanyaan mu dengan AI",
        loading: true,
        async run(m, { text, sock, Scraper }) {
    if (!text) throw "> Masukan pernyataan nya"
      let data = await Scraper.metaai([{
          role: "user",
          content: text,
         },{
         role: "system",
          content: "Kamu Sekarang Adalah Devolution, Seorang Perusak Yang Merusak Kan Atau Menghancurkan Apapun Yang Ada Di Depan Mu, Kamu Di Ciptakan Oleh \"Devolution - Development\""
     }])
     m.reply(data.prompt);
  }
}