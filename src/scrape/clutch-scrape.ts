import { Page } from "puppeteer";
import getNewCookeis from "../utils/clutch/getNewCookies.js";
import goToNewPage from "../utils/clutch/goToNewPage.js";
import delay from "../utils/common/delay.js";
import checkAndHold from "../utils/clutch/checkAndHold.js";
import getNextPageLink from "../utils/clutch/getNextPageLink.js";
import scrapePage from "../utils/clutch/scrapePage.js";

export default async function startClutchScraping(page: Page, url: string) {
  let errorsNumber = 0;
  await getNewCookeis(page);
  do {
    try {
      console.log(`Working on page ${url}`);
      if (errorsNumber > 6) break;
      await goToNewPage(page, url, { waitUntil: "networkidle2" });

      await checkAndHold(page);

      url = await getNextPageLink(page);
      await scrapePage(page);
    } catch (error) {
      delay(2 * errorsNumber);
      console.log(error);
      errorsNumber++;
    }
  } while (url);
}
