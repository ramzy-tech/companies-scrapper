import { Page } from "puppeteer";
import getNewCookeis from "./getNewCookies.js";
import goToNewPage from "./goToNewPage.js";

export default async function checkAndHold(
  page: Page,
  cookiesUrl: string,
  checkForCaptchaCb: Function
) {
  let captchaExists = await checkForCaptchaCb(page);
  if (!captchaExists) return;

  console.log("Updating cookies...");

  let tolerance = 8;
  while (captchaExists) {
    await getNewCookeis(page, cookiesUrl);
    await goToNewPage(page, page.url(), {});

    tolerance--;
    tolerance > 0
      ? (captchaExists = await checkForCaptchaCb(page))
      : (captchaExists = false);
  }
}
