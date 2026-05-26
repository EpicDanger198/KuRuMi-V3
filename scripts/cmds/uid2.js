module.exports = {
  config: {
    name: "uid2",
    version: "1.0.0",
    permission: 0,
    credits: "N1SA9",
    usePrefix: "awto",
    description: "Get user ID + share contact",
    category: "info",
    cooldowns: 5
  },

  onStart: async function ({ api, event, usersData }) {
    let uid;

    // Get user ID
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions || {}).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      uid = event.senderID;
    }

    try {
      // Get name
      let name = await usersData.getName(uid);

      const msg = `▶️ 𝐍𝐚𝐦𝐞: ${name}\n▶️ 𝐈𝐃: ${uid}`;

      // Share contact (if supported by API)
      await api.shareContact(msg, uid, event.threadID);

      // Get avatar
      let avt = await usersData.getAvatarUrl(uid);

      if (!avt) {
        throw new Error("Avatar not found");
      }

      const attachment = await global.utils.getStreamFromURL(avt);

      if (!attachment) {
        throw new Error("Failed to fetch avatar");
      }

      // Send avatar image
      await api.sendMessage(
        { body: "", attachment },
        event.threadID
      );

      // Success message
      api.sendMessage(
        "✅ Contact shared successfully.",
        event.threadID,
        event.messageID
      );

    } catch (error) {
      api.sendMessage(
        "❌ Error: " + error.message,
        event.threadID,
        event.messageID
      );
    }
  }
};
