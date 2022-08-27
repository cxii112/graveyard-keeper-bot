import {Bot} from "./Bot";
import {Config, load} from "./config";

if (require.main === module) {
  let config: Config;
  let bot: Bot;
  try {
    config = load();
    bot = new Bot(config.DISCORD_TOKEN);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
  setTimeout(() => {
    bot.getMembersOfGuild(config.GUILD_ID)
      .filter(member => {
        if (member.roles.resolve("911123554291056650")) return true;
        return false;
      })
      .map(member => {
        console.log(`${member.id} ${member.user.tag}` +
        `${member.nickname ? ` aka ${member.nickname}` : ""}`)
      });
  }, 1000 * 10);
}