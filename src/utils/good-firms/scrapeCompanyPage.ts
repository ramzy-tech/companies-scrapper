import { Page } from "puppeteer";
import ClutchCompanyType from "../../../types/ClutchCompany.js";
import goToNewPage from "../common/goToNewPage.js";
import checkForCaptcha from "./checkForCaptcha.js";

export default async function scrapeCompanyPage(
  companies: Partial<ClutchCompanyType>[],
  page: Page
) {
  for (const company of companies) {
    try {
      await goToNewPage(page, `${company?.links?.profile}`, {
        waitUntil: "networkidle2",
      });
      await checkForCaptcha(page);

      const companyInfo = await page.evaluate(() => {
        const linksElements = document
          ?.querySelector(".social-profile")
          ?.querySelectorAll("a");

        const serviceElements = document?.querySelectorAll(
          "ul.focus-area-legend:first-of-type li"
        );

        const linksElementsArr = linksElements ? Array.from(linksElements) : [];
        const serviceElementsArr = serviceElements
          ? Array.from(serviceElements)
          : [];

        const linksArray = linksElementsArr?.map((element) => ({
          title: element
            .getAttribute("data-content")
            ?.match(/<i>(.*?)<\/i>/)?.[1],
          href: element.href,
        }));

        const servicesArray = serviceElementsArr?.map((serviceListItem) =>
          serviceListItem.textContent?.trim()
        );

        return { linksArray, servicesArray };
      });
      companyInfo?.linksArray.forEach(({ title, href }) => {
        if (title) company.links![title] = href;
      });
      company.services = companyInfo?.servicesArray as string[];
    } catch (error: any) {
      console.error("Error scrapeCompanyPage: ", error?.message);
    }
  }
}
