const axios = require("axios");
const fs = require("fs");
const path = require("path");

const __x = ["TjFTQTk=", "YXU=", "dGhv", "cg=="];

function __check() {
  const real = Buffer.from(__x.join(""), "base64").toString("utf-8");
  if (module.exports.config.author !== real) {
    throw new Error("⛔ Set author name N1SA9 correctly!");
  }
}

const getRandomQuery = () => {
  const queries = [
    "#messiedits", "#badgirls", "animeedit", "rodeodancegirls",
    "#kinktok", "lyricseditvibe3", "messiedits", "ronaldoedits",
    "#memebangladesh", "deepthoughtss44", "mr.bishal_editz",
    "ruth_prashant", "ichijou_7", "peace_quote1"
  ];
  return queries[Math.floor(Math.random() * queries.length)];
};

module.exports = {
  config: {
    name: "fyp",
    version: "1.6",
    author: "N1SA9",
    cooldowns: 10,
    role: 0,
    usePrefix: "awto",
    shortDescription: "Random TikTok video",
    category: "media",
    guide: "{pn} [optional query]"
  },

  onStart: async function ({ api, event, args }) {

    try {
      __check();
    } catch (e) {
      return api.sendMessage(e.message, event.threadID, event.messageID);
    }

    const threadID = event.threadID;

    // ❤️ REACT ADD
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    // 💬 WAIT MESSAGE
    const waitMsg = await api.sendMessage("Plz w8 bby <3 😘", threadID);

    const a = "bafa731292msh63";
    const b = "05feb5ba5430ep11";
    const c = "f7d5jsn375cbe86ebdd";
    const NVC_KEY = a + b + c;

    const userQuery = args.join(" ");
    const searchQuery = userQuery ? userQuery : getRandomQuery();

    try {
      const res = await axios.get(
        "https://tiktok-scraper7.p.rapidapi.com/feed/search",
        {
          params: {
            keywords: searchQuery,
            region: "bd",
            count: "1",
            cursor: "0",
            publish_time: "0",
            sort_type: "0"
          },
          headers: {
            "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
            "x-rapidapi-key": NVC_KEY
          }
        }
      );

      const video = res.data?.data?.videos?.[0];

      if (!video) {
        return api.sendMessage(`❌ No video found for: ${searchQuery}`, threadID);
      }

      const videoUrl = video.play;
      const filePath = path.join(__dirname, `/cache/tiktok_${Date.now()}.mp4`);

      const stream = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      stream.data.pipe(writer);

      writer.on("finish", () => {

        // ✅ REMOVE WAIT MSG
        api.unsendMessage(waitMsg.messageID);

        api.sendMessage({
          body: `🎬 Result for: ${searchQuery}`,
          attachment: fs.createReadStream(filePath)
        }, threadID, () => fs.unlinkSync(filePath));

        // ❤️ DONE REACT
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      });

      writer.on("error", () => {
        api.sendMessage("❌ Video download failed!", threadID);
      });

    } catch (err) {
      console.error(err?.response?.data || err.message);

      api.unsendMessage(waitMsg.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);

      api.sendMessage("❌ API error or invalid key!", threadID);
    }
  }
};
