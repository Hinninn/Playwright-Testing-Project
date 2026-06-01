import chalk from "chalk";
import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const logFile = path.join(logDir, `test-log-${new Date().toISOString().replace(/[:.]/g, "-")}.log`);

export function logStep(message: string) {
    const time = new Date().toISOString();
    const fullMessage = `[${time}] ${message}\n`;
    fs.appendFileSync(logFile, fullMessage);
    console.log(fullMessage.trim());
}

export function logTitle(message: string) {
    const separator = "-".repeat(100);
    const time = new Date().toISOString();
    console.log(chalk.yellow(separator));
    console.log(chalk.yellow(message));
    console.log(chalk.yellow(separator));
    const fileMessage = `[${time}] ${separator}\n[${time}] ${message}\n[${time}] ${separator}\n`;
    fs.appendFileSync(logFile, fileMessage);
}