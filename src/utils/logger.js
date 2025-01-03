const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class Logger {
    constructor(config) {
        this.config = config;
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        const logDir = path.join(process.cwd(), this.config.logging.directory);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    log(message, type = 'INFO') {
        if (!this.config.logging.levels.includes(type)) return;

        const timestamp = new Date().toLocaleTimeString();
        const logMessage = type === 'TIP' ? 
            `[${type}] ${message}\n` : 
            `${timestamp} - [${type}] ${message}\n`;

        this.writeToFile(logMessage);
        this.consoleLog(logMessage, type);
    }

    writeToFile(message) {
        const logPath = path.join(process.cwd(), this.config.logging.directory, this.config.logging.filename);
        fs.appendFileSync(logPath, message);
    }

    consoleLog(message, type) {
        const color = this.config.notifications.console.colors[type.toLowerCase()] || 'white';
        console.log(chalk[color](message));
    }

    error(message) { this.log(message, 'ERROR'); }
    info(message) { this.log(message, 'INFO'); }
    warn(message) { this.log(message, 'WARNING'); }
    tip(message) { this.log(message, 'TIP'); }
}

module.exports = Logger; 