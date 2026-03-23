import { expectAuthorizedInstance, describeIfApiConfigured } from "./helpers";

describeIfApiConfigured("GetStateInstance", () => {
  test("returns 200 and expected authorization state", async () => {
    await expectAuthorizedInstance();
  });
});
