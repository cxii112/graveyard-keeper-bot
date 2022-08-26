import {Client, GatewayIntentBits, IntentsBitField} from "discord.js";

export class Bot {
  private discordToken: string;
  private discordBotId: string;
  private client: Client;

  constructor(discordToken: string, discordBotId: string) {
    this.discordToken = discordToken;
    this.discordBotId = discordBotId;
    let intents = [
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageTyping,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.Guilds
    ];
    this.client = new Client({intents});
    this.client.login(discordToken)
      .then(_ => this.assignEventListeners())
      .catch(this.onFail)
    ;
    // this.assignEventListeners();
  }

  private assignEventListeners() {
    this.client.once("ready",
                     (...args) => this.onReady(...args));
  }

  private onReady(client: Client) {
    console.log("Bot is ready");
  }

  private onFail(reason: any) {
    throw new Error(`Bot login failed.\n${reason.message}`);
  }
}