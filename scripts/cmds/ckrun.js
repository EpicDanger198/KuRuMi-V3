const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");
const axios = require("axios");

module.exports = {
  config: {
    name: "checkrun",
    aliases: ["cr", "ckr", "ckrun","deployinfo"],
    version: "6.0",
    author: "N1SA9 EDITZ (PRO MAX)",
    countDown: 5,
    role: 0,
    usePrefix: "awto",
    category: "system",
    guide: "{p}checkrun"
  },

  onStart: async function ({ message, api, event }) {
    try {
      const startTime = Date.now();
      api.setMessageReaction("⚡", event.messageID, () => {}, true);

      const userImgUrl = "https://files.catbox.moe/bsfzt4.jpg";

      // 🔗 BOT URL (EDIT THIS)
      const BOT_URL = "kuruami-v3-production.up.railway.app";

      // 🌍 SERVER STATUS
      let serverStatus = "Offline";
      let statusColor = "#ff0000";

      try {
        const res = await axios.get(BOT_URL, { timeout: 5000 });
        if (res.status === 200) {
          serverStatus = "Online";
          statusColor = "#00ff00";
        }
      } catch (e) {
        serverStatus = "Offline";
      }

      // 🌐 HOST DETECT
      let hostName = "Local PC / Unknown";
      if (process.env.RENDER_EXTERNAL_URL) hostName = "Render Cloud";
      else if (process.env.VERCEL_URL) hostName = "Vercel Hosting";
      else if (process.env.HEROKU_APP_NAME) hostName = "Heroku Cloud";
      else if (process.env.REPL_ID) hostName = "Replit Server";

      // ⏳ UPTIME
      const uptime = process.uptime();
      const d = Math.floor(uptime / 86400);
      const h = Math.floor((uptime % 86400) / 3600);
      const m = Math.floor((uptime % 3600) / 60);

      // 📊 RAM + CPU
      const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const cpu = process.cpuUsage().user / 1000;

      // 📡 PING
      const ping = Date.now() - startTime;

      // 🎨 CANVAS
      const canvas = Canvas.createCanvas(1100, 650);
      const ctx = canvas.getContext("2d");

      // BG
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 🌈 GRADIENT BORDER
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#00f0ff");
      gradient.addColorStop(0.5, "#ff00ff");
      gradient.addColorStop(1, "#00ff88");

      ctx.strokeStyle = gradient;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 30;
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 1060, 610);
      ctx.shadowBlur = 0;

      // 💠 GLASS EFFECT
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(40, 40, 1020, 570);

      // HEADER
      ctx.fillStyle = "#00f0ff";
      ctx.font = "bold 48px Arial";
      ctx.fillText("KuRuMi - V3 BOT DEPLOY INFO", 70, 100);

      // STAT FUNCTION
      const drawStat = (y, icon, label, val, color) => {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = color;
        ctx.font = "bold 32px Arial";
        ctx.fillText(`${icon} ${label}:`, 90, y);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(val, 350, y);
      };

      drawStat(170, "🌐", "Host", hostName, "#00f0ff");
      drawStat(230, "⏳", "Uptime", `${d}d ${h}h ${m}m`, "#00ff88");
      drawStat(290, "📊", "RAM", `${ram} MB`, "#ff4d4d");
      drawStat(350, "🧠", "CPU", `${cpu.toFixed(2)} ms`, "#00ffff");
      drawStat(410, "📡", "Ping", `${ping} ms`, "#ff00ff");

      // 🌍 LIVE SERVER
      drawStat(470, "🌍", "Server", serverStatus, statusColor);

      drawStat(530, "📦", "Node", process.version, "#aa00ff");

      // 🖼 AVATAR
      try {
        const avatar = await Canvas.loadImage(userImgUrl);

        ctx.save();
        ctx.beginPath();
        ctx.arc(850, 320, 140, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, 710, 180, 280, 280);
        ctx.restore();

        ctx.strokeStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 25;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(850, 320, 150, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

      } catch (e) {}

      // FOOTER
      ctx.fillStyle = "#00ff88";
      ctx.font = "italic bold 24px Arial";
      ctx.fillText("Power by: NiSaN & KuRuMi V3 BOT", 90, 610);

      // SAVE IMAGE
      const pathImg = path.join(__dirname, "cache", `check_${event.senderID}.png`);
      fs.writeFileSync(pathImg, canvas.toBuffer());

      // ✅ SEND + AUTO UNSEND
      return message.reply({
        attachment: fs.createReadStream(pathImg)
      }, (err, info) => {
        fs.unlinkSync(pathImg);

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 10000); // 10 sec
      });

    } catch (err) {
      console.log(err);
      message.reply("❌ Error generating panel!");
    }
  }
};
