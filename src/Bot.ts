import {Client, GuildMember, IntentsBitField, roleMention, TextChannel, userMention} from "discord.js";

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
  private readonly mentionTemplate = /(<>)/gm;

  constructor(discordToken: string) {
    if (!discordToken) throw new Error("discordToken must be defined.");
    this.discordToken = discordToken;
    this.client = new Client({intents: this.intents});
  }

  public async start() {
    try {
      this.assignEventListeners();
      await this.client.login(this.discordToken);
      await this.client.guilds.fetch();
    } catch (e) {
      this.onFail(e);
    }
  }

  public async getMembersOfGuild(guildID: string): Promise<GuildMember[]> {
    const GUILD = await this.client.guilds.resolve(guildID);
    if (GUILD === undefined) return [];

    await GUILD?.members.fetch();
    if (GUILD?.members.cache.size === 0) return [];

    let members: GuildMember[] = [];
    GUILD?.members.cache.map(member => members.push(member));

    return members;
  }

  public async sendMessage(guildId: string, channelId: string, message: string) {
    let guild = await this.client.guilds.fetch(guildId);
    let channel = await guild?.channels.fetch(channelId);
    if (!channel!.isTextBased()) return;

    let textChannel = (channel as TextChannel);
    console.log(`Send "${message}" in ${guild.name} to ${textChannel.name}`)
    return textChannel.send(`${message}`);
  }

  public async sendMessageWithUserMention(guildId: string,
                                          channelId: string,
                                          userId: string,
                                          messageTemplate: string) {
    let mention = userMention(userId);
    let payload = messageTemplate.replace(this.mentionTemplate, mention);
    return this.sendMessage(guildId, channelId, payload);
  }

  public async sendMessageWithRoleMention(guildId: string,
                                          channelId: string,
                                          roleId: string,
                                          messageTemplate: string) {
    let mention = roleMention(roleId);
    let payload = messageTemplate.replace(this.mentionTemplate, mention);
    return this.sendMessage(guildId, channelId, payload);
  }

  private assignEventListeners() {
    this.client.once("ready",
                     (...args) => this.onReady(...args));
  }

  private onReady(client: Client) {
    let name = client.user!.username;
    let timestamp = new Date(client.readyTimestamp || 0);
    console.log(`Bot ${name} is ready at ${timestamp.toISOString()}`);
    client.guilds.fetch();
  }

  private onFail(reason: any) {
    throw new Error(`Bot login failed.\n${reason.message}`);
  }
}