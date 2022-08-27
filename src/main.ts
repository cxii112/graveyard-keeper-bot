import {Config, load} from "./config";
import {Bot} from "./Bot";

export default async function main() {
  const ROLE_ID = "911123554291056650";
  const CHANNEL_ID = "1013113504758239352";
  const USER_IDS = [
    "429287891320176641",
    "332206259002408960",
    "291238303251038218",
    "279248023886757888"
  ];
  let config: Config;
  let bot: Bot;
  try {
    config = load();
    bot = new Bot(config.DISCORD_TOKEN);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
  await bot.start();

  setInterval(() => {
                USER_IDS.forEach(user => {
                  bot.sendMessageWithMention(config.GUILD_ID,
                                             CHANNEL_ID,
                                             user,
                                             "А ты знаешь что такое безумие?");
                });
              },
              1000 * 60);
}