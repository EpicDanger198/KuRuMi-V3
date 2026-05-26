module.exports = {
  config: {
    name: "binary",
    version: "1.1",
    author: "N1SAO",
    role: 0,
    usePrefix: "awto",
    countDown: 0,
    shortDescription: {
      en: "Convert text ↔ binary"
    },
    longDescription: {
      en: "Encode text to binary and decode binary to text"
    },
    category: "study",
    guide: {
      en: "{pn} encode <text>\n{pn} decode <binary>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args[0] || !args[1]) {
      return api.sendMessage("❌ Use: binary encode <text> OR binary decode <binary>", threadID, messageID);
    }

    const type = args[0].toLowerCase();
    const input = args.slice(1).join(" ");

    // ENCODE
    const encode = (text) => {
      return Array.from(text)
        .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
    };

    // DECODE
    const decode = (binary) => {
      try {
        return binary
          .split(" ")
          .map(b => String.fromCharCode(parseInt(b, 2)))
          .join("");
      } catch (e) {
        return "❌ Invalid binary input!";
      }
    };

    if (type === "encode" || type === "en") {
      return api.sendMessage(`📦 Binary:\n${encode(input)}`, threadID, messageID);
    }

    if (type === "decode" || type === "de") {
      return api.sendMessage(`📦 Text:\n${decode(input)}`, threadID, messageID);
    }

    return api.sendMessage("❌ Invalid type! use encode/decode", threadID, messageID);
  }
};
