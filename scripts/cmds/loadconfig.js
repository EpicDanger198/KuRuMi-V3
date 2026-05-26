const fs = require("fs-extra");

module.exports = {
	config: {
		name: "loadconfig",
		aliases: ["loadcf"],
		version: "1.4",
		author: "N1SA9",
		countDown: 5,
		role: 2,
		description: {
			vi: "Load lại config của bot",
			en: "Reload config of bot"
		},
		category: "owner",
		guide: "{pn}"
	},

	langs: {
		vi: {
			success: "Config đã được load lại thành công"
		},
		en: {
			success: "Config has been reloaded successfully"
		}
	},

	onStart: async function ({ message, getLang }) {
		global.KuRuMiV3.config = fs.readJsonSync(global.client.dirConfig);
		global.KuRuMiV3.configCommands = fs.readJsonSync(global.client.dirConfigCommands);
		message.reply(getLang("success"));
	}
};