const axios = require("axios");

const availableCmdsUrl = "https://noobs-api-team-url.vercel.app/N1SA9/availableCmds.json";
const cmdUrlsJson = "https://noobs-api-team-url.vercel.app/N1SA9/cmdUrls.json";

const ITEMS_PER_PAGE = 10;

module.exports.config = {
  name: "cmdstore",
  aliases: ["cs", "cmds"],
  author: "N1SA9",
  version: "6.9",
  role: 0,
  countDown: 3,
  category: "goatbot",
  description: {
    en: "Commands Store of Dipto"
  },
  guide: {
    en: "{pn} [command name | first letter | page number]"
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  try {

    const query = args.join(" ").trim().toLowerCase();

    const response = await axios.get(availableCmdsUrl);

    const cmds = response.data.cmdName || [];

    let finalArray = cmds;

    let page = 1;

    if (query) {

      if (!isNaN(query)) {
        page = parseInt(query);
      }

      else if (query.length === 1) {

        finalArray = cmds.filter(i => i.cmd.startsWith(query));

        if (!finalArray.length)
          return api.sendMessage(`❌ | No commands found starting with "${query}".`, event.threadID, event.messageID);
      }

      else {

        finalArray = cmds.filter(i => i.cmd.includes(query));

        if (!finalArray.length)
          return api.sendMessage(`❌ | Command "${query}" not found.`, event.threadID, event.messageID);
      }
    }

    const totalPages = Math.ceil(finalArray.length / ITEMS_PER_PAGE);

    if (page < 1 || page > totalPages)
      return api.sendMessage(`❌ | Invalid page number (1-${totalPages})`, event.threadID, event.messageID);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const cmdsToShow = finalArray.slice(startIndex, endIndex);

    let msg =
`╭───✦ Cmd Store ✦───╮\n
│ Page ${page}/${totalPages}\n
│ Total ${finalArray.length} Commands
│`;

    cmdsToShow.forEach((cmd, index) => {
      msg += `
\n│ ${startIndex + index + 1}. ${cmd.cmd}
\n│ Author : ${cmd.author}
\n│ Update : ${cmd.update || "N/A"}
\n│`;
    });

    msg += "╰─────────────⧕";

    if (page < totalPages)
      msg += `\nReply "${page + 1}" to see next page`;

    api.sendMessage(msg, event.threadID, (err, info) => {

      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        author: event.senderID,
        messageID: info.messageID,
        cmdName: finalArray,
        page: page
      });

    }, event.messageID);

  } catch (err) {

    console.log(err);

    api.sendMessage("❌ | Failed to retrieve commands.", event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ api, event, Reply }) {

  try {

    if (Reply.author != event.senderID)
      return api.sendMessage("⚠️ Not for you.", event.threadID, event.messageID);

    const number = parseInt(event.body);

    const startIndex = (Reply.page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    if (isNaN(number) || number < startIndex + 1 || number > endIndex)
      return api.sendMessage(`❌ | Reply with number ${startIndex + 1}-${Math.min(endIndex, Reply.cmdName.length)}`, event.threadID, event.messageID);

    const cmdName = Reply.cmdName[number - 1].cmd;
    const status = Reply.cmdName[number - 1].status || "unknown";

    const response = await axios.get(cmdUrlsJson);

    const selectedCmdUrl = response.data[cmdName];

    if (!selectedCmdUrl)
      return api.sendMessage("❌ | Command URL not found.", event.threadID, event.messageID);

    api.unsendMessage(Reply.messageID);

    const msg =
`╭───────⭓
│ Command : ${cmdName}
│ Status  : ${status}
│
│ URL :
${selectedCmdUrl}
╰─────────────⭓`;

    api.sendMessage(msg, event.threadID, event.messageID);

  } catch (err) {

    console.log(err);

    api.sendMessage("❌ | Failed to retrieve command URL.", event.threadID, event.messageID);
  }
};
