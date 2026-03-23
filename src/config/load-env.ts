import { config } from "dotenv";

config({
  path: process.env.GREEN_API_ENV_FILE || ".env"
});
