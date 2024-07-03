# Telegram Bot
# This bot was made by Shinpei

### Example to make a command.

```javascript
module.exports = {
        config: { // Command config name
        name: 'example', // Main command name
        aliases: ['demo', 'test'], // Aliases for the command
        description: 'A simple example command.', // Brief description of what the command does
        author: 'YourName', // Author or creator of the command
        access: 'anyone|admin|operator', // anyone is permission for all and admin is for group admin and operator is for bot owner
        usage: ['example', 'example <parameter>'], // Array of usage examples
        category: 'Utility' // Category of the command
    },
    initialize: async function ({ bot, chatId, args, usages }) { // Function to execute when the command is called
        // bot: The Telegram bot instance
        // chatId: The ID of the chat where the command was invoked
        bot.sendMessage(chatId, 'This is just an example command.'); // Send a message to the chat
    }
};

```