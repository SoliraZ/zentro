const axios = require('axios');
const config = require('../config/fivem');

class FiveMAPI {
    constructor() {
        this.baseURL = `http://${config.server.ip}:${config.server.port}`;
    }

    async getServerInfo() {
        try {
            const response = await axios.get(`${this.baseURL}${config.endpoints.info}`, {
                timeout: 5000
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getPlayers() {
        try {
            const response = await axios.get(`${this.baseURL}${config.endpoints.players}`, {
                timeout: 5000
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getDynamicData() {
        try {
            const response = await axios.get(`${this.baseURL}${config.endpoints.dynamic}`, {
                timeout: 5000
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    formatUptime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}j ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }
}

module.exports = new FiveMAPI();
