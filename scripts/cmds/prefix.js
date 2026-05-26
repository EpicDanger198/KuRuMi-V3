const axios = require("axios");

module.exports = {
  config: {
    name: "prefix",
    version: "4.0",
    author: "N1SA9",
    countDown: 5,
    role: 0,
    category: "TOOLS"
  },

  // =========================
  // 🧠 PREFIX CONTROL PANEL
  // =========================
  onStart: async function ({ args, threadsData, event, message }) {

    const threadID = event.threadID;

    const first = args[0]?.toLowerCase();
    const second = args[1]?.toLowerCase();

    // =========================
    // 👤 IMAGE TOGGLE (USER)
    // =========================
    if (first === "-i" || first === "-image") {

      if (second === "on") {
        await threadsData.set(threadID, true, "data.prefixImage");
        return message.reply("✅ Image preview ENABLED");
      }

      if (second === "off") {
        await threadsData.set(threadID, false, "data.prefixImage");
        return message.reply("❌ Image preview DISABLED");
      }

      return message.reply("Usage:\nprefix -i on\nprefix -i off");
    }

    // =========================
    // 👑 MODE CONTROL (ADMIN ONLY)
    // =========================
    if (first === "-mode") {

      const mode = second;

      if (!mode || !["on", "off", "false", "awto"].includes(mode)) {
        return message.reply(
          "⚙️ ADMIN MODE SYSTEM\n\n" +
          "👉 prefix -mode on\n" +
          "👉 prefix -mode off\n" +
          "👉 prefix -mode false\n" +
          "👉 prefix -mode awto"
        );
      }

      let value;
      if (mode === "on") value = true;
      else if (mode === "off" || mode === "false") value = false;
      else value = "awto";

      await threadsData.set(threadID, {
        prefixMode: value
      });

      return message.reply(`✅ Prefix mode updated: ${mode.toUpperCase()}`);
    }

    return message.reply(
      "⚙️ PREFIX SYSTEM\n\n" +
      "USER:\nprefix -i on\nprefix -i off\n\n" +
      "ADMIN:\nprefix -mode on\nprefix -mode off\nprefix -mode awto"
    );
  },

  // =========================
  // 💬 CHAT ENGINE (REAL CONTROL)
  // =========================
  onChat: async function ({ event, message, threadsData, usersData }) {

    const { threadID, body } = event;
    if (!body) return;

    const text = body.toLowerCase();

    // =========================
    // 📌 GET MODE
    // =========================
    const data = await threadsData.get(threadID) || {};
    const mode = data.prefixMode;

    // =========================
    // 🚫 PREFIX ENGINE CONTROL
    // =========================

    // ON MODE → prefix required
    if (mode === true) {
      if (!text.startsWith(global.KuRuMiV3.config.prefix)) return;
    }

    // OFF MODE → no prefix needed (allow all commands)
    if (mode === false) {
      // allow everything
    }

    // AWTO MODE → smart check
    if (mode === "awto") {
      // if message looks like command OR starts with prefix
      const isCmd = text.startsWith(global.KuRuMiV3.config.prefix);
      const isLikelyCmd = /^[a-z0-9]+/i.test(text);

      if (!isCmd && !isLikelyCmd) return;
    }

    // =========================
    // 💬 PREFIX INFO MESSAGE
    // =========================
    if (text === "prefix") {

      const imageEnabled = await threadsData.get(threadID, "data.prefixImage") || false;

      const adminID = global.KuRuMiV3.config.adminBot?.[0];
      const adminData = await usersData.get(adminID);

      const msg =
`• ${global.KuRuMiV3.config.nickNameBot}
• Prefix: ${global.KuRuMiV3.config.prefix}
• Mode: ${mode || "DEFAULT"}
• Admin: ${adminData?.name || "Admin"}
• Have a great day!
• Admin: https://www.facebook.com/profile.php?id=${adminID}`;

      if (imageEnabled) {

        const res = await axios({
          method: "GET",
          url: "https://files.catbox.moe/7pl10a.jpg",
          responseType: "stream"
        });

        return message.reply({
          body: msg,
          attachment: res.data
        });

      } else {
        return message.reply(msg);
      }
    }
  }
};
