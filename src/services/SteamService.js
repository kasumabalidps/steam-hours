const SteamUser = require('steam-user');
const axios = require('axios');

class SteamService {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.client = new SteamUser();
        this.gameNameCache = new Map();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('error', this.handleError.bind(this));
        this.client.on('loggedOn', this.handleLoggedOn.bind(this));
        this.client.on('friendMessage', this.handleFriendMessage.bind(this));
        this.client.on('gameInvite', this.handleGameInvite.bind(this));
    }

    async login(credentials) {
        return new Promise((resolve, reject) => {
            this.client.logOn({
                accountName: credentials.username,
                password: credentials.password
            });

            this.client.once('loggedOn', () => resolve());
            this.client.once('error', (err) => reject(err));

            // Set timeout
            setTimeout(() => reject(new Error('Login timeout')), 60000);
        });
    }

    async getGameName(appId) {
        if (this.gameNameCache.has(appId)) {
            return this.gameNameCache.get(appId);
        }

        try {
            const response = await axios.get(
                `https://store.steampowered.com/api/appdetails?appids=${appId}`,
                { timeout: 5000 }
            );
            
            if (response.data[appId]?.success) {
                const name = response.data[appId].data.name;
                this.gameNameCache.set(appId, name);
                return name;
            }
            return null;
        } catch (err) {
            this.logger.error(`Failed to fetch game name: ${err.message}`);
            return null;
        }
    }

    async startGames(gameIds) {
        const games = [];
        for (const id of gameIds) {
            const name = await this.getGameName(id);
            if (name) {
                games.push({
                    game_id: parseInt(id),
                    game_extra_info: name
                });
            }
        }
        this.client.gamesPlayed(games);
        return games;
    }

    handleError(err) {
        // ... error handling logic
    }

    handleLoggedOn() {
        // ... logged on logic
    }

    handleFriendMessage(steamID, message) {
        // ... friend message logic
    }

    handleGameInvite(inviterID) {
        // ... game invite logic
    }
}

module.exports = SteamService; 