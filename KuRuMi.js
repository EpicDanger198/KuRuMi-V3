/** * @author NiSaN *! The source code is written by NiSaN, please don't change the author's name everywhere. Thank you for using * English: *! Please do not change the below code, it is very important for the project. * It is my motivation to maintain and develop the project for free. *! If you change it, you will be banned forever * Thank you for using * */
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

// ========= Log Buffer (last 300 lines) =========
const logBuffer = [];
const _origLog = console.log;
const _origErr = console.error;
function pushLog(args) {
    const line = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ').replace(/\x1B\[[0-9;]*m/g, '');
    if (line.trim()) logBuffer.push({ t: Date.now(), msg: line });
    if (logBuffer.length > 300) logBuffer.shift();
}
console.log = (...args) => { pushLog(args); _origLog(...args); };
console.error = (...args) => { pushLog(args); _origErr(...args); };
const axios = require("axios");
const fs = require("fs-extra");
const google = require("googleapis").google;
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;
const { execSync } = require('child_process');
const log = require('./logger/log.js');
const path = require("path");
process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

// ========= FIX 1: APPSTATE ENV থেকে Load করো =========
if (process.env.APPSTATE) {
                try {
                                fs.writeFileSync('./account.txt', process.env.APPSTATE);
                                log.info("APPSTATE", "Loaded appstate from Railway ENV");
                } catch (e) {
                                log.error("APPSTATE", "Failed to write account.txt from ENV");
                }
}
// ========= FIX 1 END =========

function validJSON(pathDir) {
                try {
                                if (!fs.existsSync(pathDir)) throw new Error(`File "${pathDir}" not found`);
                                execSync(`npx jsonlint "${pathDir}"`, { stdio: 'pipe' });
                                return true;
                } catch (err) {
                                let msgError = err.message;
                                msgError = msgError.split("\n").slice(1).join("\n");
                                const indexPos = msgError.indexOf(" at");
                                msgError = msgError.slice(0, indexPos!= -1? indexPos - 1 : msgError.length);
                                throw new Error(msgError);
                }
}

const { NODE_ENV } = process.env;
const dirConfig = path.normalize(`${__dirname}/config.json`);
const dirConfigCommands = path.normalize(`${__dirname}/configCommands.json`);
const dirAccount = path.normalize(`${__dirname}/account.txt`);

for (const pathDir of [dirConfig, dirConfigCommands]) {
                try {
                                validJSON(pathDir);
                } catch (err) {
                                log.error("CONFIG", `Invalid JSON file "${pathDir.replace(__dirname, "")}":\n${err.message.split("\n").map(line => ` ${line}`).join("\n")}\nPlease fix it and restart bot`);
                                process.exit(2);
                }
}

const config = require(dirConfig);
if (config.whiteListMode?.whiteListIds && Array.isArray(config.whiteListMode.whiteListIds)) config.whiteListMode.whiteListIds = config.whiteListMode.whiteListIds.map(id => id.toString());
const configCommands = require(dirConfigCommands);

global.KuRuMiV3 = {
                startTime: Date.now() - process.uptime() * 1000,
                commands: new Map(),
                eventCommands: new Map(),
                commandFilesPath: [],
                eventCommandsFilesPath: [],
                aliases: new Map(),
                onFirstChat: [],
                onEvent: [],
                onReply: new Map(),
                onReaction: new Map(),
                onAnyEvent: [],
                config,
                configCommands,
                envCommands: {},
                envEvents: {},
                envGlobal: {},
                reLoginBot: function () { },
                Listening: null,
                oldListening: [],
                callbackListenTime: {},
                storage5Message: [],
                fcaApi: null,
                botID: null
};

global.db = {
                allThreadData: [],
                allUserData: [],
                allDashBoardData: [],
                allGlobalData: [],
                threadModel: null,
                userModel: null,
                dashboardModel: null,
                globalModel: null,
                threadsData: null,
                usersData: null,
                dashBoardData: null,
                globalData: null,
                receivedTheFirstMessage: {}
};

global.client = {
                dirConfig,
                dirConfigCommands,
                dirAccount,
                countDown: {},
                cache: {},
                database: {
                                creatingThreadData: [],
                                creatingUserData: [],
                                creatingDashBoardData: [],
                                creatingGlobalData: []
                },
                commandBanned: configCommands.commandBanned
};

const utils = require("./utils.js");
global.utils = utils;
const { colors } = utils;

global.temp = {
                createThreadData: [],
                createUserData: [],
                createThreadDataError: [],
                filesOfGoogleDrive: {
                                arraybuffer: {},
                                stream: {},
                                fileNames: {}
                },
                contentScripts: {
                                cmds: {},
                                events: {}
                }
};

const watchAndReloadConfig = (dir, type, prop, logName) => {
                let lastModified = fs.statSync(dir).mtimeMs;
                let isFirstModified = true;
                fs.watch(dir, (eventType) => {
                                if (eventType === type) {
                                                const oldConfig = global.KuRuMiV3[prop];
                                                setTimeout(() => {
                                                                try {
                                                                                if (isFirstModified) {
                                                                                                isFirstModified = false;
                                                                                                return;
                                                                                }
                                                                                if (lastModified === fs.statSync(dir).mtimeMs) return;
                                                                                global.KuRuMiV3[prop] = JSON.parse(fs.readFileSync(dir, 'utf-8'));
                                                                                log.success(logName, `Reloaded ${dir.replace(process.cwd(), "")}`);
                                                                } catch (err) {
                                                                                log.warn(logName, `Can't reload ${dir.replace(process.cwd(), "")}`);
                                                                                global.KuRuMiV3[prop] = oldConfig;
                                                                } finally {
                                                                                lastModified = fs.statSync(dir).mtimeMs;
                                                                }
                                                }, 200);
                                }
                });
};

watchAndReloadConfig(dirConfigCommands, 'change', 'configCommands', 'CONFIG COMMANDS');
watchAndReloadConfig(dirConfig, 'change', 'config', 'CONFIG');

global.KuRuMiV3.envGlobal = global.KuRuMiV3.configCommands.envGlobal;
global.KuRuMiV3.envCommands = global.KuRuMiV3.configCommands.envCommands;
global.KuRuMiV3.envEvents = global.KuRuMiV3.configCommands.envEvents;

const getText = global.utils.getText;

if (config.autoRestart) {
                const time = config.autoRestart.time;
                if (!isNaN(time) && time > 0) {
                                utils.log.info("AUTO RESTART", getText("Goat", "autoRestart1", utils.convertTime(time, true)));
                                setTimeout(() => {
                                                utils.log.info("AUTO RESTART", "Restarting...");
                                                process.exit(2);
                                }, time);
                } else if (typeof time == "string" && time.match(/^((((\d+,)+\d+|(\d+(\/|-|#)\d+)|\d+L?|\*(\/\d+)?|L(-\d+)?|\?|[A-Z]{3}(-[A-Z]{3})?)?){5,7})$/gmi)) {
                                utils.log.info("AUTO RESTART", getText("Goat", "autoRestart2", time));
                                const cron = require("node-cron");
                                cron.schedule(time, () => {
                                                utils.log.info("AUTO RESTART", "Restarting...");
                                                process.exit(2);
                                });
                }
}

(async () => {
                const { gmailAccount } = config.credentials;
                const { email, clientId, clientSecret, refreshToken } = gmailAccount;
                const OAuth2 = google.auth.OAuth2;
                const OAuth2_client = new OAuth2(clientId, clientSecret);
                OAuth2_client.setCredentials({ refresh_token: refreshToken });
                let accessToken;
                try {
                                accessToken = await OAuth2_client.getAccessToken();
                } catch (err) {
                                throw new Error(getText("Goat", "googleApiTokenExpired"));
                }
                const transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                service: 'Gmail',
                                auth: {
                                                type: 'OAuth2',
                                                user: email,
                                                clientId,
                                                clientSecret,
                                                refreshToken,
                                                accessToken
                                }
                });
                async function sendMail({ to, subject, text, html, attachments }) {
                                const mailOptions = {
                                                from: email,
                                                to,
                                                subject,
                                                text,
                                                html,
                                                attachments
                                };
                                return await transporter.sendMail(mailOptions);
                }
                global.utils.sendMail = sendMail;
                global.utils.transporter = transporter;
                const { data: { version } } = await axios.get("https://raw.githubusercontent.com/EpicDanger198/KuRuMi-V3/main/package.json");
                const currentVersion = require("./package.json").version;
                if (compareVersion(version, currentVersion) === 1) utils.log.master("NEW VERSION", getText( "Goat", "newVersionDetected", colors.gray(currentVersion), colors.hex("#eb6a07", version), colors.hex("#eb6a07", "node update") ));
                const parentIdGoogleDrive = await utils.drive.checkAndCreateParentFolder("KuRuMiV3");
                utils.drive.parentID = parentIdGoogleDrive;
                require(`./bot/login/login.js`);
})();

function compareVersion(version1, version2) {
                const v1 = version1.split(".");
                const v2 = version2.split(".");
                for (let i = 0; i < 3; i++) {
                                if (parseInt(v1[i]) > parseInt(v2[i])) return 1;
                                if (parseInt(v1[i]) < parseInt(v2[i])) return -1;
                }
                return 0;
}

// ------------------- API ROUTES ------------------- //
app.get("/api/stats", (req, res) => {
                const os = require('os');
                const uptime = Math.floor(process.uptime());
                const days    = Math.floor(uptime / 86400);
                const hours   = Math.floor((uptime % 86400) / 3600);
                const minutes = Math.floor((uptime % 3600) / 60);
                const seconds = uptime % 60;
                const uptimeStr = days > 0
                    ? `${days}d ${hours}h ${minutes}m`
                    : `${hours}h ${minutes}m ${seconds}s`;

                const mem = process.memoryUsage();
                const cpus = os.cpus();
                // Calculate real CPU usage from os.cpus() idle vs total ticks
                let totalIdle = 0, totalTick = 0;
                cpus.forEach(c => {
                    for (const t in c.times) totalTick += c.times[t];
                    totalIdle += c.times.idle;
                });
                const cpuPercent = Math.min(100, ((1 - totalIdle / totalTick) * 100)).toFixed(1);

                res.json({
                    cpu:          cpuPercent,
                    memUsedBytes: mem.rss,           // total process RAM in bytes
                    memHeapBytes: mem.heapUsed,      // heap only
                    memTotalBytes: os.totalmem(),    // system total RAM bytes
                    memFreeBytes:  os.freemem(),     // system free RAM bytes
                    uptimeStr,
                    uptimeSecs: uptime,
                    platform:    os.platform() === 'linux' ? 'Linux' : os.platform() === 'win32' ? 'Windows' : os.platform() === 'darwin' ? 'macOS' : os.platform(),
                    nodeVersion: process.version,
                    arch:        os.arch(),
                    cpuCores:    cpus.length,
                    cpuModel:    cpus[0]?.model?.split('@')[0]?.trim() || 'Unknown'
                });
});

app.post("/api/restart", (req, res) => {
                res.json({ message: "Bot is restarting..." });
                setTimeout(() => process.exit(2), 1000);
});

app.get("/api/logs", (req, res) => {
    res.json({ logs: logBuffer.slice(-100).map(l => l.msg) });
});

app.post("/api/appstate", (req, res) => {
                const { appstate } = req.body;
                if (!appstate) return res.status(400).json({ error: "Appstate is required" });
                fs.writeFile('account.txt', appstate, (err) => {
                                if (err) return res.status(500).json({ error: "Failed to save appstate" });
                                fs.readFile('account.txt', 'utf8', (readErr, data) => {
                                                if (readErr ||!data) return res.status(500).json({ error: "Failed to verify appstate" });
                                                res.json({ success: true });
                                                log.info("Restarting system after appstate update...");
                                                setTimeout(() => process.exit(2), 1000);
                                });
                });
});

// ========= Auth Middleware =========
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const AUTH_TOKEN = "kurumi_auth_" + Math.random().toString(36).slice(2);
const activeSessions = new Set();

function isAuthenticated(req) {
    const token = req.cookies && req.cookies.dash_token;
    return token && activeSessions.has(token);
}

// ========= Login / Logout API =========
app.get('/login', (req, res) => {
    if (isAuthenticated(req)) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const cfg = require(dirConfig);
    const dashAuth = cfg.dashboardAuth || { username: 'admin', password: 'admin123' };
    if (username === dashAuth.username && password === dashAuth.password) {
        const token = "kurumi_" + Date.now() + "_" + Math.random().toString(36).slice(2);
        activeSessions.add(token);
        res.cookie('dash_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.json({ success: true });
    }
    res.json({ success: false, message: 'Invalid username or password' });
});

app.post('/api/logout', (req, res) => {
    const token = req.cookies && req.cookies.dash_token;
    if (token) activeSessions.delete(token);
    res.clearCookie('dash_token');
    res.json({ success: true });
});

// ========= Static Files + Dashboard (Protected) =========
app.use((req, res, next) => {
    const publicPaths = ['/login', '/api/login', '/ping'];
    if (publicPaths.includes(req.path)) return next();
    if (req.path.startsWith('/api/') && !isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.path.startsWith('/api/') && !isAuthenticated(req)) {
        return res.redirect('/login');
    }
    next();
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/appstate', (req, res) => res.sendFile(path.join(__dirname, 'public', 'appstate.html')));
app.get('/logs', (req, res) => res.sendFile(path.join(__dirname, 'public', 'log.html')));
app.get('/ping', (req, res) => res.send('pong'));

// ========= File Editor APIs (auth protected) =========
app.get("/api/config", (req, res) => {
    try {
        const content = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
        res.json({ success: true, content });
    } catch (e) { res.json({ success: false, error: e.message }); }
});

app.post("/api/config", (req, res) => {
    const { content } = req.body;
    try {
        JSON.parse(content);
        fs.writeFileSync(path.join(__dirname, 'config.json'), content, 'utf8');
        res.json({ success: true });
    } catch (e) { res.json({ success: false, error: e.message }); }
});

app.get("/api/scripts", (req, res) => {
    const dir = req.query.dir === 'events' ? 'scripts/events' : 'scripts/cmds';
    try {
        const files = fs.readdirSync(path.join(__dirname, dir))
            .filter(f => f.endsWith('.js'))
            .sort();
        res.json({ success: true, files });
    } catch (e) { res.json({ success: false, error: e.message }); }
});

app.get("/api/script", (req, res) => {
    const dir = req.query.dir === 'events' ? 'scripts/events' : 'scripts/cmds';
    const file = path.basename(req.query.file || '');
    if (!file) return res.json({ success: false, error: 'No file specified' });
    try {
        const content = fs.readFileSync(path.join(__dirname, dir, file), 'utf8');
        res.json({ success: true, content });
    } catch (e) { res.json({ success: false, error: e.message }); }
});

app.post("/api/script", (req, res) => {
    const { dir, file, content } = req.body;
    const safeDir = dir === 'events' ? 'scripts/events' : 'scripts/cmds';
    const safeFile = path.basename(file || '');
    if (!safeFile) return res.json({ success: false, error: 'No file specified' });
    try {
        fs.writeFileSync(path.join(__dirname, safeDir, safeFile), content, 'utf8');
        res.json({ success: true });
    } catch (e) { res.json({ success: false, error: e.message }); }
});

app.post("/api/create-file", (req, res) => {
    const { dir, name } = req.body;
    const safeDir = dir === 'events' ? 'scripts/events' : 'scripts/cmds';
    const safeName = path.basename(name || '').replace(/[^a-zA-Z0-9_\-\.]/g, '');
    if (!safeName) return res.json({ success: false, error: 'Invalid filename' });
    const ext = path.extname(safeName);
    if (!['.js', '.json'].includes(ext)) return res.json({ success: false, error: 'Only .js or .json allowed' });
    const fullPath = path.join(__dirname, safeDir, safeName);
    if (fs.existsSync(fullPath)) return res.json({ success: false, error: 'File already exists' });
    try {
        const starter = ext === '.json' ? '{\n  \n}\n' : `module.exports = {\n  config: {\n    name: "${safeName.replace('.js','')}",\n    author: "Author",\n    version: "1.0",\n    role: 0,\n    shortDescription: "",\n    longDescription: "",\n    category: "General",\n    guide: ""\n  },\n  onStart: async function ({ message }) {\n    message.reply("Hello!");\n  }\n};\n`;
        fs.writeFileSync(fullPath, starter, 'utf8');
        res.json({ success: true, name: safeName });
    } catch (e) { res.json({ success: false, error: e.message }); }
});

app.post("/api/create-folder", (req, res) => {
    const { dir, name } = req.body;
    const safeDir = dir === 'events' ? 'scripts/events' : 'scripts/cmds';
    const safeName = (name || '').replace(/[^a-zA-Z0-9_\-]/g, '');
    if (!safeName) return res.json({ success: false, error: 'Invalid folder name' });
    const fullPath = path.join(__dirname, safeDir, safeName);
    if (fs.existsSync(fullPath)) return res.json({ success: false, error: 'Folder already exists' });
    try {
        fs.mkdirSync(fullPath);
        res.json({ success: true, name: safeName });
    } catch (e) { res.json({ success: false, error: e.message }); }
});

app.delete("/api/script", (req, res) => {
    const { dir, file } = req.body;
    const safeDir = dir === 'events' ? 'scripts/events' : 'scripts/cmds';
    const safeFile = path.basename(file || '');
    if (!safeFile) return res.json({ success: false, error: 'No file specified' });
    try {
        fs.unlinkSync(path.join(__dirname, safeDir, safeFile));
        res.json({ success: true });
    } catch (e) { res.json({ success: false, error: e.message }); }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
                log.info("SERVER", `Keep-alive server running on port ${port}`);
                // প্রতি 4 মিনিট পর পর নিজেকে ping করবে যাতে Railway Sleep না করে
                setInterval(() => {
                                axios.get(`http://localhost:${port}/ping`).catch(() => {});
                }, 4 * 60 * 1000);
});
// ========= FIX 2 END =========
