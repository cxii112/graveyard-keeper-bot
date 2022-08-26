import {Client, Guild, IntentsBitField} from "discord.js";

export class Bot {
  private _isReady: boolean = false;
  private discordToken: string;
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
    this.client.login(discordToken)
      .then(_ => this.assignEventListeners())
      .catch(this.onFail);
  }

  public get isReady(): boolean {
    return this._isReady;
  }

  public getMembersOfGuild(guildID: string | undefined) {
    if (guildID === undefined) return [];

    const GUILD = this.client.guilds.resolve(guildID);
    if (GUILD === undefined) return [];
    if (GUILD?.members === undefined || GUILD.members === null) return [];

    GUILD.members.cache.map(member => {
      console.log(`${member.id} ${member.user.username}` +
                    `${member.nickname ? ` aka ${member.nickname}` : ""}`);
    });

    return GUILD.members;
  }

  private assignEventListeners() {
    this.client.once("ready",
                     (...args) => this.onReady(...args));
  }

  private onReady(client: Client) {
    this._isReady = true;
    let name = client.user!.username;
    let timestamp = new Date(client.readyTimestamp || 0);
    console.log(`Bot ${name} is ready at ${timestamp.toISOString()}`);
  }

  private onFail(reason: any) {
    throw new Error(`Bot login failed.\n${reason.message}`);
  }
}