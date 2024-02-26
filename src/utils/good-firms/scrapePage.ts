import { Page } from "puppeteer";
import ClutchCompanyType from "../../../types/ClutchCompany.js";

export default async function scrapePage(page: Page) {
  const companiesData = await page.evaluate(() => {
    const results: Partial<ClutchCompanyType>[] = [];

    const companyElements =
      document.querySelectorAll<HTMLDivElement>("li.firm-wrapper");

    companyElements.forEach((companyElement) => {
      const companyInfo: Partial<ClutchCompanyType> = {};
      try {
        companyInfo.name =
          companyElement
            .querySelector("h3 a.visit-website")
            ?.textContent?.trim() ??
          companyElement
            .querySelector("h3 a.visit-profile")
            ?.textContent?.trim();

        companyInfo.rating = companyElement
          .querySelector(".review-rating")
          ?.textContent?.trim();

        companyInfo.tagline = companyElement
          .querySelector(".tagline")
          ?.textContent?.trim();

        companyInfo.reviews = companyElement
          .querySelector(".review-count")
          ?.textContent?.trim();

        companyInfo.hourlyRate = companyElement
          .querySelector(".firm-pricing > span")
          ?.textContent?.trim();

        companyInfo.employees = companyElement
          .querySelector(".firm-employess > span")
          ?.textContent?.trim();

        companyInfo.location = companyElement
          .querySelector(".firm-location > span")
          ?.textContent?.trim();

        companyInfo.logo = (
          companyElement.querySelector(
            ".firm-logo > img"
          ) as HTMLImageElement | null
        )?.src;

        companyInfo.links = {
          website:
            (
              companyElement.querySelector(
                "a.visit-website"
              ) as HTMLAnchorElement | null
            )?.href ?? "",
          profile:
            (
              companyElement.querySelector(
                "a.profile-link"
              ) as HTMLAnchorElement | null
            )?.href ?? "",
        };
      } catch (error: any) {
        console.error("Error scrapePage: ", error?.message);
      }

      results.push(companyInfo);
    });

    return results;
  });

  const pageNumber = page.url().match(/(?:\?|&)page=(\d+)/)?.[1] ?? "0";
  companiesData.forEach((company) => (company.page = pageNumber));

  return companiesData;
}
