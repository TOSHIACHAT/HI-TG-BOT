const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    author: "Shinpei",
    description: "Search and download music from YouTube",
    access: "anyone",
    category: "media",
    usage: "[title]"
  },
  initialize: async ({ bot, chatId, args, usages }) => {

    const search = args.join(" ");

    try {
      if (!search) {
        return usages(bot);
      }

      const loadingMessage = await bot.sendMessage(chatId, `🔍 Searching for song: ${search}`);

      const searchResults = await yts(search);
      if (!searchResults.videos.length) {
        await bot.deleteMessage(chatId, loadingMessage.message_id);
        return bot.sendMessage(chatId, "No music found for your query.");
      }

      const music = searchResults.videos[0];
      const musicUrl = music.url;

      const stream = ytdl(musicUrl, { filter: "audioonly" });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading music: ${info.videoDetails.title}`);
      });

      const fileName = `${music.title}.mp3`;
      const filePath = path.join(__dirname, "cache", fileName);

      const fileStream = fs.createWriteStream(filePath);
      stream.pipe(fileStream);

      fileStream.on('finish', async () => {

        const stats = fs.statSync(filePath);
        if (stats.size > 226214400) {
          fs.unlinkSync(filePath);
          await bot.deleteMessage(chatId, loadingMessage.message_id);
          return bot.sendMessage(chatId, '❌ The file could not be sent because it is larger than 205MB.');
        }

        await bot.deleteMessage(chatId, loadingMessage.message_id);

        // Delay for 1 second to ensure the loading message is deleted
        setTimeout(() => {
          bot.sendAudio(chatId, fs.createReadStream(filePath), { caption: `${music.title}` });
        }, 1000);
      });

      stream.on('error', async (error) => {
        console.error('[ERROR]', error);
        await bot.deleteMessage(chatId, loadingMessage.message_id);
        bot.sendMessage(chatId, 'An error occurred while processing the command.');
      });

    } catch (error) {
      console.error('[ERROR]', error);
      bot.sendMessage(chatId, 'An error occurred while processing the command.');
    }
  }
};
