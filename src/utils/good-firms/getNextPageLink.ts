import { Page } from "puppeteer";

export default async function getNextPageLink(page: Page) {
  const nextPageButton = await page.$(".next-page a");
  if (nextPageButton) {
    const nextHref = (await page.evaluate((nextButton) => {
      return nextButton.getAttribute("href");
    }, nextPageButton)) as string;
    return nextHref;
  }
  return "";
}
