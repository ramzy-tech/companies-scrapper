import { Page } from "puppeteer";
import delay from "../common/delay.js";
import getRandomNumber from "../common/getRandomNumber.js";
import getNewCookeis from "./getNewCookies.js";
import goToNewPage from "./goToNewPage.js";

export default async function checkAndHold(page: Page) {
  let captchaExists = await checkForCaptcha(page);
  if (!captchaExists) return;

  console.log("Updating cookies...");

  let tolerance = 8;
  while (captchaExists) {
    await getNewCookeis(page);
    await goToNewPage(page, page.url(), {});

    tolerance--;
    tolerance > 0
      ? (captchaExists = await checkForCaptcha(page))
      : (captchaExists = false);
  }
}

async function checkForCaptcha(page: Page) {
  const capthaElement = await page.$("#challenge-running");
  if (capthaElement) {
    const rondomNumber = getRandomNumber(5, 25);
    console.log(`Waiting for ${rondomNumber} Seconds...`);
    await delay(rondomNumber);
    return true;
  } else {
    return false;
  }
}
