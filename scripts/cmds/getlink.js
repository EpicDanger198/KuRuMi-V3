const axios = require("axios");

module.exports = {
  config: {
    name: "getlink",
    aliases: ["tinyurl"],
    version: "1.1",
    author: "N1SA9",
    role: 0,
    usePrefix: "awto" ,
    countDown: 3,
    shortDescription: "Get download links from attachments",
    longDescription: "Convert replied media links into short URLs",
    category: "utility",
    guide: "{pn} reply to media"
  },

  onStart: async function ({ api, event }) {
    const { messageReply, threadID, messageID } = event;

    if (event.type !== "message_reply") {
      return api.sendMessage(
        "❌ Please reply to an image, video, or audio!",
        threadID,
        messageID
      );
    }

    if (
      !messageReply ||
      !messageReply.attachments ||
      messageReply.attachments.length === 0
    ) {
      return api.sendMessage(
        "❌ No attachments found in replied message!",
        threadID,
        messageID
      );
    }

    try {
      let msg = `📎 Found ${messageReply.attachments.length} file(s):\n\n`;

      for (let i = 0; i < messageReply.attachments.length; i++) {
        const fileUrl = messageReply.attachments[i].url;

        try {
          const res = await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(fileUrl)}`
          );

          msg += `${i + 1}. ${res.data}\n`;
        } catch {
          msg += `${i + 1}. ❌ Failed to shorten\n`;
        }
      }

      return api.sendMessage(msg, threadID, messageID);

    } catch (err) {
      return api.sendMessage(
        "❌ Error processing attachments!",
        threadID,
        messageID
      );
    }
  }
};
