const fs = require('fs');
const path = require('path');

// Function to send a file as a document
async function sendDocument(bot, chatId, filePath) {
    try {
        await bot.sendDocument(chatId, filePath);
    } catch (error) {
        console.error('Error sending document:', error);
        bot.sendMessage(chatId, 'An error occurred while sending the file.');
    }
}

module.exports = {
    config: {
        name: "file",
        author: "Shinpei",
        description: "Send contents of a file as Markdown or document if too long.",
        category: "general",
        usage: "[filename]",
        access: "anyone"
    },
    initialize: async function ({ bot, chatId, userId, args, usages }) {
        let fileName = args.join(' ');

        if (!fileName) {
            return usages();
        }

        // Remove file extension if provided
        fileName = fileName.replace(/\.[^.]+$/, '');

        const filePath = path.join(__dirname, fileName + '.js');

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            bot.sendMessage(chatId, 'File not found.');
            return;
        }

        // Read file content
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                bot.sendMessage(chatId, 'An error occurred while reading the file.');
                return;
            }

            // Check message length
            const maxMessageLength = 4096; // Telegram message length limit
            if (data.length > maxMessageLength) {
                // Send as document if too long
                sendDocument(bot, chatId, filePath);
            } else {
                // Send as Markdown message
                bot.sendMessage(chatId, '```\n' + data.trim() + '\n```', { parse_mode: 'markdown' })
                    .catch((error) => {
                        console.error('Error sending message:', error);
                        bot.sendMessage(chatId, 'An error occurred while sending the file content.');
                    });
            }
        });
    }
};
