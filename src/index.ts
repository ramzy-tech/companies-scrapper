import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

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

  const pageNumber = process.argv[3]?.match(/--page=(\d+)/)?.[1];
  let url: string;
  if (websiteName === "clutch") {
    url = pageNumber
      ? `https://clutch.co/us/web-developers?page=${pageNumber}&reviews=1`
      : process.env.CLUTCH_URL!;
  } else {
    url = pageNumber
      ? `https://www.goodfirms.co/directory/cms/top-website-development-companies?page=${pageNumber}`
      : process.env.GOODFIRMS_URL!;
  }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const fileName =
    websiteName === "clutch" ? "./clutch-data.json" : "./goodfirms-data.json";
  await fs.writeFile(fileName, "[");

  const startTime = performance.now();
  let endTime: number;
  try {
    websiteName === "clutch"
      ? await startClutchScraping(page, url)
      : await startGoodFirmsScraping(page, url);
  } catch (error) {
    console.error("Error Index:", error);
  }
  browser.close();

  await fs.appendFile(fileName, "]");
  endTime = performance.now();
  console.log(
    `web scraping took ${Math.round(
      (endTime - startTime) / 1000 / 60
    )} Minutes to complete.`
  );
})();
