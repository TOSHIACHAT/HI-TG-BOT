const fs = require('fs');
const path = require('path');

// Create a cache directory if it doesn't exist
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

module.exports = {
    config: {
        name: "shell",
        author: "Shinpei",
        description: "Access the shell",
        category: "operator",
        usage: "[command]",
        access: "operator"
    },
    initialize: async function ({ bot, chatId, userId, args, usages }) {
       
        const command = args.join(' ');

        if (!command) {
            return usages();
        }

        try {
            const { exec } = require('child_process');
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing command: ${error.message}`);
                    bot.sendMessage(chatId, 'An error occurred while executing the command.');
                    return;
                }
                if (stderr) {
                    console.error(`Command stderr: ${stderr}`);
                    sendOutput(chatId, stderr, 'stderr.txt');
                    return;
                }
                console.log(`Command output: ${stdout}`);
                sendOutput(chatId, stdout, 'stdout.txt');
            });

            function sendOutput(chatId, output, fileName) {
                // Check message length
                const maxMessageLength = 4096; // Telegram message length limit
                if (output.length > maxMessageLength) {
                    // Write output to a file in cache directory
                    const filePath = path.join(cacheDir, fileName);
                    fs.writeFile(filePath, output, (err) => {
                        if (err) {
                            console.error('Error writing file:', err);
                            bot.sendMessage(chatId, 'An error occurred while processing the command output.');
                            return;
                        }
                        // Send file as document
                        bot.sendDocument(chatId, filePath)
                            .catch((error) => {
                                console.error('Error sending document:', error);
                                bot.sendMessage(chatId, 'An error occurred while sending the command output as a document.');
                            });
                    });
                } else {
                    // Send as regular message
                    bot.sendMessage(chatId, '```\n' + output.trim() + '\n```', { parse_mode: 'markdown' })
                        .catch((error) => {
                            console.error('Error sending message:', error);
                            bot.sendMessage(chatId, 'An error occurred while sending the command output.');
                        });
                }
            }
        } catch (error) {
            console.error('[ERROR]', error);
            bot.sendMessage(chatId, 'An error occurred while processing the command.');
        }
    }
};
