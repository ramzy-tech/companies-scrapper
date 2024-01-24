import { Page } from "puppeteer";
import ClutchCompanyType from "../../../types/ClutchCompany.js";
import goToNewPage from "./goToNewPage.js";
import checkAndHold from "./checkAndHold.js";

export default async function getCompanyDetails(
  companyElements: Array<Partial<ClutchCompanyType>>,
  page: Page
) {
  for (const company of companyElements) {
    try {
      await goToNewPage(page, `${company?.links?.profile}`, {
        waitUntil: "networkidle2",
      });

      await checkAndHold(page);

      const companyInfo = await page.evaluate(() => {
        const linksElements = document
          ?.querySelector(".profile-social")
          ?.querySelectorAll("a");

        const serviceElements = document?.querySelectorAll(
          ".chart-legend .chart-legend--list li"
        );

        const linksElementsArr = linksElements ? Array.from(linksElements) : [];
        const serviceElementsArr = serviceElements
          ? Array.from(serviceElements)
          : [];

        const linksArray = linksElementsArr?.map((element) => ({
          title: element.title.toLowerCase(),
          href: element.href,
        }));

        const servicesArray = serviceElementsArr?.map((serviceListItem) =>
          serviceListItem.textContent?.trim()
        );

        return { linksArray, servicesArray };
      });

      companyInfo?.linksArray.forEach(({ title, href }) => {
        company.links![title] = href;
      });

      company.services = companyInfo?.servicesArray as string[];
    } catch (error: any) {
      console.error("Error getting company links", error?.message);
    }
  }
}
