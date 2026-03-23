import { assertApiConfig } from "../../src/config/assertions";
import { env, hasApiConfig, missingApiEnv } from "../../src/config/env";
import {
  ApiResult,
  GetChatHistoryMessage,
  GetChatHistoryRequest,
  GetStateInstanceResponse,
  GreenApiClient,
  SendMessageRequest,
  SendMessageResponse
} from "../../src/lib/green-api-client";

if (!hasApiConfig()) {
  // Visible in Jest output so it is clear why the API suites are skipped.
  // eslint-disable-next-line no-console
  console.warn(
    `GREEN-API env is incomplete. Skipping API suites. Missing: ${missingApiEnv().join(", ")}`
  );
}

export const describeIfApiConfigured = hasApiConfig() ? describe : describe.skip;

export const client = new GreenApiClient();

export async function expectAuthorizedInstance(): Promise<void> {
  assertApiConfig();

  const response = await client.getStateInstance();

  expectSuccessResponse<GetStateInstanceResponse>(response, {
    stateInstance: env.expectedState
  });
}

export function buildAutotestMessage(): string {
  return `Autotest message ${new Date().toISOString()}`;
}

export function createSendMessagePayload(
  overrides: Partial<SendMessageRequest> = {}
): SendMessageRequest {
  return {
    chatId: env.chatId,
    message: buildAutotestMessage(),
    ...overrides
  };
}

export function createChatHistoryPayload(
  overrides: Partial<GetChatHistoryRequest> = {}
): GetChatHistoryRequest {
  return {
    chatId: env.chatId,
    count: 10,
    ...overrides
  };
}

export function expectSuccessResponse<TResponse extends object>(
  response: ApiResult<TResponse>,
  expectedBody?: Partial<TResponse>
): void {
  expect(response.status).toBe(200);
  expect(response.ok).toBe(true);

  if (expectedBody) {
    expect(response.body).toEqual(expect.objectContaining(expectedBody));
  }
}

export function expectBadRequestResponse(response: ApiResult<unknown>): void {
  expect(response.status).toBe(400);
  expect(response.ok).toBe(false);
}

export function expectSendMessageSuccess(response: ApiResult<SendMessageResponse>): void {
  expectSuccessResponse(response, {
    idMessage: expect.any(String) as unknown as string
  });
}

export function expectChatHistoryShape(messages: unknown[]): void {
  expect(Array.isArray(messages)).toBe(true);

  if (messages.length > 0) {
    expect(messages[0]).toEqual(
      expect.objectContaining({
        type: expect.any(String),
        idMessage: expect.any(String),
        timestamp: expect.any(Number),
        chatId: expect.any(String)
      })
    );
  }
}
