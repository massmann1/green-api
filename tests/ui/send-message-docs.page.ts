import { By, WebDriver, until } from "selenium-webdriver";

export class SendMessageDocsPage {
  constructor(
    private readonly driver: WebDriver,
    private readonly url: string
  ) {}

  async open(): Promise<void> {
    await this.driver.get(this.url);
    await this.driver.wait(until.titleContains("SendMessage"), 30000);
  }

  async getHeading(): Promise<string> {
    return this.driver.findElement(By.css("h1")).getText();
  }

  async getBodyText(): Promise<string> {
    return this.driver.findElement(By.css("body")).getText();
  }
}
