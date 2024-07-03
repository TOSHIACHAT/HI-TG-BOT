const os = require('os');
const process = require('process');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "stats",
        author: "Lance Ajiro",
        description: "Display bot statistics",
        access: "operator",
        category: "operator",
        usage: ""
    },

    initialize: async function({ bot, chatId }) {
        try {
            const uptime = process.uptime(); 
            const uptimeString = formatUptime(uptime);

            const memoryUsage = process.memoryUsage();
            const memoryUsageMB = (memoryUsage.rss / (1024 * 1024)).toFixed(2);

            const cpuUsage = os.loadavg();
            const cpuUsageString = cpuUsage.map(avg => avg.toFixed(2)).join(', ');

            const jsFileCount = countJSFiles(path.join(__dirname, '../commands'));

            const totalGroups = Object.keys(global.data.groups).length;

            const statsMessage = `
Bot Statistics

⦿ Runtime: ${uptimeString}
⦿ Memory usage: ${memoryUsageMB} MB           
⦿ Total commands: ${jsFileCount}
⦿ Total groups: ${totalGroups}
            `;

            bot.sendMessage(chatId, statsMessage);
        } catch (error) {
            console.error('[ERROR]', error);
            bot.sendMessage(chatId, 'An error occurred while fetching the stats.');
        }
    }
};

function formatUptime(uptime) {
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function countJSFiles(directory) {
    const files = fs.readdirSync(directory);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    return jsFiles.length;
}
