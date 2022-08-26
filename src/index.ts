import {Bot} from "./Bot";
import {Config, load} from "./config";

if (require.main === module) {
  let config: Config;
  let bot: Bot;
  try {
    config = load();
    bot = new Bot(config.DISCORD_TOKEN,
                  config.DISCORD_BOT_ID);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}