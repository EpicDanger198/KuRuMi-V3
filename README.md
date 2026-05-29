<p align="center">
  <img src="https://files.catbox.moe/zr2ktu.jpg" alt="KuRuMi-V3 Banner" width="100%">
</p>

<h1 align="center">🐱 KuRuMi-V3</h1>

<p align="center">
  <b>Advanced Facebook / Messenger Bot with Dashboard, Automation & AI</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-3.x-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Node.js-20x-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge">
  <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/EpicDanger198/KuRuMi-V3?style=social">
  <img src="https://img.shields.io/github/forks/EpicDanger198/KuRuMi-V3?style=social">
  <img src="https://img.shields.io/github/watchers/EpicDanger198/KuRuMi-V3?style=social">
</p>

---

## 🚀 Overview

**KuRuMi-V3** একটি powerful Messenger bot system যা automation, AI commands, live dashboard এবং advanced control system প্রদান করে।

> 👨‍💻 Author: **NiSaN**  
> ⚡ Version: **3.x**  
> 📜 License: **MIT**

---

## ✨ Core Features

- ⚡ Real-time CPU, RAM, uptime monitoring  
- 🤖 AI powered command system  
- 🔄 Auto restart & smart session handling  
- 📊 Live dashboard with logs  
- 🔐 Role-based secure command access  
- 🔁 Instant config reload system  
- 📧 Gmail OAuth2 email alerts  

---

## 🧩 Access Control (Roles)

| Role | Access Level        |
|------|---------------------|
| 4    | Premium Users       |
| 3    | Developers          |
| 2    | Admins              |
| 1    | Group Administration|
| 0    | Public Users        |

> 🔐 Higher role = more power

---

## ⚙️ Restricted Commands

| Command  | Role | Function         |
|----------|------|------------------|
| blanche  | R    | AI Execution     |
| themeAI  | R    | Theme AI System  |

---

## Prefix setup in cmd

```js
usePrefix: true,   // must use prefix when calling cmd
usePrefix: false,  // no prefix needed
usePrefix: "awto", // default cmd — works both with and without prefix
```

---

## 📦 FCA Setup (kurumi-fca)

KuRuMi-V3 uses **kurumi-fca** as the Facebook Chat API.

### Install

```bash
npm install kurumi-fca
```

### Usage in your project

```js
const login = require("kurumi-fca");

login({ appState: JSON.parse(require("fs").readFileSync("account.txt", "utf8")) }, (err, api) => {
    if (err) return console.error(err);
    console.log("✅ Logged in!");

    api.listenMqtt((err, event) => {
        if (err) return console.error(err);
        api.sendMessage("Hello!", event.threadID);
    });
});
```

### fca.js config (select FCA package)

```js
const fcaList = {
    kurumifca: "kurumi-fca",   // ← default, use this
};
const defaultFca = "kurumifca";
module.exports = { fcaList, defaultFca };
```

> 🔗 NPM: [npmjs.com/package/kurumi-fca](https://www.npmjs.com/package/kurumi-fca)  
> 🔗 GitHub: [github.com/N1SA9EDITZ/KURUMI-FCA](https://github.com/N1SA9EDITZ/KURUMI-FCA)

---

## ⚡ Quick Setup

### 📦 Install Dependencies

```bash
npm install
```

### ▶️ Start Bot

```bash
node index.js
```

### 🔐 Dashboard Access

> Username: `admin`  
> Password: `admin123`

---

## 🚀 Deployment Guide

### 🔷 Railway

1. Upload repo to GitHub
2. Login to [Railway](https://railway.app)
3. Create New Project → Deploy from GitHub
4. Select repository
5. Start Command:

```bash
node index.js
```

---

### 🔶 Render

1. Login to [Render](https://render.com)
2. Create New Web Service
3. Connect GitHub repository
4. Build Command:

```bash
npm install
```

5. Start Command:

```bash
node index.js
```

---

## 🧠 System Requirements

- ✅ Node.js 20x
- ✅ Stable internet connection
- ⚠️ Proper `config.json` setup required
- ❌ Invalid `account.txt` will prevent startup

---

## 📊 Project Highlights

- ⚙️ Fully customizable
- 🔐 Secure role system
- 📡 Real-time monitoring
- 🤖 AI integration ready
- 🌐 Dashboard controlled

---

## ⭐ Support & Contribution

If you like this project:

- ⭐ Star the repository
- 🍴 Fork & customize
- 🛠️ Contribute improvements

---

## 📜 License

This project is licensed under the MIT License.

---

> *Made with ❤️ by NiSaN*
