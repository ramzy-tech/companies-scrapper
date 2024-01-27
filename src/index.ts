import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

import puppeteer from "puppeteer";
import fs from "fs/promises";
import startClutchScraping from "./scrape/clutch-scrape.js";
import startGoodFirmsScraping from "./scrape/goodfirms-scrape.js";
import getStartingUrl from "./utils/common/root/getStartingUrl.js";

(async function () {
  try {
    const { url, websiteName, sholudRewrite } = getStartingUrl();
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const fileName =
      websiteName === "clutch" ? "./clutch-data.json" : "./goodfirms-data.json";

    sholudRewrite && (await fs.writeFile(fileName, "["));

    const startTime = performance.now();
    let endTime: number;

    websiteName === "clutch"
      ? await startClutchScraping(page, url)
      : await startGoodFirmsScraping(page, url);

    browser.close();

    await fs.appendFile(fileName, "]");
    endTime = performance.now();
    console.log(
      `web scraping took ${Math.round(
        (endTime - startTime) / 1000 / 60
      )} Minutes to complete.`
    );
  } catch (error) {
    console.error("Error Index:", error);
    process.exit(1);
  }
})();
