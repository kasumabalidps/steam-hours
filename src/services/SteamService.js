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
        this.client.on('friendRelationship', this.handleFriendRequest.bind(this));
        this.client.on('newItems', this.handleNewItems.bind(this));
        this.client.on('tradeOffers', this.handleTradeOffers.bind(this));
    }

    async login(credentials) {
        return new Promise((resolve, reject) => {
            this.client.logOn({
                accountName: credentials.username,
                password: credentials.password
            });

            this.client.once('loggedOn', () => resolve());
            this.client.once('error', (err) => reject(err));
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
        this.logger.error(`Steam error: ${err.message}`);
        if (err.eresult) {
            switch (err.eresult) {
                case SteamUser.EResult.InvalidPassword:
                    this.logger.error('Invalid credentials');
                    break;
                case SteamUser.EResult.RateLimitExceeded:
                    this.logger.error('Rate limit exceeded');
                    break;
                default:
                    this.logger.error(`Steam error code: ${err.eresult}`);
            }
        }
    }

    handleLoggedOn() {
        this.logger.info('Successfully logged into Steam');
        if (this.config.bot.settings.appearOnline) {
            this.client.setPersona(SteamUser.EPersonaState.Online);
        } else {
            this.client.setPersona(SteamUser.EPersonaState.Invisible);
        }
    }

    handleFriendMessage(steamID, message) {
        if (!this.config.bot.settings.acceptReplys) return;
        
        const response = this.config.autoResponses.default;
        setTimeout(() => {
            this.client.chatMessage(steamID, response);
        }, this.config.bot.messaging.responseDelay);
    }

    handleGameInvite(inviterID) {
        if (this.config.bot.settings.acceptReplys) {
            const response = this.config.autoResponses.default;
            this.client.chatMessage(inviterID, response);
        }
    }

    handleFriendRequest(steamID, relationship) {
        if (relationship === 2 && this.config.bot.settings.acceptRandomFriendRequests) {
            this.client.addFriend(steamID);
            if (this.config.bot.settings.acceptReplys) {
                const response = this.config.autoResponses.default;
                this.client.chatMessage(steamID, response);
            }
        }
    }

    handleNewItems(count) {
        if (this.config.bot.settings.acceptItemNotify) {
            this.logger.info(`Received ${count} new items`);
            if (this.config.bot.settings.playSoundOnNewItem) {
                process.stdout.write('\x07');
            }
        }
    }

    handleTradeOffers(count) {
        if (this.config.bot.settings.acceptTradesNotify) {
            this.logger.info(`Received ${count} new trade offers`);
        }
    }
}

module.exports = SteamService; 