const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "pastebin",
    aliases: ["bin"],
    version: "1.2",
    author: "N1SA9",
    role: 4,
    usePrefix: "awto",
    cooldowns: 5,
    shortDescription: "Upload file to Pastebin",
    longDescription: "Upload cmd file to Pastebin and get link",
    category: "owner",
    guide: "{p}{n} <filename>"
  },

  onStart: async function ({ api, event, args }) {
    const adminList = global.KuRuMiV3.config.mainAdmin || [];

    if (!adminList.includes(event.senderID)) {
      return api.sendMessage("❌ Permission denied", event.threadID, event.messageID);
    }

    const apiKey = global.KuRuMiV3.config.api_dev_key;

    if (!apiKey) {
      return api.sendMessage("❌ API key not found in config!", event.threadID);
    }

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage("⚠️ Please provide file name", event.threadID);
    }

    const filePath = fs.existsSync(path.join(__dirname, '..', 'cmds', fileName))
      ? path.join(__dirname, '..', 'cmds', fileName)
      : fs.existsSync(path.join(__dirname, '..', 'cmds', fileName + '.js'))
        ? path.join(__dirname, '..', 'cmds', fileName + '.js')
        : null;

    if (!filePath) {
      return api.sendMessage("❌ File not found!", event.threadID);
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');

      const response = await axios.post(
        "https://pastebin.com/api/api_post.php",
        new URLSearchParams({
          api_option: "paste",
          api_dev_key: apiKey,
          api_user_key: "",
          api_paste_code: fileContent,
          api_paste_private: "1",
          api_paste_name: fileName,
          api_paste_expire_date: "10M",
          api_paste_format: "javascript"
        })
      );

      const link = response.data;

      if (!link || !link.includes("pastebin.com")) {
        return api.sendMessage("❌ Upload failed!", event.threadID);
      }

      const rawLink = link.replace("pastebin.com", "pastebin.com/raw");

      return api.sendMessage(`📦 Pastebin Link:\n${rawLink}`, event.threadID);

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ Error uploading file!", event.threadID);
    }
  }
};
