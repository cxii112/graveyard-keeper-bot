import {load} from "./config";
import {Bot} from "./Bot";
import phrases from "./phrases.json";

module.exports.main = main;

export default async function main() {
  const {
    DISCORD_TOKEN,
    GUILD_ID,
    CHANNEL_ID,
    ROLE_ID,
  } = load();
  let bot: Bot;
  try {
    checkEnvVars(DISCORD_TOKEN, GUILD_ID, CHANNEL_ID, ROLE_ID);
    bot = new Bot(DISCORD_TOKEN!);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
  await bot.start();

  return sendMentions(bot, GUILD_ID!, CHANNEL_ID!, ROLE_ID!);
}

async function sendMentions(bot: Bot,
                            guildId: string,
                            channelId: string,
                            roleId: string) {
  await bot.sendMessageWithRoleMention(guildId,
                                       channelId,
                                       roleId,
                                       "Они не сдали долги и теперь <>.");
  let shuffled = shuffle(phrases);
  let filtered = await filterByRole(bot, guildId, roleId);
  for (const member of filtered) {
    const index = filtered.indexOf(member);
    await bot.sendMessageWithUserMention(guildId,
                                         channelId,
                                         member.id,
                                         shuffled[index % shuffled.length]);
  }
}

async function filterByRole(bot: Bot, guildId: string, roleId: string) {
  let guildMembers = await bot.getMembersOfGuild(guildId);
  return guildMembers
    .filter(member => {
      return !!member.roles.cache.get(roleId);
    });
}

function checkEnvVars(discordToken: string | undefined,
                      guildId: string | undefined,
                      channelId: string | undefined,
                      roleId: string | undefined) {
  if (discordToken === undefined
    && guildId === undefined
    && channelId === undefined
    && roleId === undefined)
    throw new Error("Environment variables must be defined.");
}

function shuffle(array: string[]): string[] {
  let currentIndex = array.length;
  let result = [...array];

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [result[currentIndex], result[randomIndex]] =
      [result[randomIndex], result[currentIndex]];
  }

  return result;
}
