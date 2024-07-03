const axios = require("axios");

module.exports = {
    config: {
        name: "bing",
        author: "Shinpei",
        access: "anyone",
        description: "Generate text bing ai",
        category: "AI",
        usage: "[prompt]"
    },
    initialize: async function ({ bot, chatId, args, usages }) {
        const prompt = args.join(" ");

        if (!prompt) {
            return usages(bot);
        }

        try {
            const apiUrl = `https://joshweb.click/bing?prompt=${encodeURIComponent(prompt)}&mode=2`;
            const response = await axios.get(apiUrl);
            const generatedText = response.data.bing;

            bot.sendMessage(chatId, generatedText, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error("Error generating text:", error);
            bot.sendMessage(chatId, "An error occurred while generating text. Please try again later.");
        }
    }
};