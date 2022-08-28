import {load} from "./config";
import {Bot} from "./Bot";
import phrases from "../resources/phrases.json";

export default async function main() {
  const {
    DISCORD_TOKEN,
    GUILD_ID,
    CHANNEL_ID,
    ROLE_ID
  } = load();
  let bot: Bot;
  try {
    checkEnvVars(DISCORD_TOKEN,GUILD_ID,CHANNEL_ID,ROLE_ID);
    bot = new Bot(DISCORD_TOKEN!);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
  await bot.start();

  setInterval(
    () => sendMentions(bot, GUILD_ID!, CHANNEL_ID!, ROLE_ID!),
    1000 * 60 * 10
  );
}

async function sendMentions(bot: Bot,
                            guildId: string,
                            channelId: string,
                            roleId: string) {
  let shuffled = shuffle(phrases);
  let filtered = await filterByRole(bot, guildId, roleId);
  filtered.forEach((member, index) => {
    bot.sendMessageWithMention(guildId,
                               channelId,
                               member.id,
                               shuffled[index]);
  });
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