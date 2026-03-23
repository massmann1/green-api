import {
  client,
  createChatHistoryPayload,
  describeIfApiConfigured,
  expectAuthorizedInstance,
  expectBadRequestResponse,
  expectChatHistoryShape,
  expectSuccessResponse
} from "./helpers";

describeIfApiConfigured("GetChatHistory", () => {
  beforeAll(async () => {
    await expectAuthorizedInstance();
  });

  test("returns 200 and message list for a valid request", async () => {
    const response = await client.getChatHistory(createChatHistoryPayload());

    expectSuccessResponse(response);

    if (Array.isArray(response.body)) {
      expectChatHistoryShape(response.body);
    }
  });

  test("returns 400 when chatId is missing", async () => {
    const response = await client.getChatHistory(createChatHistoryPayload({ chatId: undefined }));

    expectBadRequestResponse(response);
  });
});
