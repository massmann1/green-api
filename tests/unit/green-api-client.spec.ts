import {
  GreenApiClient,
  GreenApiClientConfig,
  SendMessageRequest
} from "../../src/lib/green-api-client";

const TEST_CONFIG: GreenApiClientConfig = {
  apiUrl: "https://7105.api.greenapi.com/",
  instanceId: "1101000001",
  apiToken: "test-token",
  timeoutMs: 15000
};

describe("GreenApiClient", () => {
  let fetchMock: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    global.fetch = fetchMock;
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  test("builds a normalized GET request for getStateInstance", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ stateInstance: "authorized" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    const client = new GreenApiClient(TEST_CONFIG);
    const response = await client.getStateInstance();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://7105.api.greenapi.com/waInstance1101000001/getStateInstance/test-token",
      expect.objectContaining({
        method: "GET",
        body: undefined
      })
    );
    expect(response).toEqual({
      status: 200,
      ok: true,
      body: { stateInstance: "authorized" }
    });
  });

  test("serializes JSON payload for POST requests", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ idMessage: "message-id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    const payload: SendMessageRequest = {
      chatId: "79990000000@c.us",
      message: "Hello from autotest"
    };

    const client = new GreenApiClient(TEST_CONFIG);
    await client.sendMessage(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://7105.api.greenapi.com/waInstance1101000001/sendMessage/test-token",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
    );
  });

  test("returns plain text body when the response is not JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("Bad Request", {
        status: 400
      })
    );

    const client = new GreenApiClient(TEST_CONFIG);
    const response = await client.sendMessage({
      chatId: "79990000000@c.us"
    });

    expect(response).toEqual({
      status: 400,
      ok: false,
      body: "Bad Request"
    });
  });
});
