const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: 'group',
        description: 'Enable or disable bot, meme, noti, and ai settings for the group or view current settings.',
        access: 'admin',
        author: 'Shinpei',
        usage: ['ai on/off', 'bot on/off', 'meme on/off', 'noti on/off', 'status'],
        category: 'group'
    },
    initialize: async function ({ bot, chatId, args, usages, msg }) {
        // Check if the command is executed in a group or supergroup
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            bot.sendMessage(chatId, 'This command is only available in group chats.');
            return;
        }

        // Check if the group is registered
        if (!global.data.groups[chatId]) {
            bot.sendMessage(chatId, 'This group is not registered.');
            return;
        }

        // Handle the 'assets' argument to list current settings
        if (args.length === 1 && args[0].toLowerCase() === 'status') {
            const groupSettings = global.data.groups[chatId];
            const assetsMessage = `
Group Status

⦿ Ai: ${groupSettings.ai ? 'on' : 'off'}
⦿ Bot: ${groupSettings.bot ? 'on' : 'off'}
⦿ Meme: ${groupSettings.meme ? 'on' : 'off'}
⦿ Noti: ${groupSettings.noti ? 'on' : 'off'}
            `;
            bot.sendMessage(chatId, assetsMessage);
            return;
        }

        // Ensure proper usage for setting adjustments
        if (args.length < 2) {
            usages();
            return;
        }

        const setting = args[0].toLowerCase();
        const state = args[1].toLowerCase();

        if (!['bot', 'meme', 'noti', 'ai'].includes(setting) || !['on', 'off'].includes(state)) {
            usages();
            return;
        }

        const newState = state === 'on';
        global.data.groups[chatId][setting] = newState;

        bot.sendMessage(chatId, `${setting.charAt(0).toUpperCase() + setting.slice(1)} has been turned ${state} for this group.`);
    }
};
