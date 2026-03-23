import { WebDriver } from "selenium-webdriver";

import { assertUiConfig } from "../../src/config/assertions";
import { env } from "../../src/config/env";
import { buildWebDriver } from "../../src/lib/webdriver-factory";
import { SendMessageDocsPage } from "./send-message-docs.page";

const describeIfUiEnabled = env.runUiTests ? describe : describe.skip;

describeIfUiEnabled("SendMessage docs page", () => {
  let driver: WebDriver;
  let page: SendMessageDocsPage;

  beforeAll(async () => {
    assertUiConfig();
    driver = buildWebDriver({
      browser: env.seleniumBrowser,
      headless: env.seleniumHeadless
    });
    page = new SendMessageDocsPage(driver, env.sendMessageDocsUrl);
    await driver.manage().setTimeouts({
      pageLoad: 30000,
      script: 30000,
      implicit: 0
    });
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("renders SendMessage documentation and required request fields", async () => {
    await page.open();

    const heading = await page.getHeading();
    const body = await page.getBodyText();

    expect(heading).toContain("SendMessage");
    expect(body).toContain("chatId");
    expect(body).toContain("message");
    expect(body).toContain("/sendMessage/");
  });
});
