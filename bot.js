const config = require('./config.json');
const Logger = require('./src/utils/logger');
const SteamService = require('./src/services/SteamService');
const Interface = require('./src/ui/Interface');

class SteamBot {
    constructor() {
        this.config = config;
        this.logger = new Logger(config);
        this.ui = new Interface(config);
        this.steam = new SteamService(config, this.logger);
    }

    async start() {
        try {
            await this.login();
            this.logger.info('Bot started successfully');
        } catch (err) {
            this.logger.error(`Failed to start bot: ${err.message}`);
            process.exit(1);
        }
    }

    async login() {
        let credentials = this.config.credentials;
        
        if (!credentials.username || !credentials.password) {
            credentials = await this.ui.getCredentials();
        }

        await this.steam.login(credentials);
        this.config.credentials = credentials;
        this.saveConfig();
    }

    saveConfig() {
        // ... save config logic
    }
}

// Start the bot
const bot = new SteamBot();
bot.start();
