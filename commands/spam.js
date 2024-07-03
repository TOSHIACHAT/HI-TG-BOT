module.exports = {
    config: {
        name: 'spam',
        aliases: [],
        description: 'Spams a message 200 times.',
        author: '𝐌𝐀𝐑𝐉𝐇𝐔𝐍 𝐁𝐀𝐘𝐋𝐎𝐍',
        access: 'operator',
        usage: ['spam'],
        category: 'test'
    },
    initialize: async function ({ bot, chatId, args, usages }) {
        for (let i = 0; i < 200; i++) {
            await bot.sendMessage(chatId, '🛐🛐IPAKO SA TITE YAN🛐🛐');
        }
    }
};
