# 🐱 KuRuMi-V3

**KuRuMi-V3** একটি উন্নত ফেসবুক / মেসেঞ্জার বট যা রিয়েল-টাইম ড্যাশবোর্ড, লগ, অটোম্যানেজমেন্ট এবং AI কমান্ড সমর্থন করে।  

> **Author:** NiSaN  
> **Version:** 3.x  
> **License:** MIT  

---

## 🚦 Roles (Permissions)

KuRuMi-V3 এ কমান্ড এক্সেস রোল অনুযায়ী নিয়ন্ত্রিত হয়:

| Role | Description       |
|------|------------------|
| 4    | Premium           |
| 3    | Developer         |
| 2    | Admin             |
| 1    | Administration    |
| 0    | All Users         |

> 💡 **Note:** রোল সংখ্যা যত বেশি, তত বেশি প্রিভিলেজ।

---

## ⚙️ Required Roles for Commands

কিছু গুরুত্বপূর্ণ কমান্ড নির্দিষ্ট রোলের জন্য প্রয়োজন:

| Command       | Required Role | Description |
|---------------|---------------|-------------|
| `blanche`     | R             | Execute Blanche AI command |
| `themeAI`     | R             | Execute Theme AI command |

> `R` মানে Required Role, শুধুমাত্র নির্দিষ্ট ইউজারের জন্য।

---

## 📦 Features

- 🔹 Real-time system stats (CPU, memory, uptime)  
- 🔹 Bot auto-restart & appstate management  
- 🔹 Dashboard with login and live logs  
- 🔹 Role-based command access  
- 🔹 Config reload on the fly  
- 🔹 Email notifications via Gmail OAuth2  

---

## 📁 File Structure
KuRuMi-V3/ │ ├─ public/               # Frontend: dashboard, login, appstate, logs ├─ bot/                  # Bot logic ├─ config.json           # Main config ├─ configCommands.json   # Commands config ├─ account.txt           # Bot account / session ├─ Goat.js               # Main bot process ├─ index.js              # Dashboard / API server └─ logger/log.js         # Logger utility

---

## ⚡ Quick Start

1. Install dependencies:

```bash
npm install
```
Run the bot:node index.js

Open dashboard:

Login credentials are set in index.js:

Username: admin
Password: admin123
