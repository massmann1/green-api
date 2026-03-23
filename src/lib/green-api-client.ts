import { env } from "../config/env";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface ApiResult<TSuccess, TFailure = JsonValue> {
  status: number;
  ok: boolean;
  body: TSuccess | TFailure;
}

export interface GetStateInstanceResponse {
  stateInstance: string;
}

export interface SendMessageRequest {
  chatId?: string;
  message?: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface GetChatHistoryRequest {
  chatId?: string;
  count?: number;
}

export interface GetChatHistoryMessage {
  type: string;
  idMessage: string;
  timestamp: number;
  chatId: string;
  typeMessage?: string;
  textMessage?: string;
  statusMessage?: string;
}

export interface GreenApiClientConfig {
  apiUrl: string;
  instanceId: string;
  apiToken: string;
  timeoutMs: number;
}

const GREEN_API_ENDPOINTS = {
  getStateInstance: { method: "GET" },
  sendMessage: { method: "POST" },
  getChatHistory: { method: "POST" }
} as const;

type GreenApiEndpoint = keyof typeof GREEN_API_ENDPOINTS;
type GreenApiMethod = (typeof GREEN_API_ENDPOINTS)[GreenApiEndpoint]["method"];

export function createGreenApiClientConfig(
  overrides: Partial<GreenApiClientConfig> = {}
): GreenApiClientConfig {
  return {
    apiUrl: env.apiUrl,
    instanceId: env.instanceId,
    apiToken: env.apiToken,
    timeoutMs: env.requestTimeoutMs,
    ...overrides
  };
}

export class GreenApiClient {
  constructor(private readonly config: GreenApiClientConfig = createGreenApiClientConfig()) {}

  async getStateInstance(): Promise<ApiResult<GetStateInstanceResponse>> {
    return this.request<GetStateInstanceResponse>("getStateInstance");
  }

  async sendMessage(payload: SendMessageRequest): Promise<ApiResult<SendMessageResponse>> {
    return this.request<SendMessageResponse>("sendMessage", payload);
  }

  async getChatHistory(payload: GetChatHistoryRequest): Promise<ApiResult<GetChatHistoryMessage[]>> {
    return this.request<GetChatHistoryMessage[]>("getChatHistory", payload);
  }

  private async request<TResponse>(
    endpoint: GreenApiEndpoint,
    body?: object
  ): Promise<ApiResult<TResponse>> {
    const response = await fetch(this.buildUrl(endpoint), this.buildRequestInit(endpoint, body));
    const payload = await this.parseResponseBody(response);

    return {
      status: response.status,
      ok: response.ok,
      body: payload as TResponse | JsonValue
    };
  }

  private buildRequestInit(endpoint: GreenApiEndpoint, body?: object): RequestInit {
    const method = GREEN_API_ENDPOINTS[endpoint].method as GreenApiMethod;

    return {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(this.config.timeoutMs)
    };
  }

  private buildUrl(endpoint: GreenApiEndpoint): string {
    const normalizedBaseUrl = this.config.apiUrl.replace(/\/+$/, "");

    return `${normalizedBaseUrl}/waInstance${this.config.instanceId}/${endpoint}/${this.config.apiToken}`;
  }

  private async parseResponseBody(response: Response): Promise<JsonValue> {
    const text = await response.text();
    return text ? this.parseJson(text) : null;
  }

  private parseJson(text: string): JsonValue {
    try {
      return JSON.parse(text) as JsonValue;
    } catch {
      return text;
    }
  }
}
