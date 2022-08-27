import {Client, GuildMember, IntentsBitField, TextChannel} from "discord.js";
import {raw} from "concurrently/dist/src/defaults";

export class Bot {
  private readonly discordToken: string;
  private client: Client;
  private intents = [
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.Guilds
  ];

  constructor(discordToken: string) {
    this.discordToken = discordToken;
    this.client = new Client({intents: this.intents});
  }

  public async start() {
    try {
      await this.client.login(this.discordToken);
      await this.client.guilds.fetch();
      this.assignEventListeners();
    } catch (e) {
      this.onFail(e);
    }
  }

  public async getMembersOfGuild(guildID: string | undefined): Promise<GuildMember[]> {
    if (guildID === undefined) return [];

    const GUILD = await this.client.guilds.resolve(guildID);
    if (GUILD === undefined) return [];

    if (GUILD?.members === undefined
      || GUILD.members === null
      || GUILD.members.cache.size === 0) return [];

    let members: GuildMember[] = [];
    GUILD.members.cache.map(member => members.push(member));

    return members;
  }

  public async sendMessage(guildId:string | undefined, channelId:string, message: string)
  {
    if (guildId === undefined) return;

    let guild = await this.client.guilds.fetch(guildId);
    let channel = await guild?.channels.fetch(channelId);
    if (!channel!.isTextBased()) return;

    let textChannel = (channel as TextChannel);
    textChannel.send(`${message}`);
  }

  private assignEventListeners() {
    this.client.once("ready",
                     (...args) => this.onReady(...args));
  }

  private onReady(client: Client) {
    let name = client.user!.username;
    let timestamp = new Date(client.readyTimestamp || 0);
    console.log(`Bot ${name} is ready at ${timestamp.toISOString()}`);
  }

  private onFail(reason: any) {
    throw new Error(`Bot login failed.\n${reason.message}`);
  }
}