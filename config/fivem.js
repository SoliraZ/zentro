module.exports = {
    server: {
        ip: process.env.FIVEM_SERVER_IP || '127.0.0.1',
        port: process.env.FIVEM_SERVER_PORT || '30120',
        name: process.env.FIVEM_SERVER_NAME || 'Mon Serveur FiveM',
        maxPlayers: process.env.FIVEM_MAX_PLAYERS || 64
    },
    endpoints: {
        info: '/info.json',
        players: '/players.json',
        dynamic: '/dynamic.json'
    }
};
