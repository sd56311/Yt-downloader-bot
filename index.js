const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
const fs = require("fs");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    "👋 Send YouTube link\nI will download video for you"
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  const url = text.trim();

  bot.sendMessage(chatId, "⏳ Downloading...");

  const fileName = `video_${Date.now()}.mp4`;

  const cmd = `yt-dlp -f "best[ext=mp4]" -o "${fileName}" "${url}"`;

  exec(cmd, async (error) => {
    if (error) {
      console.log(error);
      return bot.sendMessage(chatId, "❌ Download failed");
    }

    try {
      await bot.sendVideo(chatId, fileName, {
        caption: "✅ Download complete"
      });

      fs.unlinkSync(fileName); // delete file after send
    } catch (err) {
      bot.sendMessage(chatId, "❌ Send failed");
    }
  });
});
