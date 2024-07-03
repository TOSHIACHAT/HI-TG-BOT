
module.exports = {
    config: {
        name: "eval",
        author: "Shinpei",
        description: "Execute JavaScript code (operator only)",
        category: "development",
        usage: "[code]",
        access: "operator"


    },
    initialize: async function ({ bot, chatId, userId, args, msg, adminId, usages }) {

        const code = args.join(' ');

        if (!code) {
            return usages();
        }

        try {
            let result = await eval(code);
            if (typeof result !== 'string') {
                result = require('util').inspect(result);
            }


 bot.sendMessage(adminId, `Result: ${result}`);


        } catch (error) {
            console.error('[ERROR]', error);
            bot.sendMessage(chatId, `Error: ${error.message}`);
        }
    }
}; 