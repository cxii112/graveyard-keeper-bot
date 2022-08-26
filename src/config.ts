import dotenv from "dotenv";


export function load(): Config {

  dotenv.config();
  const PORT = process.env.PORT || "3000";
  const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
  const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID;

  if (DISCORD_TOKEN === undefined) {
    throw new Error("Discord token is missing");
  }
  if (DISCORD_BOT_ID === undefined) {
    throw new Error("Discord Bot ID is missing");
  }

  return {
    PORT,
    DISCORD_TOKEN,
    DISCORD_BOT_ID,
  };
}

export interface Config {
  PORT: string,
  DISCORD_TOKEN: string,
  DISCORD_BOT_ID: string
}

// export default config;