const axios = require("axios");
const __X = ["TjFTQTk="];
function __getAuthor() {
  return Buffer.from(__X.join(""), "base64").toString("utf-8");
}

function __lock(api, event) {
  if (module.exports.config.author !== __getAuthor()) {
    return api.sendMessage(
      "⚠️ This command is locked!\n👑 Author: N1SA9",
      event.threadID,
      event.messageID
    );
  }
  return true;
}

module.exports = {
  config: {
    name: "bitly",
    version: "1.2",
    author: "N1SA9",
    role: 0,
    usePrefix: "awto",
    cooldowns: 10,
    shortDescription: "Shorten links using Bitly",
    longDescription: "Convert long URL into short Bitly link",
    category: "general",
    guide: "{p}{n} <link>"
  },

  onStart: async function ({ api, event, args }) {

    const lock = __lock(api, event);
    if (lock !== true) return;

    const bitlyToken = global.KuRuMiV3.config.bitly_token;

    if (!bitlyToken) {
      return api.sendMessage("❌ Bitly token not found in config!", event.threadID, event.messageID);
    }

    if (!args[0]) {
      return api.sendMessage("❌ Please provide a link!\nExample: bitly https://google.com", event.threadID, event.messageID);
    }

    const originalLink = args.join(" ");

    try {
      const response = await axios.post(
        "https://api-ssl.bitly.com/v4/shorten",
        {
          long_url: originalLink
        },
        {
          headers: {
            Authorization: `Bearer ${bitlyToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      const shortLink = response.data.link;

      return api.sendMessage(
        `✅ Shortened Link:\n${shortLink}`,
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error(error.response?.data || error.message);

      return api.sendMessage(
        "❌ Failed to shorten link. Check token or URL.",
        event.threadID,
        event.messageID
      );
    }
  }
};
