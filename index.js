const { spawn } = require("child_process");

let botProcess;

function startBot() {
    console.log("[ SYSTEM ] Starting KuRuMi.js...");

    botProcess = spawn("node", ["--trace-warnings", "--async-stack-traces", "KuRuMi.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    botProcess.on("close", (codeExit) => {
        console.log(`[ SYSTEM ] Bot exited with code ${codeExit}`);
        console.log("[ SYSTEM ] Restarting bot in 5s...");
        setTimeout(() => startBot(), 5000);
    });

    botProcess.on("error", (err) => {
        console.error("[ SYSTEM ] Bot error:", err);
    });
}

// Handle Replit stop
process.on("SIGTERM", () => {
    if (botProcess) botProcess.kill();
    process.exit(0);
});

startBot();