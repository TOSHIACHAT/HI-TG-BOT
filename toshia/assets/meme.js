const cron = require('node-cron');
const axios = require('axios'); 
const { hm, warn } = require('../system/logs.js');

module.exports = (bot) => {

    const fetchMeme = async () => {
        try {
            const response = await axios.get('https://meme-api.com/gimme');
            return { title: response.data.title, url: response.data.url };
        } catch (err) {
            warn('Error fetching meme:', err);
            return null;
        }
    };

    const sendMemeToAllGroups = async () => {
        try {
            const meme = await fetchMeme();
            if (meme) {
                const { title, url } = meme;
                const groupChatIds = Object.keys(global.data.groups);
                for (const chatId of groupChatIds) {
                    if (global.data.groups[chatId].meme) {
                        try {
                            await bot.sendPhoto(chatId, url, { caption: title });
                        } catch (err) {
                            warn(`Error sending meme to group ${chatId}:`, err);
                        }
                    }
                }
                hm('Meme sent to all groups with meme enabled!');
            }
        } catch (err) {
            warn('Error sending meme to all groups:', err);
        }
    };

    cron.schedule('*/15 * * * *', () => {
        sendMemeToAllGroups();
    });
};
