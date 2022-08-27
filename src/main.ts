import {Config, load} from "./config";
import {Bot} from "./Bot";

export default async function main() {
  const ROLE_ID = "911123554291056650";
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
  const membersOfGuild = await bot.getMembersOfGuild(config.GUILD_ID);
  membersOfGuild.filter(member => !!member.roles.resolve(ROLE_ID))
    .forEach(member => console.log(`${member.id} ${member.user.tag}` +
                                     `${member.nickname ?? ""}`));
}