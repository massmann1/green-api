import { env } from "../../src/config/env";
import {
  client,
  createSendMessagePayload,
  describeIfApiConfigured,
  expectAuthorizedInstance,
  expectBadRequestResponse,
  expectSendMessageSuccess
} from "./helpers";

describeIfApiConfigured("SendMessage", () => {
  beforeAll(async () => {
    await expectAuthorizedInstance();
  });

  test("returns 200 and idMessage for a valid request", async () => {
    const response = await client.sendMessage(createSendMessagePayload());

    expectSendMessageSuccess(response);
  });

  test("returns 400 when chatId is missing", async () => {
    const response = await client.sendMessage(createSendMessagePayload({ chatId: undefined }));

    expectBadRequestResponse(response);
  });

  test("returns 400 when message is missing", async () => {
    const response = await client.sendMessage(createSendMessagePayload({ message: undefined }));

    expectBadRequestResponse(response);
  });
});
