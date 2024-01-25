import { Page } from "puppeteer";
import goToNewPage from "../utils/common/goToNewPage.js";
import scrapePage from "../utils/good-firms/scrapePage.js";
import scrapeCompanyPage from "../utils/good-firms/scrapeCompanyPage.js";
import checkForCaptcha from "../utils/good-firms/checkForCaptcha.js";

export default async function startGoodFirmsScraping(page: Page, url: string) {
  // await getNewCookeis(page, process.env.GOODFIRMS_URL!);
  try {
    console.log(`Working on page ${url}`);
    await goToNewPage(page, url, { waitUntil: "networkidle2" });
    await checkForCaptcha(page);

    const companies = await scrapePage(page);
    await scrapeCompanyPage(companies, page);
    console.log(companies);
  } catch (error) {
    console.log(error);
  }
}
