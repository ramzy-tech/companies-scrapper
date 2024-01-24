import { Page } from "puppeteer";

export default async function getNextPageLink(page: Page) {
  const nextPageButton = await page.$(".page-item.next a");
  if (nextPageButton) {
    const nextHref = await page.evaluate((nextButton) => {
      return nextButton.getAttribute("href");
    }, nextPageButton);
    return `https://clutch.co/${nextHref}`;
  }
  return "";
}
