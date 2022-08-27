import {Config, load} from "./config";
import {Bot} from "./Bot";

export default async function main() {
  const ROLE_ID = "911123554291056650";
  const CHANNEL_ID = "1013113504758239352";
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
                bot.sendMessage(config.GUILD_ID, CHANNEL_ID, `${(new Date(Date.now())).toISOString()}`);
              },
              1000 * 30);
}