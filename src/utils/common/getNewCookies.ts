import { Page } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import goToNewPage from "./goToNewPage.js";

export default async function getNewCookeis(page: Page, sourceUrl: string) {
  // Clear all cookies
  const oldCookies = await page.cookies();
  await page.deleteCookie(...oldCookies);

  console.log("Getting new set of cookies...");
  // Disable type checking for puppeteerExtra
  const puppeteerExtraAny: any = puppeteerExtra;
  puppeteerExtraAny.use(StealthPlugin());
  const browser = await puppeteerExtraAny.launch({ headless: false });
  const newPage = await browser.newPage();

  await goToNewPage(newPage, sourceUrl, {
    waitUntil: "networkidle2",
  });

  const newCookies = await newPage.cookies();
  await browser.close();
  await page.setCookie(...newCookies);
}
