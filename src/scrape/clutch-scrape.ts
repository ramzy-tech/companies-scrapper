import { Page } from "puppeteer";
import getNewCookeis from "../utils/common/getNewCookies.js";
import goToNewPage from "../utils/common/goToNewPage.js";
import delay from "../utils/common/delay.js";
import checkAndHold from "../utils/common/checkAndHold.js";
import getNextPageLink from "../utils/clutch/getNextPageLink.js";
import scrapePage from "../utils/clutch/scrapePage.js";
import checkForCaptcha from "../utils/clutch/checkForCaptcha.js";
import getCompanyDetails from "../utils/clutch/getCompanyDetails.js";
import { saveDataToFile } from "../utils/common/saveDataToFile.js";

export default async function startClutchScraping(page: Page, url: string) {
  let errorsNumber = 0,
    nextPage = url;
  await getNewCookeis(page, process.env.CLUTCH_URL!);
  do {
    try {
      console.log(`Working on page ${nextPage}`);
      if (errorsNumber > 6) break;
      await goToNewPage(page, nextPage, { waitUntil: "networkidle2" });
      await checkAndHold(page, process.env.CLUTCH_URL!, checkForCaptcha);

      nextPage = await getNextPageLink(page);
      const companies = await scrapePage(page);
      await getCompanyDetails(companies, page);

      await saveDataToFile(companies, "../../../clutch-data.json");
    } catch (error) {
      delay(2 * errorsNumber);
      console.log("StartClutchScraping: ", error);
      errorsNumber++;
    }
  } while (nextPage);
}
