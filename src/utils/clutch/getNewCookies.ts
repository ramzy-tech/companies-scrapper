import { Page } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import goToNewPage from "./goToNewPage.js";

export default async function getNewCookeis(page: Page) {
  // Clear all cookies
  const oldCookies = await page.cookies();
  await page.deleteCookie(...oldCookies);

  console.log("Getting new set of cookies...");
  // Disable type checking for puppeteerExtra
  const puppeteerExtraAny: any = puppeteerExtra;
  puppeteerExtraAny.use(StealthPlugin());
  const browser = await puppeteerExtraAny.launch({ headless: false });
  const newPage = await browser.newPage();

  await goToNewPage(newPage, "https://clutch.co/us/web-developers?reviews=1", {
    waitUntil: "networkidle2",
  });
  // // Wait until all the cookies are added to the page
  // await page.waitForFunction(() => {
  //   // Check the condition to determine if all cookies are added
  //   return document.cookie.split(";").length >= 25;
  // });

  const newCookies = await newPage.cookies();
  await browser.close();
  await page.setCookie(...newCookies);
}
