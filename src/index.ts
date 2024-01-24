import puppeteer from "puppeteer";
import fs from "fs/promises";
import startClutchScraping from "./scrape/clutch-scrape.js";
import startGoodFirmsScraping from "./scrape/goodfirms-scrape.js";

(async function () {
  const websiteName = process.argv[2] as "clutch" | "goodfirms";
  if (!["clutch", "goodfirms"].includes(websiteName)) {
    console.log("Please enter a valid website name!!!");
    return;
  }

  const url =
    websiteName === "clutch"
      ? "https://clutch.co/us/web-developers?reviews=1"
      : "https://www.goodfirms.co/directory/cms/top-website-development-companies";

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await fs.writeFile("./data.json", "[");
  const startTime = performance.now();
  let endTime: number;
  try {
    websiteName === "clutch"
      ? await startClutchScraping(page, url)
      : await startGoodFirmsScraping(page, url);
  } catch (error) {
    console.error("Error:", error);
  }
  browser.close();
  await fs.appendFile("./data.json", "]");
  endTime = performance.now();
  console.log(
    `web scraping took ${Math.round(
      (endTime - startTime) / 1000 / 60
    )} Minutes to complete.`
  );
})();
