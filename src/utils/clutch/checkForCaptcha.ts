import { Page } from "puppeteer";
import delay from "../common/delay.js";
import getRandomNumber from "../common/getRandomNumber.js";

export default async function checkForCaptcha(page: Page) {
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
