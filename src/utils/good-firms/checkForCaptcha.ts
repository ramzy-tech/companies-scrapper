import { Page } from "puppeteer";
import delay from "../common/delay.js";
import getRandomNumber from "../common/getRandomNumber.js";
import goToNewPage from "../common/goToNewPage.js";

export default async function checkForCaptcha(page: Page) {
  let capthaElement = await page.$("#challenge-running");

  while (capthaElement) {
    const rondomNumber = getRandomNumber(15, 25);
    console.log(`Waiting for ${rondomNumber} Seconds 🥱🥱🥱`);
    await delay(rondomNumber);
    await goToNewPage(page, page.url(), {});
    capthaElement = await page.$("#challenge-running");
  }
}
