import { env, hasApiConfig, missingApiEnv } from "./env";

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}

export function assertApiConfig(): void {
  if (!hasApiConfig()) {
    throw new Error(
      `GREEN-API env is incomplete. Missing variables: ${missingApiEnv().join(", ")}`
    );
  }

  if (!isHttpUrl(env.apiUrl)) {
    throw new Error("GREEN_API_URL must start with http or https.");
  }

  if (!env.chatId.endsWith("@c.us") && !env.chatId.endsWith("@g.us")) {
    throw new Error("GREEN_API_CHAT_ID must end with @c.us or @g.us.");
  }
}

export function assertUiConfig(): void {
  if (!isHttpUrl(env.sendMessageDocsUrl)) {
    throw new Error("SEND_MESSAGE_DOCS_URL must start with http or https.");
  }
}
