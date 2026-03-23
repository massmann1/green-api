const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_DOCS_URL = "https://green-api.com/docs/api/sending/SendMessage/";
const SUPPORTED_BROWSERS = ["chrome", "firefox"] as const;
const REQUIRED_API_ENV_KEYS = [
  "GREEN_API_URL",
  "GREEN_API_INSTANCE_ID",
  "GREEN_API_TOKEN",
  "GREEN_API_CHAT_ID"
] as const;

export type SupportedBrowser = (typeof SUPPORTED_BROWSERS)[number];

function readString(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

function readPositiveNumber(name: string, fallback: number): number {
  const parsed = Number(readString(name));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const value = readString(name).toLowerCase();

  if (!value) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value);
}

function readBrowser(name: string, fallback: SupportedBrowser): SupportedBrowser {
  const value = readString(name, fallback).toLowerCase();

  return SUPPORTED_BROWSERS.includes(value as SupportedBrowser)
    ? (value as SupportedBrowser)
    : fallback;
}

export const env = Object.freeze({
  apiUrl: readString("GREEN_API_URL"),
  instanceId: readString("GREEN_API_INSTANCE_ID"),
  apiToken: readString("GREEN_API_TOKEN"),
  chatId: readString("GREEN_API_CHAT_ID"),
  expectedState: readString("GREEN_API_EXPECTED_STATE", "authorized"),
  requestTimeoutMs: readPositiveNumber("GREEN_API_REQUEST_TIMEOUT_MS", DEFAULT_TIMEOUT_MS),
  runUiTests: readBoolean("RUN_UI_TESTS", false),
  seleniumBrowser: readBrowser("SELENIUM_BROWSER", "chrome"),
  seleniumHeadless: readBoolean("SELENIUM_HEADLESS", true),
  sendMessageDocsUrl: readString("SEND_MESSAGE_DOCS_URL", DEFAULT_DOCS_URL)
});

export function missingApiEnv(): string[] {
  const requiredValues = {
    GREEN_API_URL: env.apiUrl,
    GREEN_API_INSTANCE_ID: env.instanceId,
    GREEN_API_TOKEN: env.apiToken,
    GREEN_API_CHAT_ID: env.chatId
  };

  return REQUIRED_API_ENV_KEYS.filter((key) => !requiredValues[key]);
}

export function hasApiConfig(): boolean {
  return missingApiEnv().length === 0;
}
