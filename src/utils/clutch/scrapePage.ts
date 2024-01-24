import { Page } from "puppeteer";
import path from "path";
import fs from "fs/promises";
import ClutchCompanyType from "../../../types/ClutchCompany.js";
import getCompanyDetails from "./getCompanyDetails.js";

export default async function scrapePage(page: Page) {
  const companiesData = await page.evaluate(() => {
    const results: Partial<ClutchCompanyType>[] = [];
    const companyElements =
      document.querySelectorAll<HTMLDivElement>(".provider-row");
    companyElements.forEach((companyElement) => {
      const companyInfo: Partial<ClutchCompanyType> = {};

      try {
        companyInfo.name = companyElement
          .querySelector(".company_info a")
          ?.textContent?.trim();

        companyInfo.rating = companyElement
          .querySelector(".rating-reviews .rating")
          ?.textContent?.trim();

        companyInfo.tagline = companyElement
          .querySelector(".tagline")
          ?.textContent?.trim();

        companyInfo.reviews = companyElement
          .querySelector(".reviews-link")
          ?.textContent?.trim();

        companyInfo.minProjectSize = companyElement
          .querySelector('.module-list div[data-content*="Min"] span')
          ?.textContent?.trim();

        companyInfo.hourlyRate = companyElement
          .querySelector('.module-list div[data-content*="hourly rate"] span')
          ?.textContent?.trim();

        companyInfo.employees = companyElement
          .querySelector('.module-list div[data-content*="Employees"] span')
          ?.textContent?.trim();

        companyInfo.location = companyElement
          .querySelector('.module-list div[data-content*="Location"] span')
          ?.textContent?.trim();

        companyInfo.logo =
          (
            companyElement.querySelector(
              ".company_logotype img"
            ) as HTMLImageElement | null
          )?.src ||
          (
            companyElement.querySelector(
              ".company_logotype img"
            ) as HTMLImageElement | null
          )?.dataset.src;

        companyInfo.links = {
          website:
            (
              companyElement.querySelector(
                ".website-link a"
              ) as HTMLAnchorElement | null
            )?.href ?? "",
          profile:
            (
              companyElement.querySelector(
                ".website-profile a"
              ) as HTMLAnchorElement | null
            )?.href ?? "",
        };
      } catch (error: any) {
        console.error("Error getting company info ", error?.message);
      }

      results.push(companyInfo);
    });

    return results;
  });

  try {
    await getCompanyDetails(companiesData, page);
    const newDataString = JSON.stringify(companiesData, null, 2)
      .replace(/^\[|\]$/g, "")
      .concat(",");
    await fs.appendFile(
      path.join(__dirname, "..", "data.json"),
      newDataString,
      "utf8"
    );
    console.log("Data appended to file successfully!");
  } catch (error: any) {
    console.error("Error appending data to file:", error?.message);
  }
}
