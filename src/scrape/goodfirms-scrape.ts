import { Page } from "puppeteer";
import goToNewPage from "../utils/common/goToNewPage.js";
import scrapePage from "../utils/good-firms/scrapePage.js";
import scrapeCompanyPage from "../utils/good-firms/scrapeCompanyPage.js";
import checkForCaptcha from "../utils/good-firms/checkForCaptcha.js";
import getNextPageLink from "../utils/good-firms/getNextPageLink.js";
import { saveDataToFile } from "../utils/common/saveDataToFile.js";
import delay from "../utils/common/delay.js";

export default async function startGoodFirmsScraping(page: Page, url: string) {
  let nextPageUrl = url,
    errorsNumber = 0;
  do {
    try {
      console.log(`Working on page ${nextPageUrl}`);
      if (errorsNumber > 6) break;

      await goToNewPage(page, nextPageUrl, { waitUntil: "networkidle2" });
      await checkForCaptcha(page);

      nextPageUrl = await getNextPageLink(page);

      const companies = await scrapePage(page);
      await scrapeCompanyPage(companies, page); // To get the social media links

      await saveDataToFile(companies, "../../../goodfirms-data.json");
    } catch (error) {
      delay(2 * errorsNumber);
      console.log("StartGoodFirmsScraping: ", error);
      errorsNumber++;
    }
  } while (nextPageUrl);
}
