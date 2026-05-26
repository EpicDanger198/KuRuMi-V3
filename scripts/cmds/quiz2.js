const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://noobs-api-team-url.vercel.app/N1SA9/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "quiz2",
    aliases: ["qz2", "quiz2"], // ✅ fixed
    version: "1.1",
    author: "Dipto (Fixed by N1SA9 😏)",
    countDown: 0,
    role: 0,
    usePrefix: "awto",
    category: "game",
    guide: "{p}quiz\n{p}quiz bn\n{p}quiz en",
  },

  onStart: async function ({ api, event, usersData, args }) {
    const input = (args[0] || "bn").toLowerCase(); // ✅ fixed
    let timeout = 300;
    let category = "bangla";

    if (input === "bn" || input === "bangla") {
      category = "bangla";
    } else if (input === "en" || input === "english") {
      category = "english";
    }

    try {
      const response = await axios.get(
        `${await baseApiUrl()}/quiz?category=${category}&q=random`
      );

      const quizData = response.data.question;
      const { question, correctAnswer, options } = quizData;
      const { a, b, c, d } = options;

      const namePlayer = await usersData.getName(event.senderID);

      const quizMsg = {
        body:
          `╭──『 QUIZ TIME 』──✦\n` +
          `│\n` +
          `│ 🧠 ${question}\n` +
          `│\n` +
          `│ 🅐 ${a}\n` +
          `│ 🅑 ${b}\n` +
          `│ 🅒 ${c}\n` +
          `│ 🅓 ${d}\n` +
          `│\n` +
          `╰─➤ Reply with A / B / C / D`,
      };

      api.sendMessage(
        quizMsg,
        event.threadID,
        (error, info) => {
          if (error) return console.error(error);

          global.KuRuMiV3.onReply.set(info.messageID, {
            type: "reply",
            commandName: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            correctAnswer: correctAnswer,
            nameUser: namePlayer,
            attempts: 0
          });

          // ⏱️ auto unsend after 5 min
          setTimeout(() => {
            api.unsendMessage(info.messageID).catch(() => {});
          }, timeout * 1000);
        },
        event.messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Quiz API Error!", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { correctAnswer, nameUser, author } = Reply;

    if (event.senderID !== author) {
      return api.sendMessage(
        "⚠️ | This is not your quiz!",
        event.threadID,
        event.messageID
      );
    }

    const maxAttempts = 2;
    let userReply = event.body.trim().toLowerCase();

    // normalize answer (A/B/C/D)
    const map = {
      a: "a",
      b: "b",
      c: "c",
      d: "d"
    };

    userReply = map[userReply] || userReply;

    if (Reply.attempts >= maxAttempts) {
      await api.unsendMessage(Reply.messageID).catch(() => {});
      return api.sendMessage(
        `🚫 | ${nameUser}, attempts finished!\n✅ Correct Answer: ${correctAnswer}`,
        event.threadID,
        event.messageID
      );
    }

    if (userReply === correctAnswer.toLowerCase()) {
      await api.unsendMessage(Reply.messageID).catch(() => {});

      let rewardCoins = 3000;
      let rewardExp = 105;

      let userData = await usersData.get(author);

      await usersData.set(author, {
        money: (userData.money || 0) + rewardCoins,
        exp: (userData.exp || 0) + rewardExp,
        data: userData.data,
      });

      return api.sendMessage(
        `🎉 ${nameUser} Correct!\n\n💰 +${rewardCoins} Coins\n✨ +${rewardExp} EXP`,
        event.threadID,
        event.messageID
      );
    } else {
      Reply.attempts += 1;
      global.KuRuMiV3.onReply.set(Reply.messageID, Reply);

      return api.sendMessage(
        `❌ Wrong Answer!\n🔁 Attempts left: ${maxAttempts - Reply.attempts}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
