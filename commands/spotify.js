const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: 'spotify',
        aliases: ['music'],
        description: 'Search and play music from Spotify',
        author: 'cliff',
        access: 'anyone',
        usage: ['[song name]'],
        category: 'media',
    },
    initialize: async function ({ bot, chatId, args }) {
        let searchQuery = args.join(' ').trim();

        if (!searchQuery) {
            await bot.sendMessage(chatId, "Now send the song title to proceed");
            bot.once('message', async (msg) => {
                searchQuery = msg.text.trim();
                if (searchQuery) {
                    await searchAndSendSpotifyMusic(bot, chatId, searchQuery);
                } else {
                    await bot.sendMessage(chatId, '❌ Invalid search query. Please provide a valid song title.');
                }
            });
        } else {
            await searchAndSendSpotifyMusic(bot, chatId, searchQuery);
        }
    }
};

async function searchAndSendSpotifyMusic(bot, chatId, searchQuery) {
    const encodedQuery = encodeURIComponent(searchQuery);
    const apiUrl = `https://private-api-01af7d237cd1.herokuapp.com/music/spotify?search=${encodedQuery}`;

    let loadingMessage;
    try {
        loadingMessage = await bot.sendMessage(chatId, "🎵 Searching for your music on Spotify. Please wait...");

        const response = await axios.get(apiUrl);
        const song = response.data[0];

        if (!song) {
            await bot.editMessageText("❌ Sorry, couldn't find the requested music on Spotify.", { chat_id: chatId, message_id: loadingMessage.message_id });
            return;
        }

        const { download } = song;
        const filePath = path.join(__dirname, 'cache', `${Date.now()}.mp3`);

        const writeStream = fs.createWriteStream(filePath);
        const audioResponse = await axios.get(download, { responseType: 'stream' });
        audioResponse.data.pipe(writeStream);

        writeStream.on('finish', async () => {
            await bot.sendAudio(chatId, filePath, {
                caption: `🎧 Enjoy your music from Spotify!`,
            });

            // Optional: delete the file after sending, comment out if you want to keep the file
            // fs.unlinkSync(filePath);
        });

        // Thanos snap effect simulation
        await bot.editMessageText("✨ Poof! Your music is ready!", { chat_id: chatId, message_id: loadingMessage.message_id });
        setTimeout(async () => {
            await bot.deleteMessage(chatId, loadingMessage.message_id);
        }, 2000);
    } catch (error) {
        console.error(error);
        if (loadingMessage) {
            await bot.editMessageText("🚨 An error occurred while processing your request.", { chat_id: chatId, message_id: loadingMessage.message_id });
        } else {
            await bot.sendMessage(chatId, "🚨 An error occurred while processing your request.");
        }
    }
}
