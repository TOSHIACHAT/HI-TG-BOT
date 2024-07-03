module.exports = {
    config: {
        name: "notify",
        author: "Lance Ajiro",
        description: "Send a notification to all chat groups",
        access: "operator",
        category: "operator",
        usage: "[message]"
    },

    initialize: async function ({ bot, chatId, args, usages }) {
        const message = args.join(' ');

        if (!message) {
            return usages();
        }

        const chatGroups = global.data.groups;

        if (Object.keys(chatGroups).length === 0) {
            return bot.sendMessage(chatId, "No chat groups found to send the message.");
        }

        for (const groupId of Object.keys(chatGroups)) {
            try {
                await bot.sendMessage(groupId, message);
            } catch (error) {
                console.error(`Error sending message to group ${groupId}:`, error);
            }
        }

        bot.sendMessage(chatId, "Notification sent to all chat groups.");
    }
};
