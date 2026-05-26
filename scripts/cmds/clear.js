module.exports = {
  config: {
    name: "clear",
    aliases: ["dlt"],
    author: "N1SA9",
    version: "3.0",
    cooldowns: 5,
    role: 0,
    usePrefix: "awto",
    longDescription: {
      en: "unsent all messages sent by bot (fast)"
    },
    category: "owner",
    guide: {
      en: "{p}{n} [limit]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const pku = args.join(' ') || "Done ✅";
    const p = global.KuRuMiV3.config.mainAdmin || [];

    const threadInfo = await api.getThreadInfo(event.threadID);
    const adminIDs = threadInfo.adminIDs.map(e => e.id);

    if (!p.includes(event.senderID) && !adminIDs.includes(event.senderID)) {
      return api.sendMessage(pku, event.threadID);
    }

    const limit = parseInt(args[0]) || 50;
    let deleted = 0;
    let before = null;

    try {
      while (deleted < limit) {
        const messages = await api.getThreadHistory(event.threadID, 50, before);
        if (!messages.length) break;

        // 👉 filter bot messages
        const botMsgs = messages.filter(
          msg => msg.senderID == api.getCurrentUserID() && msg.messageID
        );

        // 👉 remaining needed
        const need = limit - deleted;
        const selected = botMsgs.slice(0, need);

        // ⚡ FAST DELETE (parallel)
        await Promise.all(
          selected.map(msg =>
            api.unsendMessage(msg.messageID).catch(() => null)
          )
        );

        deleted += selected.length;

        before = messages[messages.length - 1].timestamp;
      }

    } catch (e) {
      console.error("Fast Unsend Error:", e);
    }
  }
};
