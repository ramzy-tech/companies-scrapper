import { Page } from "puppeteer";
import getNewCookeis from "../utils/common/getNewCookies.js";
import goToNewPage from "../utils/common/goToNewPage.js";
import delay from "../utils/common/delay.js";
import checkAndHold from "../utils/common/checkAndHold.js";
import getNextPageLink from "../utils/clutch/getNextPageLink.js";
import scrapePage from "../utils/clutch/scrapePage.js";
import checkForCaptcha from "../utils/clutch/checkForCaptcha.js";

export default async function startClutchScraping(page: Page, url: string) {
  let errorsNumber = 0;
  await getNewCookeis(page, process.env.CLUTCH_URL!);
  do {
    try {
      console.log(`Working on page ${url}`);
      if (errorsNumber > 6) break;
      await goToNewPage(page, url, { waitUntil: "networkidle2" });
      await checkAndHold(page, process.env.CLUTCH_URL!, checkForCaptcha);

      await scrapePage(page);
      url = await getNextPageLink(page);
    } catch (error) {
      delay(2 * errorsNumber);
      console.log(error);
      errorsNumber++;
    }
  } while (url);
}
