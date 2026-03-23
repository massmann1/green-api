import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";

import { SupportedBrowser } from "../config/env";

export interface WebDriverFactoryOptions {
  browser: SupportedBrowser;
  headless: boolean;
}

export function buildWebDriver(options: WebDriverFactoryOptions): WebDriver {
  switch (options.browser) {
    case "firefox":
      return buildFirefoxDriver(options.headless);
    case "chrome":
    default:
      return buildChromeDriver(options.headless);
  }
}

function buildChromeDriver(headless: boolean): WebDriver {
  const builder = new Builder().forBrowser("chrome");
  const options = new chrome.Options();

  if (headless) {
    options.addArguments("--headless=new", "--window-size=1440,1200");
  }

  return builder.setChromeOptions(options).build();
}

function buildFirefoxDriver(headless: boolean): WebDriver {
  const builder = new Builder().forBrowser("firefox");
  const options = new firefox.Options();

  if (headless) {
    options.addArguments("-headless");
  }

  return builder.setFirefoxOptions(options).build();
}
