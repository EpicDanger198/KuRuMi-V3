module.exports.config = {
  name: "autotimer",
  aliases: ["time", "atime", "automsg", "auto"],
  version: "6.0",
  role: 0,
  author: "N1SA9",
  description: "Hourly auto message with English control + Bangla random",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onStart = async function ({ threadsData, event, message, args }) {
  const threadID = event.threadID;
  const cmd = args[0]?.toLowerCase();

  if (cmd === "on") {
    await threadsData.set(threadID, true, "data.autotimer");
    return message.reply("✅ Autotimer has been ENABLED");
  }

  if (cmd === "off") {
    await threadsData.set(threadID, false, "data.autotimer");
    return message.reply("❌ Autotimer has been DISABLED");
  }

  return message.reply("Usage:\nautotimer on\nautotimer off");
};

module.exports.onLoad = async ({ api, threadsData }) => {

  // ⏰ HOURLY MAIN MESSAGES (ENGLISH)
  const timeData = {
    0: ["🌙 Midnight - Time to sleep 😴"],
    1: ["🌜 1 AM - Late night calm"],
    2: ["🌜 2 AM - Rest your body"],
    3: ["🌌 Deep night silence"],
    4: ["🌅 Early morning coming"],
    5: ["🌅 Wake up soon"],
    6: ["🌅 Good morning ☀️"],
    7: ["📚 Start your day now"],
    8: ["📚 Study / Work time"],
    9: ["🎯 Stay focused"],
    10: ["☕ Coffee break"],
    11: ["🔥 Keep going strong"],
    12: ["🍛 Lunch time"],
    13: ["🌞 Afternoon starts"],
    14: ["⚡ Stay productive"],
    15: ["☕ Tea break"],
    16: ["🌇 Evening is near"],
    17: ["🌇 Sunset time"],
    18: ["🌤 Evening vibes"],
    19: ["🌙 Relax time"],
    20: ["🌙 Chill mode"],
    21: ["😴 Get ready to sleep"],
    22: ["💤 Sleep soon"],
    23: ["🌙 End of the day"]
  };

  // 🎲 RANDOM MESSAGES (BANGLA ONLY)
  const randomMsgs = [
    "🌿 শান্ত থাকো, সব ঠিক হয়ে যাবে ইনশাআল্লাহ",
    "💪 আজকের পরিশ্রমই তোমার ভবিষ্যৎ তৈরি করবে",
    "🔥 হার মানা কখনো অপশন না",
    "✨ নিজের লক্ষ্য ভুলে যেও না",
    "😌 একটু থেমে আবার শক্ত হয়ে ফিরে এসো",
    "📚 প্রতিদিন নিজেকে একটু হলেও উন্নত করো",
    "🌟 তুমি চাইলে সবকিছুই সম্ভব",
    "🚀 ছোট ছোট চেষ্টা বড় সাফল্য আনে",
    "💖 নিজের উপর ভরসা রাখো সবসময়"
  ];

  const run = async () => {
    try {

      const now = new Date(Date.now() + 21600000);
      const hour = now.getHours();
      const minute = now.getMinutes();

      // ⏰ ONLY RUN AT START OF HOUR
      if (minute === 0) {

        const mainMsg = timeData[hour];

        if (mainMsg) {

          const threads = await api.getThreadList(100, null, ["INBOX"]);
          const groups = threads.filter(t => t.isGroup);

          for (const group of groups) {

            // 💾 DB CHECK (ON/OFF)
            const status = await threadsData.get(group.threadID, "data.autotimer");
            if (status === false) continue;

            // 🎲 RANDOM 1–2 BANGLA MSG
            const count = Math.floor(Math.random() * 2) + 1;

            const extra = randomMsgs
              .sort(() => 0.5 - Math.random())
              .slice(0, count);

            const finalMessage = [mainMsg[0], ...extra].join("\n");

            await api.sendMessage(finalMessage, group.threadID);
          }
        }
      }

    } catch (e) {
      console.log("Autotimer error:", e);
    }

    setTimeout(run, 60 * 1000);
  };

  run();
};

module.exports.onChat = () => {};
