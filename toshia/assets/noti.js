module.exports = (bot) => {
    bot.on('new_chat_members', async (msg) => {
        const { chat, new_chat_members } = msg;
        const { id: chatId, title } = chat;

        if (global.data.groups[chatId] && global.data.groups[chatId].noti) {
            new_chat_members.forEach(member => {
                const { first_name, username } = member;
                bot.sendMessage(chatId, `Hello, ${first_name} (@${username})! Welcome to ${title}. Please enjoy your time here! 🥳♥`);
            });
        }
    });

    bot.on('left_chat_member', async (msg) => {
        const { chat, left_chat_member } = msg;
        const { first_name, username } = left_chat_member;
        const { id: chatId, title } = chat;

        if (global.data.groups[chatId] && global.data.groups[chatId].noti) {
            const isAdmin = !left_chat_member.is_member; 
            if (isAdmin) {
                bot.sendMessage(chatId, `${first_name} (@${username}) was removed by an admin from ${title}. Goodbye!`);
            } else {
                bot.sendMessage(chatId, `${first_name} (@${username}) has left ${title}. Goodbye!`);
            }
        }
    });
};
