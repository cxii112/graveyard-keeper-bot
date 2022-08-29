import {load} from "./config";
import {Bot} from "./Bot";
import phrases from "./phrases.json";

export default async function main() {
  const {
    DISCORD_TOKEN,
    GUILD_ID,
    CHANNEL_ID,
    ROLE_ID,
    TIME_INTERVAL
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

  sendMentions(bot, GUILD_ID!, CHANNEL_ID!, ROLE_ID!);
  setInterval(
    () => {
      sendMentions(bot, GUILD_ID!, CHANNEL_ID!, ROLE_ID!);
    },
    Number(TIME_INTERVAL!)
  );
}

async function sendMentions(bot: Bot,
                            guildId: string,
                            channelId: string,
                            roleId: string) {
  bot.sendMessageWithRoleMention(guildId, channelId, roleId, "Перекличка, <>.");
  let shuffled = shuffle(phrases);
  let filtered = await filterByRole(bot, guildId, roleId);
  filtered.forEach((member, index) => {
    bot.sendMessageWithUserMention(guildId, channelId, member.id, shuffled[index % shuffled.length]);
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