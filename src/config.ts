import dotenv from "dotenv";


export function load(): Config {

  dotenv.config();
  const PORT = process.env.PORT || "3000";
  const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
  const GUILD_ID = process.env.GUILD_ID;

  if (DISCORD_TOKEN === undefined) {
    throw new Error("Discord token is missing");
  }

  return {
    PORT,
    DISCORD_TOKEN,
    GUILD_ID,
  };
}

export interface Config {
  PORT: string,
  DISCORD_TOKEN: string,
  GUILD_ID: string | undefined,
}
