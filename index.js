const TelegramBot = require("node-telegram-bot-api");
const ytdl = require("ytdl-core");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Send me a YouTube link and I will download video for you."
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  const url = text.trim();

  if (!ytdl.validateURL(url)) {
    return bot.sendMessage(chatId, "❌ Invalid YouTube link");
  }

  try {
    bot.sendMessage(chatId, "⏳ Processing video...");

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    const stream = ytdl(url, {
      filter: "videoandaudio",
      quality: "18"
    });

    bot.sendMessage(chatId, `⬇️ Downloading: ${title}`);

    bot.sendVideo(chatId, stream, {
      caption: title
    });

  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "❌ Error downloading video");
  }
});