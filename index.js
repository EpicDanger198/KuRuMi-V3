const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let botProcess;
let logs = [];

// Default login credentials
const USERNAME = "admin";
const PASSWORD = "admin123";

// -------- START BOT --------
function startBot() {
    botProcess = spawn("node", ["Goat.js"], {
        cwd: __dirname,
        shell: true
    });

    botProcess.stdout.on("data", (data) => {
        let log = data.toString();
        console.log(log);
        logs.push(log);
    });

    botProcess.stderr.on("data", (data) => {
        let log = data.toString();
        console.log(log);
        logs.push(log);
    });
}

startBot();

// -------- LOGIN PAGE (DEFAULT ROOT) --------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// -------- FORCE LOGIN FOR OTHER ROUTES --------
app.use((req, res, next) => {
    const allowed = ["/", "/api/login"];
    if (allowed.includes(req.path)) return next();

    // Prevent /login.html direct access
    if (req.path === "/login.html") return res.redirect("/");

    next();
});

// -------- DASHBOARD --------
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -------- APPSTATE --------
app.get("/appstate", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "appstate.html"));
});

// -------- LOGIN API --------
app.post("/api/login", (req, res) => {
    let { username, password } = req.body;

    if (username === USERNAME && password === PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// -------- BOT STATUS --------
app.get("/api/status", (req, res) => {
    if (botProcess) {
        res.json({ status: "Online 🟢" });
    } else {
        res.json({ status: "Offline 🔴" });
    }
});

// -------- RESTART BOT --------
app.get("/api/restart", (req, res) => {
    if (botProcess) botProcess.kill();
    startBot();
    res.json({ message: "Bot Restarted 🔄" });
});

// -------- LOGS --------
app.get("/api/logs", (req, res) => {
    res.json({ logs: logs.slice(-50) });
});

// -------- APPSTATE SAVE --------
app.post("/api/appstate", (req, res) => {
    const { appstate } = req.body;
    if (!appstate) return res.status(400).json({ error: "Appstate is required" });

    fs.writeFile('account.txt', appstate, (err) => {
        if (err) return res.status(500).json({ error: "Failed to save appstate" });

        fs.readFile('account.txt', 'utf8', (readErr, data) => {
            if (readErr || !data) return res.status(500).json({ error: "Failed to verify appstate" });
            res.json({ success: true });
            console.log("Restarting system after appstate update...");
            setTimeout(() => process.exit(2), 1000);
        });
    });
});

// -------- STATS API --------
app.get("/api/stats", (req, res) => {
    const os = require('os');
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    res.json({
        cpu: (os.loadavg()[0] * 100 / os.cpus().length).toFixed(2),
        memoryUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        memoryTotal: Math.round(os.totalmem() / 1024 / 1024),
        freeMem: Math.round(os.freemem() / 1024 / 1024),
        uptime: `${hours}h ${minutes}m`,
        platform: os.platform(),
        nodeVersion: process.version,
        arch: os.arch(),
        cpuCores: os.cpus().length
    });
});

// -------- FORCE BOT RESTART (POST) --------
app.post("/api/restart", (req, res) => {
    res.json({ message: "Bot is restarting..." });
    setTimeout(() => process.exit(2), 1000);
});

// -------- START SERVER --------
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dashboard running on port ${PORT}`);
});
